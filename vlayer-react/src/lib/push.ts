import { IFeeds } from "@pushprotocol/restapi";
import { Address } from "viem";

export const pickContent = (feed: IFeeds): string => {
    const messageObj = feed?.msg?.messageObj;
    if (!messageObj) return "";
    if (typeof messageObj === "string") return messageObj;
    const content = messageObj.content;
    if (typeof content === "string") return content;
    return content.toString();
};


export const parseTarget = (feed: IFeeds): Address => {
    return feed.msg.fromDID.split(":")[1] as Address;
};

