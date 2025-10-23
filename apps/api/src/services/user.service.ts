import { PrismaClient } from "@prisma/client";

export const userService = {
  /**
   * Get total count of users
   */
  async getUserCount(prisma: PrismaClient) {
    const userCount = await prisma.user.count();

    return {
      total_users: userCount,
    };
  },

  /**
   * Check if user has an active subscription
   */
  async checkSubscriptionStatus(prisma: PrismaClient, userId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
    });

    return {
      isPaidUser: !!subscription,
      subscription: subscription
        ? {
            id: subscription.id,
            planName: subscription.plan?.name,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            status: subscription.status,
          }
        : null,
    };
  },
};
