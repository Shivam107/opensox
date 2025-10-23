"use client";

import { newsletterIssues } from "@/data/newsletters";
import { trpc } from "@/lib/trpc";

export const useNewsletterList = (search?: string) => {
  // Use mock data immediately for instant load
  const filteredData = search
    ? newsletterIssues.filter((issue) =>
        `${issue.title} ${issue.summary}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : newsletterIssues;

  return {
    data: filteredData,
    isLoading: false,
    error: null,
  };
};

export const useNewsletterDetail = (slug: string) => {
  return trpc.newsletter.bySlug.useQuery({ slug }, { enabled: Boolean(slug) });
};