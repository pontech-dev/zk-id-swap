import { getEscrowContractAddress, getStableToken } from "@/constants";
import { ZK_VERIFIED_ESCROW_ABI } from "@/lib/abis";
import { pickMockParamsById, mockShopItems } from "@/mock";
import { ShopItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { parseAbiItem, zeroAddress } from "viem";
import {
  useChainId,
  useContractReads,
  usePublicClient,
  useReadContract,
  useReadContracts,
} from "wagmi";

const listedEvent = parseAbiItem(
  "event Listed(string indexed username, uint256 price, address indexed seller)"
);

export const useShopItems = () => {
  const client = usePublicClient();
  const chainId = useChainId();
  const items = useQuery({
    queryKey: ["shopItems", chainId],
    queryFn: async () => {
      if (!client) return;
      const block = await client.getBlock();
      const logs = await client.getLogs({
        address: getEscrowContractAddress(chainId),
        event: listedEvent,
        fromBlock: block.number - 999n,
        toBlock: block.number,
      });

      console.log("logs", logs);

      const results = await client.multicall({
        contracts: logs
          .filter((log) => !!log.args.username)
          .map(
            (log) =>
              ({
                address: getEscrowContractAddress(chainId),
                abi: ZK_VERIFIED_ESCROW_ABI,
                functionName: "listings",
                args: [log.args.username],
              }) as const
          ),
      });

      console.log("results", results);

      const items = results
        .map((result, index) => {
          if (!result.result) return null;

          const log = logs[index];
          const [username, price, seller, status] = result.result;
          const mock = pickMockParamsById(username);
          const createdDate = new Date(
            Date.now() -
              (Number(block.timestamp) - Number(log.blockNumber)) * 12 * 1000
          );

          return {
            type: "twitter",
            id: username,
            seller: seller,
            chainId,
            providerId: `@${username}`,
            name: username,
            description: mock.description,
            thumbnail: mock.thumbnail,
            bannerImg: mock.bannerImg,
            price: {
              uint: price,
              token: getStableToken(chainId),
            },
            metadata: {
              followers: mock.metadata.followers,
              tweets: mock.metadata.tweets,
            },
            status:
              status === 0 ? "selling" : status === 1 ? "trading" : "sold",
            createdDate,
            createdDatetime: createdDate.toISOString(),
          } satisfies ShopItem;
        })
        .filter((item) => !!item);

      return items;
    },
    enabled: !!chainId,
  });

  return items;
};

export const useShopItems2 = () => {
  const chainId = useChainId();

  const { data: itemIds, error } = useReadContract({
    address: getEscrowContractAddress(chainId),
    abi: ZK_VERIFIED_ESCROW_ABI,
    functionName: "listUsernames",
  });
  console.log("itemIds", itemIds, error);
  const a = ["inariinaina", ...(itemIds ?? [])];
  const { data: results } = useReadContracts({
    contracts: a.map(
      (id) =>
        ({
          address: getEscrowContractAddress(chainId),
          abi: ZK_VERIFIED_ESCROW_ABI,
          functionName: "listings",
          args: [id],
        }) as const
    ),
  });

  console.log("results", results);

  const items = results
    ?.map((result) => {
      if (!result.result || !result.result[0]) return null;

      const [username, price, seller, status] = result.result;
      const mock = pickMockParamsById(username);
      const createdDate = new Date();

      return {
        type: "twitter",
        id: username,
        seller: seller,
        chainId,
        providerId: `@${username}`,
        name: username,
        description: mock.description,
        thumbnail: mock.thumbnail,
        bannerImg: mock.bannerImg,
        price: {
          uint: price,
          token: getStableToken(chainId),
        },
        metadata: {
          followers: mock.metadata.followers,
          tweets: mock.metadata.tweets,
        },
        status: status === 0 ? "selling" : status === 1 ? "trading" : "sold",
        createdDate,
        createdDatetime: createdDate.toISOString(),
      } satisfies ShopItem;
    })
    .filter((item) => !!item);

  return { items };
};

export const useShopItem2 = (chainId: number, id: string) => {
  const { data, ...rest } = useReadContract({
    address: getEscrowContractAddress(chainId),
    abi: ZK_VERIFIED_ESCROW_ABI,
    functionName: "listings",
    args: [id],
  });

  console.log("data", data);

  const mock = pickMockParamsById(id);

  const item =
    data &&
    (data[2] === zeroAddress
      ? null
      : ({
          type: "twitter",
          id,
          seller: data[2],
          chainId,
          providerId: `@${id}`,
          name: id,
          description: mock.description,
          thumbnail: mock.thumbnail,
          bannerImg: mock.bannerImg,
          price: {
            uint: data[1],
            token: getStableToken(chainId),
          },
          metadata: {
            followers: mock.metadata.followers,
            tweets: mock.metadata.tweets,
          },
          status:
            data[3] === 0 ? "selling" : data[3] === 1 ? "trading" : "sold",
          createdDate: new Date(Date.now() - 1000 * 60 * 60 * Math.random()),
          createdDatetime: new Date(
            Date.now() - 1000 * 60 * 60 * Math.random()
          ).toISOString(),
        } satisfies ShopItem));

  return { data: item, ...rest };
};
