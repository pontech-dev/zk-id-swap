import { sepolia } from "viem/chains";

export const CHAINS = [sepolia];

export type ChainId = (typeof CHAINS)[number]["id"];

export const CHAIN_IMAGES: Record<ChainId, string> = {
    [sepolia.id]: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
} satisfies Record<ChainId, string>;

export const getChainImage = (chainId: number) => {
    return CHAIN_IMAGES[chainId as ChainId];
}