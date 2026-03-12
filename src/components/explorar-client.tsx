"use client";

import { useState } from "react";
import { MapView } from "@/components/map-view";
import { BusinessDetail } from "@/components/business-detail";
import { CategoryFilter } from "@/components/category-filter";
import type { BusinessWithPromotion } from "@/lib/types";

interface ExplorarClientProps {
  businesses: BusinessWithPromotion[];
}

export function ExplorarClient({ businesses }: ExplorarClientProps) {
  const [selected, setSelected] = useState<BusinessWithPromotion | null>(null);

  return (
    <main className="relative h-[calc(100dvh-4rem)]">
      <MapView businesses={businesses} onSelectBusiness={setSelected} />
      <CategoryFilter />
      <BusinessDetail business={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
