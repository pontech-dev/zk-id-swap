// import { useWalletClient } from "wagmi";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi"
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useCallback, } from "react";
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { getSigner } from '@dynamic-labs/ethers-v6';

let _pushClient: Promise<PushAPI> | null = null;

export const usePushClient = () => {
    // const wallet = useWalletClient();
    const { primaryWallet } = useDynamicContext();

    // const pushClient = useQuery({
    //     queryKey: ["push-client", wallet.data],
    //     queryFn: async () => {
    //         if (!wallet.data || !_pushClient) return null;
    //         const client = await _pushClient;

    //         return client;
    //     }
    // })
    const pushClient = useQuery({
      queryKey: ["push-client", primaryWallet?.address],
      queryFn: async () => {
          if (!primaryWallet || !_pushClient) return null;
          const client = await _pushClient;
          return client;
      },
      enabled: !!primaryWallet,
    });

    // const initializePushClient = useCallback(async () => {
    //     if (!wallet.data) return;
    //     _pushClient = PushAPI.initialize(wallet.data);
    //     pushClient.refetch();
    // }, [wallet.data, pushClient])
    const initializePushClient = useCallback(async () => {
      if (!primaryWallet) return;
      const signer = await getSigner(primaryWallet);
      _pushClient = PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      pushClient.refetch();
    }, [primaryWallet, pushClient]);

    return { pushClient, initializePushClient };
};

export const useChatList = () => {
    const { pushClient } = usePushClient();
    const chatList = useQuery({
        queryKey: ["chat-list"],
        queryFn: async () => {
            if (!pushClient.data) return [];
            return pushClient.data.chat.list("CHATS")
        },
        enabled: !!pushClient.data
    })

    console.log({ chatList });

    return chatList;
}

export const useChatRequests = () => {
    const { pushClient } = usePushClient();
    const chatRequests = useQuery({
        queryKey: ["chat-requests"],
        queryFn: async () => {
            try {
                if (!pushClient.data) return [];
                return pushClient.data.chat.list("REQUESTS")
            } catch (error) {
                console.error(error);
                return [];
            }
        },
        enabled: !!pushClient.data
    })

    return chatRequests;
}

export const useChatHistory = (
    target: Address
) => {
    console.log({ target });
    const { pushClient } = usePushClient();
    const chatHistory = useQuery({
      queryKey: ["chat-history", !!pushClient.data, target],
      queryFn: async () => {
        try {
          if (!pushClient.data) return [];
          return pushClient.data.chat.history(target);
        } catch (error) {
          console.error(error);
          return [];
        }
      },
      enabled: !!pushClient.data && !!target,
    });

    console.log(chatHistory);

    return chatHistory;
}

export const useChatActions = () => {
    const { pushClient } = usePushClient();

    const sendMessage = useCallback(async (target: Address, message: string) => {
        if (!pushClient.data) return;
        return pushClient.data.chat.send(target, {
            content: message,
            type: "Text"
        })
    }, [pushClient.data])

    const acceptRequest = useCallback(async (target: Address) => {
        if (!pushClient.data) return;
        return pushClient.data.chat.accept(target)
    }, [pushClient.data])

    const rejectRequest = useCallback(async (target: Address) => {
        if (!pushClient.data) return;
        return pushClient.data.chat.reject(target)
    }, [pushClient.data])

    return {
        sendMessage,
        acceptRequest,
        rejectRequest
    }
}