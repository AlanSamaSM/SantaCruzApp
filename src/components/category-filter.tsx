"use client";

import { CATEGORY_META, type BusinessCategory } from "@/lib/types";

/** Floating legend showing category colors on the map */
export function CategoryFilter() {
  const categories = Object.entries(CATEGORY_META) as [
    BusinessCategory,
    (typeof CATEGORY_META)[BusinessCategory],
  ][];

  return (
    <div className="absolute left-3 top-3 z-10 rounded-xl border border-border bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
      <div className="flex flex-wrap gap-3">
        {categories.map(([key, meta]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="text-sm">{meta.emoji}</span>
            <span className="text-xs font-medium text-text-secondary">
              {meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
