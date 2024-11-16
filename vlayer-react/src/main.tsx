import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { ZeroDevSmartWalletConnectors, ZeroDevSmartWalletConnectorsWithConfig } from "@dynamic-labs/ethereum-aa";

const config = getDefaultConfig({
  appName: "ZK ID Swap",
  projectId: "adb327da1f8267bf5019de44564b1372",
  chains: [mainnet],
  ssr: false,
});

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicContextProvider
            settings={{
              environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
              walletConnectors: [
                EthereumWalletConnectors,
                ZeroDevSmartWalletConnectors,
                ZeroDevSmartWalletConnectorsWithConfig({
                  paymasterRpc: import.meta.env.VITE_ZERODEV_PAYMASTER_URL,
                }),
              ],
            }}
          >
            <RainbowKitProvider>
              <RouterProvider router={router} />
            </RainbowKitProvider>
          </DynamicContextProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
