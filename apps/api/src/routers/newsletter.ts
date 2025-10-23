import { z } from "zod";
import { router, publicProcedure } from "../trpc.js";
import { newsletterService } from "../services/newsletter.service.js";

export const newsletterRouter = router({
  list: publicProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => newsletterService.list(input?.search)),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => newsletterService.bySlug(input.slug)),
});