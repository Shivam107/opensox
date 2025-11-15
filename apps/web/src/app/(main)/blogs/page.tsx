"use client";

import { useState, useMemo } from "react";
import BlogHeader from "@/components/blogs/BlogHeader";
import { blogs, BlogTag } from "@/data/blogs";
import Link from "next/link";

const filterTags: BlogTag[] = [
  "all",
  "engineering",
  "startup",
  "distribution",
  "misc",
];

export default function BlogsPage() {
  const [selectedTag, setSelectedTag] = useState<BlogTag>("all");

  const filteredBlogs = useMemo(() => {
    let result = blogs;
    if (selectedTag !== "all") {
      result = blogs.filter((blog) => blog.tag === selectedTag);
    }
    return result.sort((a, b) => {
      const parseDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(2000 + year, month - 1, day);
      };
      return parseDate(b.date).getTime() - parseDate(a.date).getTime();
    });
  }, [selectedTag]);

  return (
    <main className="min-h-screen w-full bg-[#101010] text-white">
      <BlogHeader />
      <div className="max-w-[2000px] mx-auto px-6 py-8 flex justify-center">
        <div className="flex gap-12">
          {/* Sidebar with filters */}
          <aside className="w-48 flex-shrink-0">
            <nav className="flex flex-col gap-2">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-left transition-colors lowercase ${
                    selectedTag === tag
                      ? "text-white"
                      : "text-[#9455f4] hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </nav>
          </aside>

          {/* Blog list */}
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-col gap-3">
              {filteredBlogs.length === 0 ? (
                <p className="text-gray-400">No blog posts found.</p>
              ) : (
                filteredBlogs.map((blog, index) => (
                  <div
                    key={`${blog.date}-${blog.linkText}-${index}`}
                    className="flex gap-4 items-center whitespace-nowrap"
                  >
                    <span className="text-white w-20 flex-shrink-0 font-DMfont font-mono text-right">
                      {blog.date}
                    </span>
                    <Link
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9455f4] hover:text-white underline transition-colors"
                    >
                      {blog.linkText}
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
