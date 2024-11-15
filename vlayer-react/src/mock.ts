import { parseUnits } from "viem";
import { FundibleToken, ShopItem } from "./types";
import { sepolia } from "viem/chains";

export const MockUSDC: FundibleToken = {
    address: "0x0000000000000000000000000000000000000000",
    decimals: 6,
    symbol: "USDC",
}

export const shopItems = [
    {
        type: "twitter",
        id: "1",
        chainId: sepolia.id,
        providerId: "@VitalikButerin",
        name: "vitalik.eth",
        thumbnail: "https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg",
        price: {
            token: MockUSDC,
            uint: parseUnits("100", 6),
        },
        seller: "0x0000000000000000000000000000000000000000",
        metadata: {
            followers: 5482807,
            tweets: 20000,
        },
    },
    {
        type: "twitter",
        id: "2",
        chainId: sepolia.id,
        providerId: "@VitalikButerin",
        name: "vitalik.eth",
        thumbnail: "https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg",
        price: {
            token: MockUSDC,
            uint: parseUnits("100", 6),
        },
        seller: "0x0000000000000000000000000000000000000000",
        metadata: {
            followers: 5482807,
            tweets: 20000,
        },
    },
    {
        type: "twitter",
        id: "3",
        chainId: sepolia.id,
        providerId: "@VitalikButerin",
        name: "vitalik.eth",
        thumbnail: "https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg",
        price: {
            token: MockUSDC,
            uint: parseUnits("100", 6),
        },
        seller: "0x0000000000000000000000000000000000000000",
        metadata: {
            followers: 5482807,
            tweets: 20000,
        },
    },
    {
        type: "twitter",
        id: "4",
        chainId: sepolia.id,
        providerId: "@VitalikButerin",
        name: "vitalik.eth",
        thumbnail: "https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg",
        price: {
            token: MockUSDC,
            uint: parseUnits("100", 6),
        },
        seller: "0x0000000000000000000000000000000000000000",
        metadata: {
            followers: 5482807,
            tweets: 20000,
        },
    },
    {
        type: "twitter",
        id: "5",
        chainId: sepolia.id,
        providerId: "@VitalikButerin",
        name: "vitalik.eth",
        thumbnail: "https://pbs.twimg.com/profile_images/1748153260203229184/sXJIGMBk_400x400.jpg",
        price: {
            token: MockUSDC,
            uint: parseUnits("100", 6),
        },
        seller: "0x0000000000000000000000000000000000000000",
        metadata: {
            followers: 5482807,
            tweets: 20000,
        },
    },
] satisfies ShopItem[]