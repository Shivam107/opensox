"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFilterInputStore } from "@/store/useFilterInputStore";
import clsx from "clsx";

export default function Filter({
  filterName,
  filters,
  onClick,
}: {
  filterName: string;
  filters: string[];
  onClick?: () => void;
}) {
  const { updateFilters } = useFilterInputStore();
  const inputData: { [key: string]: string } = {};
  const recordFilterInput = (filter: string) => {
    inputData[filterName] = filter;
    updateFilters(inputData);
  };

  const triggerClasses = clsx("text-sm font-medium", {
    "text-slate-500": ["Hire contributors", "Funding", "Trending"].includes(
      filterName
    ),
  });

  return (
    <div onClick={onClick}>
      <AccordionItem value={filterName} className="px-6 border-none">
        <AccordionTrigger className={triggerClasses}>
          <span className="text-sm font-medium text-white">{filterName}</span>
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-3">
          <RadioGroup className="space-y-3">
            {filters.map((filter) => (
              <div key={filter} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={filter}
                  id={filter}
                  onClick={() => recordFilterInput(filter)}
                  className="border-[#1a1a1d] text-ox-purple"
                />
                <Label
                  htmlFor={filter}
                  onClick={() => recordFilterInput(filter)}
                  className="text-sm text-zinc-400 cursor-pointer"
                >
                  {filter}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
