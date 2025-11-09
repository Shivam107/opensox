"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import FiltersContainer from "@/components/ui/FiltersContainer";
import { useFilterStore } from "@/store/useFilterStore";
import { useShowSidebar } from "@/store/useShowSidebar";
import { IconWrapper } from "@/components/ui/IconWrapper";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showFilters } = useFilterStore();
  const { showSidebar, setShowSidebar } = useShowSidebar();
  return (
    <div className="flex w-screen h-screen bg-[#0a0a0b] overflow-hidden">
      {showFilters && <FiltersContainer />}
      <aside className={`h-full ${!showSidebar && "hidden xl:block"}`}>
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col h-full">
        <div className="xl:hidden flex items-center h-16 px-4 border-b border-[#1a1a1d]">
          <IconWrapper onClick={() => setShowSidebar(true)}>
            <Bars3Icon className="size-5 text-ox-purple" />
          </IconWrapper>
          <h1 className="ml-4 text-lg font-semibold text-ox-white">Opensox</h1>
        </div>
        <main className="flex-1 h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
