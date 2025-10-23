"use client";

import { useMemo } from "react";
import { NewsletterIssue } from "@/data/newsletters";

interface NewsletterHeroProps {
  issue: NewsletterIssue;
  shareButton?: React.ReactNode;
}

export function NewsletterHero({ issue, shareButton }: NewsletterHeroProps) {
  const formattedDate = useMemo(
    () =>
      new Date(issue.publishedAt).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [issue.publishedAt]
  );

  return (
    <section className="rounded-3xl border border-ox-gray bg-ox-black-1 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ox-gray-light">
            <span>{formattedDate}</span>
            <span>· {issue.readTime}</span>
          </div>
          <h1 className="text-3xl font-semibold text-ox-white md:text-4xl">{issue.title}</h1>
          <p className="max-w-3xl text-sm text-ox-gray-light md:text-base">{issue.summary}</p>
        </div>
        {shareButton && <div className="flex-shrink-0">{shareButton}</div>}
      </div>
    </section>
  );
}