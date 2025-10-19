import { router, protectedProcedure } from "../trpc.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { paymentService } from "../services/payment.service.js";

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z
    .string()
    .min(3, "Currency must be at least 3 characters")
    .max(3, "Currency must be 3 characters"),
  receipt: z.string().min(1, "Receipt is required"),
  notes: z.record(z.string(), z.string()).optional(),
});

export const paymentRouter = router({
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(
      async ({ input }: { input: z.infer<typeof createOrderSchema> }) => {
        try {
          const result = await paymentService.createOrder({
            amount: input.amount,
            currency: input.currency,
            receipt: input.receipt,
            ...(input.notes && { notes: input.notes }),
          });

          // Check if it's an error response
          if ("error" in result) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: result.error.description,
              cause: result.error,
            });
          }

          return result;
        } catch (error: any) {
          if (error instanceof TRPCError) {
            throw error;
          }

          if (process.env.NODE_ENV !== "production") {
            console.error("Payment order creation error:", error);
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create payment order",
          });
        }
      }
    ),
});
