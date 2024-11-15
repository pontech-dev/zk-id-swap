import { ShopItem } from "@/types";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Twitter } from "./icons/twitter";
import { Link } from "@tanstack/react-router";
import { formatShopItemPrice } from "@/lib/format";
import { useChains } from "wagmi";
import { CHAIN_IMAGES, getChainImage } from "@/constants";

export const ShopItemCard: FC<{
  item: ShopItem;
  href: string;
}> = ({ item, href }) => {
  const chains = useChains();
  const chain = chains.find((c) => c.id === item.chainId);

  return (
    <Link
      to={href}
      className="relative flex flex-col gap-2 border p-4 rounded-lg shadow-sm transition-colors hover:bg-muted/50"
    >
      <div className="flex justify-center">
        <Avatar className="w-24 h-24">
          <AvatarImage src={item.thumbnail} alt={item.name} />
          <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Twitter />
          <h2 className="text-lg font-semibold">{item.name}</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-muted-foreground">{`${formatShopItemPrice(item.price)} ${item.price.token.symbol}`}</p>
          </div>
          <div className="flex items-center gap-1">
            <img
              src={getChainImage(item.chainId)}
              alt={chain?.name}
              className="w-6 h-6"
            />
            <p className="text-base font-semibold text-muted-foreground">
              {chain?.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
