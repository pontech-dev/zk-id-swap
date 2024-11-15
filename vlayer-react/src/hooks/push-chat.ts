import { useWalletClient } from "wagmi";
import { PushAPI, } from "@pushprotocol/restapi"
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useCallback } from "react";

export const usePushClient = () => {
    const wallet = useWalletClient();
    const pushClient = useQuery({
        queryKey: ["push-client", wallet.data],
        queryFn: async () => {
            if (!wallet.data) return null;
            return PushAPI.initialize(wallet.data)
        }
    })

    return pushClient;
};

export const useChatList = () => {
    const pushClient = usePushClient();
    const chatList = useQuery({
        queryKey: ["chat-list", pushClient.data],
        queryFn: async () => {
            if (!pushClient.data) return [];
            return pushClient.data.chat.list("CHATS")
        }
    })

    return chatList;
}

export const useChatRequests = () => {
    const pushClient = usePushClient();
    const chatRequests = useQuery({
        queryKey: ["chat-requests", pushClient.data],
        queryFn: async () => {
            if (!pushClient.data) return [];
            return pushClient.data.chat.list("REQUESTS")
        }
    })

    return chatRequests;
}

export const useChatHistory = (
    target: Address
) => {
    const pushClient = usePushClient();
    const chatHistory = useQuery({
        queryKey: ["chat-history", pushClient.data, target],
        queryFn: async () => {
            if (!pushClient.data) return [];
            return pushClient.data.chat.history(target)
        }
    })

    return chatHistory;
}

export const useChatActions = () => {
    const pushClient = usePushClient();

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