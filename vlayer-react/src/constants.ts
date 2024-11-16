import { sepolia, optimismSepolia, polygonZkEvmTestnet } from "viem/chains";

export const CHAINS = [sepolia, optimismSepolia, polygonZkEvmTestnet] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

export const CHAIN_IMAGES: Record<ChainId, string> = {
  [sepolia.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/sepolia/info/logo.png",
  [optimismSepolia.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
  [polygonZkEvmTestnet.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygonzkEvm/info/logo.png",
} satisfies Record<ChainId, string>;

export const getChainImage = (chainId: number) => {
  return CHAIN_IMAGES[chainId as ChainId];
};
