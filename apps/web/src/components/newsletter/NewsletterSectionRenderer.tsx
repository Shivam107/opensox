"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { NewsletterSection } from "@/data/newsletters";

const ReactPlayer = dynamic(
  () => import("react-player").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null,
  }
) as any;

interface NewsletterSectionRendererProps {
  sections: NewsletterSection[];
}

export function NewsletterSectionRenderer({ sections }: NewsletterSectionRendererProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (section.type === "text") {
          return (
            <article key={`${section.heading}-${index}`} className="space-y-2">
              <h2 className="text-2xl font-semibold text-ox-white">{section.heading}</h2>
              <p className="text-sm leading-7 text-ox-gray-light md:text-base">{section.body}</p>
            </article>
          );
        }

        if (section.type === "media" && section.src && section.mediaSrc) {
          return (
            <div
              key={`${section.heading}-${index}`}
              className="space-y-3 rounded-3xl border border-ox-gray bg-ox-black-1 p-5 flex-shrink-0"
            >
              <h2 className="text-2xl font-semibold text-ox-white">{section.heading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl">
                  <Image
                    src={section.src}
                    alt={section.alt ?? section.heading}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-full aspect-video overflow-hidden rounded-2xl bg-black" style={{ flex: "0 0 auto" }}>
                  <ReactPlayer
                    src={section.mediaSrc}
                    width="100%"
                    height="100%"
                    controls
                    playing={false}
                  />
                </div>
              </div>
              <p className="text-xs text-ox-gray-light md:text-sm">{section.body}</p>
            </div>
          );
        }

        if ((section.type === "image" || section.type === "video") && section.src) {
          return (
            <div
              key={`${section.heading}-${index}`}
              className="space-y-3 rounded-3xl border border-ox-gray bg-ox-black-1 p-5 flex-shrink-0"
            >
              <h2 className="text-2xl font-semibold text-ox-white">{section.heading}</h2>
              {section.type === "video" ? (
                <div className="w-full aspect-video overflow-hidden rounded-2xl bg-black" style={{ flex: "0 0 auto" }}>
                  <ReactPlayer
                    src={section.src}
                    width="100%"
                    height="100%"
                    controls
                    playing={false}
                  />
                </div>
              ) : (
                <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-80">
                  <Image
                    src={section.src}
                    alt={section.alt ?? section.heading}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-ox-gray-light md:text-sm">{section.body}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}