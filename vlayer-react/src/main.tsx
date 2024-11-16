import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { rainbowWeb3AuthConnector } from "./lib/web3auth";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { CHAINS } from "./constants";

const config = getDefaultConfig({
  appName: "ZK ID Swap",
  projectId: "adb327da1f8267bf5019de44564b1372",
  chains: CHAINS,
  ssr: false,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [rainbowWeb3AuthConnector, metaMaskWallet],
    },
  ],
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
          <RainbowKitProvider>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
}
