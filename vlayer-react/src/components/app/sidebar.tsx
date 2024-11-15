import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  MessageSquareText,
  ShoppingCart,
  SquareGanttChart,
  SquarePlus,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const menuItems = [
  {
    icon: ShoppingCart,
    label: "Shop Items",
    href: "/",
  },
  {
    icon: MessageSquareText,
    label: "Messages",
    href: "/chat",
  },
  {
    icon: SquarePlus,
    label: "List Your ID",
    href: "/new",
  },
  {
    icon: SquareGanttChart,
    label: "Manage Your IDs",
    href: "/manage",
  },
] as const;

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center justify-between mt-2">
        <h1 className="text-lg sm:text-2xl font-black">ZK ID Swap</h1>
        <SidebarTrigger className="sm:hidden" />
      </SidebarHeader>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    variant={
                      location.pathname === item.href ? "outline" : "default"
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="font-bold">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
