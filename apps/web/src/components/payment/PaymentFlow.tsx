"use client";

import React, { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useRazorpay } from "@/hooks/useRazorpay";
import type { RazorpayOptions } from "@/lib/razorpay";
import PrimaryButton from "@/components/ui/custom-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PaymentFlowProps {
  planId: string; // Required: Plan ID from database
  planName?: string;
  description?: string;
  buttonText?: string;
  buttonClassName?: string;
}

/**
 * Complete Payment Flow Component
 *
 * This component:
 * 1. Creates a Razorpay order via tRPC (backend fetches price from plan)
 * 2. Opens Razorpay checkout
 * 3. Verifies payment signature on success
 * 4. Creates subscription and stores payment record
 *
 * Usage:
 * ```tsx
 * <PaymentFlow
 *   planId="plan_xyz123" // Required: Plan ID from database
 *   planName="Opensox Premium"
 *   description="Annual Subscription"
 *   buttonText="Subscribe Now"
 * />
 * ```
 */
const PaymentFlow: React.FC<PaymentFlowProps> = ({
  planId,
  planName = "Opensox Premium",
  description = "Payment",
  buttonText = "Invest",
  buttonClassName,
}) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const orderDataRef = useRef<{
    orderId: string;
    amount: number; // Stored for display purposes only
  } | null>(null);

  const utils = trpc.useUtils();

  const { initiatePayment, isLoading, error } = useRazorpay({
    onSuccess: async (response) => {
      try {
        setIsProcessing(true);

        if (!orderDataRef.current) {
          throw new Error("Order data not found");
        }

        // Call backend verification endpoint
        await (utils.client.payment as any).verifyPayment.mutate({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          planId: planId,
        });

        // Show success and redirect
        router.push("/checkout");
      } catch (error) {
        console.error("Verification failed:", error);
        alert("Payment verification failed. Please contact support.");
        setIsProcessing(false);
      }
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
      if (sessionStatus === "loading") {
        return;
      }

      if (sessionStatus === "unauthenticated" || !session) {
        router.push("/login?callbackUrl=/pricing");
        return;
      }

      setIsProcessing(true);

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      // Create order via tRPC - backend will fetch plan and use its price
      // Note: user_id will be obtained from JWT token on backend
      const order = await (utils.client.payment as any).createOrder.mutate({
        planId: planId,
        receipt: `opensox_${Date.now()}`,
        notes: {
          plan: planName,
          user_email: session.user?.email || "",
        },
      });

      // Store order data for display purposes
      orderDataRef.current = {
        orderId: order.id,
        amount: order.amount, // Amount from backend response
      };

      // Immediately open Razorpay checkout with the order
      const options: Omit<RazorpayOptions, "handler" | "modal"> = {
        key: razorpayKey,
        amount: order.amount.toString(),
        currency: order.currency,
        name: planName,
        description,
        image: "https://opensox.ai/assets/logo.svg",
        order_id: order.id,
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        notes: {
          plan: planName,
          plan_id: planId,
        },
        theme: {
          color: "#a472ea",
        },
      };

      await initiatePayment(options);
    } catch (error: any) {
      console.warn("Failed to create order:", error);
      setIsProcessing(false);

      // Only redirect to login if it's an authentication error
      const isAuthError =
        error?.data?.code === "UNAUTHORIZED" ||
        error?.message?.includes("UNAUTHORIZED") ||
        error?.message?.includes("Missing or invalid authorization") ||
        error?.message?.includes("Invalid or expired token");

      if (isAuthError) {
        router.push("/login?callbackUrl=/pricing");
      } else {
        // For other errors (network, validation, etc.), show user-friendly message
        alert(
          "Failed to create payment order. Please try again or contact support if the issue persists."
        );
      }
    }
  };

  // Show loading state while session is being determined
  const isButtonDisabled =
    isProcessing || isLoading || sessionStatus === "loading";

  const buttonTextDisplay =
    sessionStatus === "loading"
      ? "Loading..."
      : isProcessing || isLoading
        ? "Processing..."
        : buttonText;

  return (
    <div className="flex flex-col gap-2">
      <PrimaryButton
        classname={`${buttonClassName || "w-full"} ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={isButtonDisabled ? undefined : handlePayment}
      >
        {buttonTextDisplay}
      </PrimaryButton>
      {error && <p className="text-sm text-red-500">Payment error: {error}</p>}
    </div>
  );
};

export default PaymentFlow;
