import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SidebarTrigger } from "../ui/sidebar";

export const Header = () => {
  return (
    <header className="p-3 border-b">
      <nav className="flex items-center justify-end gap-4">
        <ConnectButton />
        <SidebarTrigger className="sm:hidden" />
      </nav>
    </header>
  );
};
