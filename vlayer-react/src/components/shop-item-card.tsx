import { ShopItem } from "@/types";
import { FC } from "react";
import { Twitter } from "./icons/twitter";
import { Link } from "@tanstack/react-router";
import { formatShopItemPrice } from "@/lib/format";
import { useChains } from "wagmi";
import { getChainImage } from "@/constants";

export const ShopItemCard: FC<{
  item: ShopItem;
  href: string;
}> = ({ item, href }) => {
  const chains = useChains();
  const chain = chains.find((c) => c.id === item.chainId);

  return (
    <>
      <Link
        key={item.id}
        to={href}
        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
      >
        <div className="flex flex-1 flex-col p-8">
          <img
            alt=""
            src={item.thumbnail}
            className="mx-auto size-32 shrink-0 rounded-full"
          />

          <div className="flex flex-col mt-12">
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
        </div>
      </Link>
    </>
  );
};
