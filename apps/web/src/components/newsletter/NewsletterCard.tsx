"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { NewsletterIssue } from "@/data/newsletters";

interface NewsletterCardProps {
  issue: NewsletterIssue;
}

export function NewsletterCard({ issue }: NewsletterCardProps) {

  const formattedDate = useMemo(
    () =>
      new Date(issue.publishedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [issue.publishedAt]
  );

  const sharePath = useMemo(() => `/dashboard/newsletters/${issue.slug}`, [issue.slug]);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window === "undefined") return;
      const absoluteUrl = `${window.location.origin}${sharePath}`;

      if (navigator.share) {
        try {
          await navigator.share({
            url: absoluteUrl,
          });
          return;
        } catch {
          /* fall back to clipboard */
        }
      }

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(absoluteUrl);
        } catch (error) {
          console.error("Unable to copy link", error);
        }
      }
    },
    [issue.summary, issue.title, sharePath]
  );

  return (
    <div className="rounded-3xl border border-ox-gray bg-ox-black-1 transition hover:border-ox-purple/60 hover:shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <Link
          href={sharePath}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-4 cursor-pointer hover:opacity-80 transition"
        >
          <h2 className="text-lg font-semibold text-ox-white">{issue.title}</h2>
          <div className="flex items-center gap-2 text-xs text-ox-gray-light whitespace-nowrap">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{issue.readTime}</span>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleShare(e);
          }}
          className="ml-4 flex items-center justify-center px-4 py-2 hover:bg-ox-black-2 rounded-lg transition"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ox-purple hover:text-ox-white">
            Share
          </span>
        </button>
      </div>
    </div>
  );
}

function MediaPreview({ issue }: NewsletterCardProps) {
  if (!issue.heroMediaUrl) {
    return null;
  }

  if (issue.heroMediaType === "video") {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-ox-gray md:w-56">
        <video
          src={issue.heroMediaUrl}
          controls
          preload="metadata"
          className="h-full w-full rounded-xl"
        />
      </div>
    );
  }

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-xl border border-ox-gray md:h-40 md:w-56">
      <Image
        src={issue.heroMediaUrl}
        alt={issue.title}
        fill
        sizes="(min-width: 768px) 224px, 100vw"
        className="object-cover"
      />
    </div>
  );
}