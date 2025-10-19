import { rz_instance } from "../index.js";

interface CreateOrderInput {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface RazorpayOrderSuccess {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  created_at: number;
  currency: string;
  entity: string;
  id: string;
  notes: Record<string, string>;
  offer_id: string | null;
  receipt: string;
  status: string;
}

interface RazorpayError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: Record<string, any>;
    field: string;
  };
}

type CreateOrderResponse = RazorpayOrderSuccess | RazorpayError;

export const paymentService = {
  /**
   * Create a new Razorpay order
   */
  async createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
    const { amount, currency, receipt, notes } = input;

    try {
      const order = await rz_instance.orders.create({
        amount,
        currency,
        receipt,
        notes: notes || {},
      });

      console.log("order", order)

      return order as RazorpayOrderSuccess;
    } catch (error: any) {
      if (error.error) {
        return {
          error: error.error,
        } as RazorpayError;
      }

      // Handle unexpected errors
      return {
        error: {
          code: "INTERNAL_ERROR",
          description: error.message || "An unexpected error occurred",
          source: "internal",
          step: "payment_initiation",
          reason: "unknown_error",
          metadata: {},
          field: "",
        },
      } as RazorpayError;
    }
  },
};
