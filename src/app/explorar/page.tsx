"use client";

import { useState } from "react";
import { MapView } from "@/components/map-view";
import { BusinessDetail } from "@/components/business-detail";
import { CategoryFilter } from "@/components/category-filter";
import type { BusinessWithPromotion } from "@/lib/types";

export default function ExplorarPage() {
  const [selected, setSelected] = useState<BusinessWithPromotion | null>(null);

  return (
    <main className="relative h-[calc(100dvh-4rem)]">
      {/* Full-screen map */}
      <MapView onSelectBusiness={setSelected} />

      {/* Category legend — top left */}
      <CategoryFilter />

      {/* Business detail bottom sheet */}
      <BusinessDetail business={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
