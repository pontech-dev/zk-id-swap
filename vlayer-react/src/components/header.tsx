import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <header className="flex justify-between items-center p-2 border-b">
      <h1 className="text-2xl font-black">ZK ID Swap</h1>
      <nav className="flex items-center gap-4">
        <ConnectButton />
        <SidebarTrigger />
      </nav>
    </header>
  );
};
