import { useState, useEffect } from 'react'
import { createFileRoute } from "@tanstack/react-router";
import { useParams } from '@tanstack/react-router'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { ChatView, MODAL_POSITION_TYPE } from "@pushprotocol/uiweb";
import { useChatHistory } from '@/hooks/push-chat';

export const Route = createFileRoute("/chat/_chat/$target")({
  component: RouteComponent,
});

function RouteComponent() {
  const { primaryWallet } = useDynamicContext()
  const { target } = Route.useParams({ from: '/chat/_chat/$target' })
  // const params = ueParams({ from: '/chat/_chat/$target' });
  const history= useChatHistory(target);

  console.log({ history });

  useEffect(() => {
    // console.log(params);
    console.log({ target});
  }, [])

  if (!target) {
    return <div>Error: Chat target not found</div>;
  }

  return (
    <div>
      <ChatView
        chatId={target}
        limit={10}
        verificationFailModalPosition={MODAL_POSITION_TYPE.RELATIVE}
      />
    </div>
  );
}
