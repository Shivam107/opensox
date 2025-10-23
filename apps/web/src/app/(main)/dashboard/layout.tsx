"use client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import FiltersContainer from "@/components/ui/FiltersContainer";
import { useFilterStore } from "@/store/useFilterStore";
import { useShowSidebar } from "@/store/useShowSidebar";

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
        <DashboardHeader></DashboardHeader>
      </div>
      <div className="flex flex-row w-full overflow-hidden">
        {showFilters && <FiltersContainer></FiltersContainer>}
        <aside
          className={`flex-shrink-0 w-48 md:w-[40%] xl:w-[20%] ${showSidebar ? "block relative" : "hidden"} xl:block overflow-y-auto`}
        >
          <Sidebar></Sidebar>
        </aside>
        <main className="flex-grow overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
