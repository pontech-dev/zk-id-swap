import { MockUSDC } from "./mock";
import { FundibleToken } from "./types";
import {
  sepolia,
  optimismSepolia,
  baseSepolia,
  flowTestnet,
  polygonZkEvmTestnet,
} from "viem/chains";

export const CHAINS = [
  sepolia,
  optimismSepolia,
  baseSepolia,
  flowTestnet,
  polygonZkEvmTestnet,
] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

export const CHAIN_IMAGES: Record<ChainId, string> = {
  [sepolia.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  [optimismSepolia.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
  [baseSepolia.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png",
  [flowTestnet.id]: "",
  [polygonZkEvmTestnet.id]:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygonzkEvm/info/logo.png",
} satisfies Record<ChainId, string>;

export const getChainImage = (chainId: number) => {
  return CHAIN_IMAGES[chainId as ChainId];
};

export const ESCROW_CONTRACT_ADDRESSES = {
  [sepolia.id]: "0xd707c84fb92c487b1d3b0428d5a5f3dca7fc2d8b",
  [optimismSepolia.id]: "0x0000000000000000000000000000000000000000",
  [baseSepolia.id]: "0x0000000000000000000000000000000000000000",
  [polygonZkEvmTestnet.id]: "0x0000000000000000000000000000000000000000",
  [flowTestnet.id]: "0x0000000000000000000000000000000000000000",
} satisfies Record<ChainId, `0x${string}`>;

export const getEscrowContractAddress = (chainId: number) => {
  return ESCROW_CONTRACT_ADDRESSES[chainId as ChainId];
};

export const PROVER_CONTRACT_ADDRESSES = {
  [sepolia.id]: "0x4d350501360771a3c47ce1f4d2d6a46af1ea3dfd",
  [optimismSepolia.id]: "0x0000000000000000000000000000000000000000",
  [baseSepolia.id]: "0x0000000000000000000000000000000000000000",
  [polygonZkEvmTestnet.id]: "0x0000000000000000000000000000000000000000",
  [flowTestnet.id]: "0x0000000000000000000000000000000000000000",
} satisfies Record<ChainId, `0x${string}`>;

export const getProverContractAddress = (chainId: number) => {
  return PROVER_CONTRACT_ADDRESSES[chainId as ChainId];
};

export const STABLE_TOKENS = {
  [sepolia.id]: MockUSDC,
  [optimismSepolia.id]: MockUSDC,
  [baseSepolia.id]: MockUSDC,
  [polygonZkEvmTestnet.id]: MockUSDC,
  [flowTestnet.id]: MockUSDC,
} satisfies Record<ChainId, FundibleToken>;

export const getStableToken = (chainId: number) => {
  return STABLE_TOKENS[chainId as ChainId];
};
