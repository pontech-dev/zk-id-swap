import { shopItems } from "@/mock";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useShopItems = () => {
    const query = useInfiniteQuery({
        queryKey: ["shopItems"],
        queryFn: () => shopItems,
        getNextPageParam: () => undefined,
        initialPageParam: 0
    });

    return query;
};

export const useShopItem = (chainId: number, id: string) => {
    const query = useQuery({
        queryKey: ["shopItem", chainId, id],
        queryFn: () => shopItems.find((item) => item.id === id && item.chainId === chainId),
    });

    return query;
};
