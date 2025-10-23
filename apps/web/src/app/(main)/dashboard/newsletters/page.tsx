"use client";

import { useMemo, useState, Suspense, lazy } from "react";
import { useNewsletterList } from "@/app/api/newsletter";
import { newsletterIssues as mockIssues, type NewsletterIssue } from "@/data/newsletters";

const LazyNewsletterCard = lazy(() =>
  import("@/components/newsletter/NewsletterCard").then((mod) => ({
    default: mod.NewsletterCard,
  }))
);

function CardSkeleton() {
  return (
    <div className="h-20 animate-pulse rounded-3xl border border-ox-gray bg-ox-black-2" />
  );
}

function NewsletterCardList({ issues }: { issues: NewsletterIssue[] }) {
  return (
    <>
      {issues.map((issue: NewsletterIssue) => (
        <Suspense key={issue.slug} fallback={<CardSkeleton />}>
          <LazyNewsletterCard issue={issue} />
        </Suspense>
      ))}
    </>
  );
}

export default function NewsletterIndex() {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useNewsletterList(query) as {
    data: NewsletterIssue[] | undefined;
    isLoading: boolean;
  };
  const issues = data?.length ? data : mockIssues;

  const filteredIssues = useMemo<NewsletterIssue[]>(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return issues as NewsletterIssue[];

    return (issues as NewsletterIssue[]).filter((issue) =>
      `${issue.title} ${issue.summary}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [issues, query]);

  return (
    <div className="flex flex-col gap-6 p-4 xl:p-6">
      <div className="rounded-3xl border border-ox-gray bg-ox-black-1 px-5 py-6 shadow-sm sm:px-7">
  <h1 className="text-center text-3xl font-semibold text-ox-white md:text-4xl">Newsletter</h1>
        {query && (
          <div className="mt-4 flex w-full max-w-lg items-center rounded-full border border-ox-gray bg-ox-black-2 px-4 py-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search newsletters"
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-ox-white placeholder:text-ox-gray-light focus:outline-none"
            />
          </div>
        )}
      </div>
      <section className="grid gap-3">
        {isLoading ? (
          <SkeletonList />
        ) : filteredIssues.length > 0 ? (
          <NewsletterCardList issues={filteredIssues} />
        ) : (
          <EmptyState query={query} />
        )}
      </section>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="h-32 animate-pulse rounded-3xl border border-ox-gray bg-ox-black-2"
        />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-ox-gray bg-ox-black-1 p-10 text-center">
      <h2 className="text-lg font-semibold text-ox-white">No matches found</h2>
      <p className="mt-2 text-sm text-ox-gray-light">
        We couldn’t find any newsletters for “{query}”. Try a different keyword or clear the search
        filter.
      </p>
    </div>
  );
}