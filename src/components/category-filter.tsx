"use client";

import { CATEGORY_META, type BusinessCategory } from "@/lib/types";

/** Floating legend — iOS frosted glass pill */
export function CategoryFilter() {
  const categories = Object.entries(CATEGORY_META) as [
    BusinessCategory,
    (typeof CATEGORY_META)[BusinessCategory],
  ][];

  return (
    <div className="absolute left-3 top-3 z-10 flex gap-1.5 rounded-2xl border border-white/40 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl">
      {categories.map(([key, meta]) => (
        <div
          key={key}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/8 transition-colors"
          title={meta.label}
        >
          <span className="text-sm">{meta.emoji}</span>
        </div>
      ))}
    </div>
  );
}
