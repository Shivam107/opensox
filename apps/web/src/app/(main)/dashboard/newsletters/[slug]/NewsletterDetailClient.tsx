"use client";

import { Suspense, lazy } from "react";
import Link from "next/link";
import { useNewsletterDetail } from "@/app/api/newsletter";
import { NewsletterIssue } from "@/data/newsletters";
import { NewsletterHero } from "@/components/newsletter/NewsletterHero";
import { NewsletterSectionRenderer } from "@/components/newsletter/NewsletterSectionRenderer";
import { EngagementBar } from "../engagementBar";

const LazyNewsletterSectionRenderer = lazy(() =>
  import("@/components/newsletter/NewsletterSectionRenderer").then((mod) => ({
    default: mod.NewsletterSectionRenderer,
  }))
);

type NewsletterDetailClientProps = {
  slug: string;
  fallback: NewsletterIssue;
};

function SectionsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-ox-black-2" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-ox-black-2" />
            <div className="h-4 w-5/6 rounded bg-ox-black-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NavigationButtons() {
  return (
    <div className="flex gap-3 flex-wrap">
      <Link
        href="/dashboard/newsletters"
        className="rounded-full border border-ox-purple px-6 py-2 text-xs font-semibold uppercase tracking-wide text-ox-purple transition hover:bg-ox-purple hover:text-ox-white"
      >
        Home
      </Link>
      <Link
        href="/pricing"
        className="rounded-full border border-ox-purple px-6 py-2 text-xs font-semibold uppercase tracking-wide text-ox-purple transition hover:bg-ox-purple hover:text-ox-white"
      >
        Pricing
      </Link>
      <a
        href="https://discord.gg/opensox"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full border border-ox-purple px-6 py-2 text-xs font-semibold uppercase tracking-wide text-ox-purple transition hover:bg-ox-purple hover:text-ox-white"
      >
        Community
      </a>
    </div>
  );
}

export function NewsletterDetailClient({ slug, fallback }: NewsletterDetailClientProps) {
  const { data, isLoading } = useNewsletterDetail(slug);
  const issue = data ?? fallback;

  if (!issue) return null;

  return (
    <div className="flex flex-col gap-6 p-4 xl:p-6">
      {/* @ts-ignore */}
      <NewsletterHero issue={issue} shareButton={<EngagementBar slug={slug} />} />
      <NavigationButtons />
      <Suspense fallback={<SectionsSkeleton />}>
        {/* @ts-ignore */}
        <LazyNewsletterSectionRenderer sections={issue.sections} />
      </Suspense>
    </div>
  );
}