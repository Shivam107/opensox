import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import prismaModule from "../prisma.js";
import {
  PAYMENT_STATUS,
  SUBSCRIPTION_STATUS,
} from "../constants/subscription.js";
import { randomBytes } from "crypto";

const { prisma } = prismaModule;

// Generate simple ID
function generateId(): string {
  return randomBytes(16).toString("hex");
}

interface PaymentRow {
  id: string;
  amount: string;
  currency: string;
  status: string;
  order_id: string;
  email: string;
  notes: string;
  start_date: string; // Payment date from CSV
  subscription_start_date?: string; // Optional custom subscription start date
}

// Parse date from "DD/MM/YYYY HH:mm:ss" format
function parseRazorpayDate(dateStr: string): Date {
  const parts = dateStr.split(" ");
  const datePart = parts[0];
  const timePart = parts[1] || "00:00:00";

  if (!datePart) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  const dateComponents = datePart.split("/");
  const day = dateComponents[0];
  const month = dateComponents[1];
  const year = dateComponents[2];

  if (!day || !month || !year) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }

  return new Date(`${year}-${month}-${day}T${timePart}`);
}

// Extract email from notes JSON or use email column
function extractEmail(row: PaymentRow): string | null {
  if (row.email && !row.email.includes("void@razorpay.com")) {
    return row.email.trim().toLowerCase();
  }

  try {
    const notes = JSON.parse(row.notes || "{}");
    if (notes.email) {
      return notes.email.trim().toLowerCase();
    }
  } catch (e) {
    // Invalid JSON
  }

  return null;
}

// Extract name from notes
function extractName(row: PaymentRow): string {
  try {
    const notes = JSON.parse(row.notes || "{}");
    if (notes.name) {
      return notes.name.trim();
    }
  } catch (e) {
    // Invalid JSON
  }

  const email = extractEmail(row);
  return email?.split("@")[0] ?? "User";
}

// Convert INR to paise
function convertToPaise(amountStr: string): number {
  return Math.round(parseFloat(amountStr) * 100);
}

// Map status
function mapPaymentStatus(
  status: string
): (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS] {
  const statusMap: Record<
    string,
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
  > = {
    captured: PAYMENT_STATUS.CAPTURED,
    authorized: PAYMENT_STATUS.AUTHORIZED,
    refunded: PAYMENT_STATUS.REFUNDED,
    failed: PAYMENT_STATUS.FAILED,
    created: PAYMENT_STATUS.CREATED,
  };
  return statusMap[status.toLowerCase()] || PAYMENT_STATUS.CREATED;
}

async function importPremiumUsers(csvFilePath: string, planId: string) {
  console.log("📖 Reading CSV file...");
  const fileContent = readFileSync(csvFilePath, "utf-8");

  console.log("📊 Parsing CSV...");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as PaymentRow[];

  console.log(`✅ Found ${records.length} rows\n`);

  // Connect to database
  await prismaModule.connectDB();

  // Verify plan exists
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    console.error(`❌ Plan with ID "${planId}" not found!`);
    console.error("\nCreate the plan first:");
    console.error(`
      INSERT INTO "Plan" (id, name, "interval", price, currency, "createdAt", "updatedAt")
      VALUES (
        'premium_yearly',
        'Opensox Premium',
        'yearly',
        450000,
        'INR',
        NOW(),
        NOW()
      );
    `);
    process.exit(1);
  }

  console.log(`✅ Using plan: ${plan.name} (${planId})\n`);

  let successCount = 0;
  let skippedCount = 0;
  const errors: string[] = [];

  console.log("🔄 Processing payments...\n");

  for (const row of records) {
    try {
      const email = extractEmail(row);
      if (!email) {
        skippedCount++;
        console.log(`⏭️  Skipping ${row.id}: No valid email`);
        continue;
      }

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        const name = extractName(row);
        user = await prisma.user.create({
          data: {
            email,
            firstName: name,
            authMethod: "csv_import",
          },
        });
        console.log(`👤 Created user: ${email}`);
      }

      // Check if payment already exists
      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayPaymentId: row.id },
      });

      if (existingPayment) {
        skippedCount++;
        console.log(`⏭️  Skipping ${row.id}: Payment already exists`);
        continue;
      }

      // Determine subscription start date
      // Use custom subscription_start_date if provided, otherwise use payment date (start_date)
      let startDate: Date;
      if (row.subscription_start_date && row.subscription_start_date.trim()) {
        // Try parsing as ISO date first
        startDate = new Date(row.subscription_start_date);
        if (isNaN(startDate.getTime())) {
          // If invalid, try Razorpay date format
          startDate = parseRazorpayDate(row.subscription_start_date);
        }
      } else {
        // Use payment date as subscription start date
        startDate = parseRazorpayDate(row.start_date);
      }

      // Calculate end date (1 year from start)
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      // Create payment (use start_date as payment creation date)
      const payment = await prisma.payment.create({
        data: {
          userId: user.id,
          razorpayPaymentId: row.id,
          razorpayOrderId: row.order_id,
          amount: convertToPaise(row.amount),
          currency: row.currency || "INR",
          status: mapPaymentStatus(row.status),
          createdAt: parseRazorpayDate(row.start_date),
        },
      });

      // Check if subscription already exists for this user
      let subscription = await prisma.subscription.findFirst({
        where: {
          userId: user.id,
          planId: planId,
          status: SUBSCRIPTION_STATUS.ACTIVE,
        },
      });

      if (!subscription) {
        // Create subscription
        subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            planId: planId,
            status: SUBSCRIPTION_STATUS.ACTIVE,
            startDate: startDate,
            endDate: endDate,
            autoRenew: true,
          },
        });
      } else {
        // Update existing subscription if new payment extends it
        if (endDate > subscription.endDate!) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              endDate: endDate,
              status: SUBSCRIPTION_STATUS.ACTIVE,
            },
          });
          console.log(
            `📅 Extended subscription for ${email} until ${endDate.toISOString().split("T")[0]}`
          );
        }
      }

      // Link payment to subscription
      await prisma.payment.update({
        where: { id: payment.id },
        data: { subscriptionId: subscription.id },
      });

      successCount++;
      console.log(
        `✅ ${email} - ₹${row.amount} (${row.id}) | Start: ${startDate.toISOString().split("T")[0]}`
      );
    } catch (error: any) {
      errors.push(`Error processing ${row.id}: ${error.message}`);
      console.error(`❌ Error processing ${row.id}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 Import Summary:");
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`❌ Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log("\nErrors:");
    errors.forEach((err) => console.log(`  - ${err}`));
  }
  console.log("=".repeat(60));

  await prisma.$disconnect();
}

// Run script
const csvFilePath = process.argv[2];
const planId = process.argv[3] || "premium_yearly";

if (!csvFilePath) {
  console.error("Usage: tsx import-premium-users.ts <csv-file-path> [plan-id]");
  console.error("\nExample:");
  console.error(
    '  tsx import-premium-users.ts "/Users/ajeetpratapsingh/Downloads/users.csv" premium_yearly'
  );
  process.exit(1);
}

importPremiumUsers(csvFilePath, planId)
  .then(() => {
    console.log("\n✅ Import completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  });
