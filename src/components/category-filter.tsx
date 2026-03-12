"use client";

import { CATEGORY_META, type BusinessCategory } from "@/lib/types";

/** Floating legend showing category colors on the map */
export function CategoryFilter() {
  const categories = Object.entries(CATEGORY_META) as [
    BusinessCategory,
    (typeof CATEGORY_META)[BusinessCategory],
  ][];

  return (
    <div className="absolute left-3 top-3 z-10 rounded-xl border border-border bg-surface/90 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="flex flex-wrap gap-2">
        {categories.map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-xs">{meta.emoji}</span>
            <span className="text-[10px] font-medium text-text-secondary">
              {meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
