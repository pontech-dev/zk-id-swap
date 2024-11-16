import { IFeeds } from "@pushprotocol/restapi";
import { FC } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export const ChatSidebar: FC<{
  chatRequests?: IFeeds[];
  chats?: IFeeds[];
}> = ({ chatRequests, chats }) => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
