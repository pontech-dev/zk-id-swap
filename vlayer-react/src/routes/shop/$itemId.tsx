import { Twitter } from "@/components/icons/twitter";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { getChainImage } from "@/constants";
import { useShopItem } from "@/hooks/use-shop-items";
import { formatShopItemPrice } from "@/lib/format";
import { createFileRoute } from "@tanstack/react-router";
import { useChains } from "wagmi";

export const Route = createFileRoute("/shop/$itemId")({
  component: RouteComponent,
});

const parseItemId = (itemId: string) => {
  const [chainId, id] = itemId.split("-");
  return { chainId: parseInt(chainId), id };
};

function RouteComponent() {
  const { itemId } = Route.useParams();
  const { chainId, id } = parseItemId(itemId);
  const { data: shopItem } = useShopItem(chainId, id);
  const chains = useChains();
  const chain = chains.find((c) => c.id === chainId);

  if (!shopItem) return null;

  return (
    <main className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2 px-10">
          <Avatar className="w-full h-auto aspect-square rounded-2xl">
            <AvatarImage src={shopItem.thumbnail} />
            <AvatarFallback>{shopItem.name.split(".")[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full sm:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">{shopItem.name}</h1>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                ID Provider
              </div>
              <div className="text-xl font-bold flex items-center gap-2">
                <Twitter className="size-5" />
                Twitter
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                Price
              </div>
              <div className="text-xl font-bold">
                {`${formatShopItemPrice(shopItem.price)} ${shopItem.price.token.symbol}`}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-muted-foreground text-xl">
                Listing Chain
              </div>
              <div className="flex items-center gap-1">
                <img
                  src={getChainImage(chainId)}
                  alt={chain?.name}
                  className="w-6 h-6"
                />
                <p className="text-xl font-bold">{chain?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
