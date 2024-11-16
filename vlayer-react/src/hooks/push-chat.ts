import { useWalletClient } from "wagmi";
import { CONSTANTS, IMessageIPFSWithCID, PushAPI } from "@pushprotocol/restapi";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useCallback, useState } from "react";

let _pushClient: Promise<PushAPI> | null = null;

export const usePushClient = () => {
  const wallet = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);

  const pushClient = useQuery({
    queryKey: ["push-client", wallet.data],
    queryFn: async () => {
      if (!wallet.data || !_pushClient) return null;
      const client = await _pushClient;

      return client;
    },
  });

  const initializePushClient = useCallback(async () => {
    try {
      if (!wallet.data) return;
      setIsLoading(true);
      _pushClient = PushAPI.initialize(wallet.data, {
        env: CONSTANTS.ENV.STAGING,
      });
      pushClient.refetch();

      await _pushClient;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [wallet.data, pushClient]);

  return { pushClient, initializePushClient, isLoading };
};

export const useChatList = () => {
  const { pushClient } = usePushClient();
  const chatList = useQuery({
    queryKey: ["chat-list"],
    queryFn: async () => {
      if (!pushClient.data) return [];
      return pushClient.data.chat.list("CHATS");
    },
    enabled: !!pushClient.data,
  });

  return chatList;
};

export const useChatRequests = () => {
  const { pushClient } = usePushClient();
  const chatRequests = useQuery({
    queryKey: ["chat-requests"],
    queryFn: async () => {
      try {
        if (!pushClient.data) return [];
        return pushClient.data.chat.list("REQUESTS");
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    enabled: !!pushClient.data,
  });

  return chatRequests;
};

export const useChatHistory = (target: string) => {
  const { pushClient } = usePushClient();
  const chatHistory = useQuery({
    queryKey: ["chat-history", target],
    queryFn: async () => {
      try {
        if (!pushClient.data) return [];
        const history = await pushClient.data.chat.history(target);

        return history as IMessageIPFSWithCID[];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    enabled: !!pushClient.data,
  });

  return chatHistory;
};

export const useChatActions = () => {
  const { pushClient } = usePushClient();

  const sendMessage = useCallback(
    async (target: Address, message: string) => {
      if (!pushClient.data) return;
      console.log("sending message", target, message);
      return pushClient.data.chat.send(target, {
        content: message,
        type: "Text",
      });
    },
    [pushClient.data]
  );

  const acceptRequest = useCallback(
    async (target: Address) => {
      if (!pushClient.data) return;
      return pushClient.data.chat.accept(target);
    },
    [pushClient.data]
  );

  const rejectRequest = useCallback(
    async (target: Address) => {
      if (!pushClient.data) return;
      return pushClient.data.chat.reject(target);
    },
    [pushClient.data]
  );

  return {
    sendMessage,
    acceptRequest,
    rejectRequest,
  };
};
