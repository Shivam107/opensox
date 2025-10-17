"use client";
import React, { Suspense } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import { useShowSidebar } from "@/store/useShowSidebar";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHeader = React.lazy(() =>
    import("@/components/dashboard/DashboardHeader").then((m) => ({
      default: m.DashboardHeader,
    }))
  );
const Sidebar = React.lazy(() => import("@/components/dashboard/Sidebar"));
const FiltersContainer = React.lazy(() => import("@/components/ui/FiltersContainer"));

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showFilters } = useFilterStore();
  const { showSidebar } = useShowSidebar();
  return (
    <div className="flex flex-col md:gap-3">
      <div className="flex w-full h-16">
        <Suspense
              fallback={
                <div className="py-20 text-center text-lg text-neutral-400">
                  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-72" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              }
            >
          <DashboardHeader></DashboardHeader>
        </Suspense>
      </div>
      <div className="flex flex-row w-full">
        {showFilters && (
          <Suspense
                fallback={
                  <div className="py-20 text-center text-lg text-neutral-400">
                    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-72" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                }
              >
            <FiltersContainer></FiltersContainer>
          </Suspense>
        )}
        <aside
          className={`w-48 md:w-[40%] xl:w-[20%] ${showSidebar ? "block relative" : "hidden"} xl:block`}
        >
          <Suspense
                fallback={
                  <div className="py-20 text-center text-lg text-neutral-400">
                    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-6">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-72" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                }
              >
            <Sidebar></Sidebar>
          </Suspense>
        </aside>
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}