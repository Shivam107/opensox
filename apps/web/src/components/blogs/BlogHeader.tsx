"use client";

import Link from "next/link";

export default function BlogHeader() {
  return (
    <header className="w-full border-b border-[#252525] bg-[#101010]">
      <div className="max-w-[2000px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/blogs"
          className="text-white hover:text-[#9455f4] transition-colors underline"
        >
          Opensox AI (Ajeet)
        </Link>
        <Link
          href="/"
          className="text-white hover:text-[#9455f4] transition-colors underline"
        >
          Home
        </Link>
      </div>
    </header>
  );
}

