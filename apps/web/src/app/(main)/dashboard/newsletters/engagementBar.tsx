"use client";

import { useCallback, useState } from "react";

interface EngagementBarProps {
  slug: string;
}

export type { EngagementBarProps };

export function EngagementBar({ slug }: EngagementBarProps) {
  const link = `/dashboard/newsletters/${slug}`;
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const absoluteUrl = `${window.location.origin}${link}`;
    
    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          url: absoluteUrl,
        });
        return;
      } catch (error) {
        console.error("Share failed:", error);
      }
    }
    
    // Fallback to copy to clipboard
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy link", error);
    }
  }, [link]);

  return (
    <button
      onClick={handleShare}
      className="rounded-full border border-ox-purple px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ox-purple transition hover:bg-ox-purple hover:text-ox-white"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}