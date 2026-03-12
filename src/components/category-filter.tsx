"use client";

import { CATEGORY_META, type BusinessCategory } from "@/lib/types";

/** Floating legend showing category colors on the map */
export function CategoryFilter() {
  const categories = Object.entries(CATEGORY_META) as [
    BusinessCategory,
    (typeof CATEGORY_META)[BusinessCategory],
  ][];

  return (
    <div className="absolute left-3 top-3 z-10 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap gap-3">
        {categories.map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
              style={{ backgroundColor: meta.color }}
            >
              <span className="text-xs">{meta.emoji}</span>
            </div>
            <span className="text-xs font-semibold text-text-primary">
              {meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
