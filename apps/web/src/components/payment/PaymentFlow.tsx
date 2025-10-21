"use client";

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useRazorpay } from "@/hooks/useRazorpay";
import type { RazorpayOptions } from "@/lib/razorpay";
import PrimaryButton from "@/components/ui/custom-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PaymentFlowProps {
  amount: number;
  currency?: string;
  planName?: string;
  description?: string;
  buttonText?: string;
  buttonClassName?: string;
}

/**
 * Complete Payment Flow Component
 *
 * This component:
 * 1. Creates a Razorpay order via tRPC
 * 2. Opens Razorpay checkout
 * 3. Handles payment success/failure
 *
 * Usage:
 * ```tsx
 * <PaymentFlow
 *   amount={4900} // Amount in rupees (will be converted to paise)
 *   planName="Opensox Premium"
 *   description="Annual Subscription"
 *   buttonText="Subscribe Now"
 * />
 * ```
 */
const PaymentFlow: React.FC<PaymentFlowProps> = ({
  amount,
  currency = "INR",
  planName = "Opensox Premium",
  description = "Payment",
  buttonText = "Invest",
  buttonClassName,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const utils = trpc.useUtils();

  const { initiatePayment, isLoading, error } = useRazorpay({
    onSuccess: (response) => {
      console.log("Payment successful:", response);
      router.push("/checkout");
    },
    onFailure: (error) => {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    },
    onDismiss: () => {
      setIsProcessing(false);
    },
  });

  const handlePayment = async () => {
    try {
      // Check if user is logged in
      if (!session) {
        // Redirect to login with return URL to come back to pricing
        router.push("/login?callbackUrl=/pricing");
        return;
      }

      setIsProcessing(true);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      // Create order via tRPC
      const order = await (utils.client.payment as any).createOrder.mutate({
        amount: amount * 100, // Convert to paise (smallest currency unit)
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan: planName,
          user_email: session?.user?.email || "guest",
        },
      });

      // Immediately open Razorpay checkout with the order
      const options: Omit<RazorpayOptions, "handler" | "modal"> = {
        key: razorpayKey,
        amount: (amount * 100).toString(),
        currency,
        name: planName,
        description,
        image: "https://opensox.ai/assets/logo.svg",
        order_id: order.id,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        notes: {
          plan: planName,
        },
        theme: {
          color: "#a472ea",
        },
      };

      await initiatePayment(options);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <PrimaryButton
        classname={`${buttonClassName || "w-full"} ${isProcessing || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={isProcessing || isLoading ? undefined : handlePayment}
      >
        {isProcessing || isLoading ? "Processing..." : buttonText}
      </PrimaryButton>
      {error && <p className="text-sm text-red-500">Payment error: {error}</p>}
    </div>
  );
};

export default PaymentFlow;
