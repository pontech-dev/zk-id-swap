import { mockTradingItems } from "@/mock";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useTradingItems = () => {
  const query = useInfiniteQuery({
    queryKey: ["tradingItems"],
    queryFn: () => mockTradingItems,
    getNextPageParam: () => undefined,
    initialPageParam: 0,
  });

  return query;
};

export const useTradingItem = (chainId: number, id: string) => {
  const query = useQuery({
    queryKey: ["tradingItem", chainId, id],
    queryFn: () =>
      mockTradingItems.find(
        (item) => item.id === id && item.chainId === chainId
      ),
  });

  return query;
};
