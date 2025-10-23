import { Prisma } from "@prisma/client";
import dbClient from "../prisma.js";

const { prisma } = dbClient;

export const newsletterService = {
  list: async (search?: string) => {
    const where: Prisma.NewsletterIssueWhereInput | undefined = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { summary: { contains: search, mode: "insensitive" } },
            { tags: { hasSome: search.split(" ").filter(Boolean) } },
          ],
        }
      : undefined;

    return prisma.newsletterIssue.findMany({
      ...(where && { where }),
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        publishedAt: true,
        readTime: true,
        heroMediaUrl: true,
        heroMediaType: true,
        tags: true,
      },
    });
  },

  bySlug: async (slug: string) => {
    return prisma.newsletterIssue.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });
  },
};