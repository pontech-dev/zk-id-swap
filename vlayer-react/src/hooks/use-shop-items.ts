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

export const useShopItem = (id: string) => {
    const query = useQuery({
        queryKey: ["shopItem", id],
        queryFn: () => shopItems.find((item) => item.id === id),
    });

    return query;
};
