import { ShopItemCard } from "@/components/shop-item-card";
import { Button } from "@/components/ui/button";
import { useShopItems } from "@/hooks/use-shop-items";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createLazyFileRoute("/")({ component: Index });

function Index() {
  const shopItems = useShopItems();

  return (
    <main className="p-2 sm:p-4 space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-2xl font-semibold">ID Shop</h1>
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {shopItems.data?.map((item) => (
          <ShopItemCard item={item} href={`/shop/${item.chainId}:${item.id}`} />
        ))}
      </div>
    </main>
  );
}
