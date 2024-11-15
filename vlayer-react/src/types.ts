import { Address } from "viem";

export type FundibleToken = {
    symbol: string
    address: Address
    decimals: number
}

export type ShopItemPrice = {
    token: FundibleToken
    uint: bigint
}

export type ShopItem = {
    type: "twitter"
    id: string;
    chainId: number;
    /** `@hogehoge` */
    providerId: `@${string}`;
    name: string;
    /** URL to the image */
    thumbnail: string;
    price: ShopItemPrice
    seller: Address
    metadata: {
        followers: number;
        tweets: number;
    }
};
