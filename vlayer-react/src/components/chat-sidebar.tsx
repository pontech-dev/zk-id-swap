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
}> = ({ chatRequests: _chatRequests, chats: _chats }) => {
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
