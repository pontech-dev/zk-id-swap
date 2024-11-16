// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  return (
    <header className="p-3 border-b flex justify-end items-center sticky top-0 z-10 bg-background shadow-sm">
      <h1 className="text-xl sm:text-2xl font-semibold flex-1 block md:hidden">
        ZK ID Swap
      </h1>
      <nav className="flex items-center justify-end gap-4">
        <DynamicWidget />
        {/* <ConnectButton /> */}
        <SidebarTrigger className="md:hidden" />
      </nav>
    </header>
  );
};
