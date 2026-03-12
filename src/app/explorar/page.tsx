import { ExplorarClient } from "@/components/explorar-client";
import { fetchBusinessesWithPromotions } from "@/lib/queries";

export default async function ExplorarPage() {
  const businesses = await fetchBusinessesWithPromotions();

  return <ExplorarClient businesses={businesses} />;
}
