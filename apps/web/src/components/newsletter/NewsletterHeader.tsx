"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

const NAV_LINKS = [
  { href: "/dashboard/home", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "https://discord.gg/nC9x4hef", label: "Community", external: true },
];

type Props = {
  title: string;
  subtitle?: string;
  searchTerm?: string;
  onSearch?: (value: string) => void;
  actions?: React.ReactNode;
  searchPlaceholder?: string;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "disabled">;

export function NewsletterHeader({
  title,
  subtitle,
  searchTerm = "",
  onSearch,
  actions,
  disabled,
  searchPlaceholder = "Search newsletters",
}: Props) {
  const pathname = usePathname();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(event.target.value);
  };

  return (
    <header className="rounded-3xl border border-ox-gray bg-ox-black-1 px-5 py-6 shadow-sm sm:px-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-ox-white md:text-4xl">{title}</h1>
          {subtitle && (
            <p className="text-sm text-ox-gray-light md:text-base">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {NAV_LINKS.map((link) => {
            const isActive = !link.external && pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={cn(
                  "rounded-full border border-ox-gray px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-ox-purple hover:text-ox-purple md:text-sm",
                  isActive ? "bg-ox-purple text-ox-white border-ox-purple" : "text-ox-gray-light"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {actions}
        </div>
      </div>
      {onSearch && (
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-lg items-center rounded-full border border-ox-gray bg-ox-black-2 px-4 py-2">
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className="w-full bg-transparent text-sm text-ox-white placeholder:text-ox-gray-light focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-ox-gray-light">
            <span className="rounded-full border border-ox-gray px-3 py-1">Premium</span>
            <span className="rounded-full border border-ox-gray px-3 py-1">Issue #122</span>
            <span className="rounded-full border border-ox-gray px-3 py-1">September · October</span>
          </div>
        </div>
      )}
    </header>
  );
}