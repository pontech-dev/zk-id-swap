import {
  IFeeds,
  IMessageIPFS,
  IMessageIPFSWithCID,
} from "@pushprotocol/restapi";
import { Address } from "viem";

export const pickContent = (feed: IFeeds): string => {
  return parseMessageContent(feed.msg);
};

export const parseTarget = (feed: IFeeds): Address => {
  return feed.did.split(":")[1] as Address;
};

export const parseMessageId = (message: IMessageIPFSWithCID): string => {
  return message.cid;
};

export const parseMessageFrom = (message: IMessageIPFSWithCID): Address => {
  return message.fromDID.split(":")[1] as Address;
};

export const parseMessageTo = (message: IMessageIPFSWithCID): Address => {
  return message.toDID.split(":")[1] as Address;
};

export const parseMessageContent = (message: IMessageIPFS): string => {
  const messageObj = message.messageObj;
  if (!messageObj) return "";
  if (typeof messageObj === "string") return messageObj;
  const content = messageObj.content;
  if (typeof content === "string") return content;
  return content.toString();
};

export const isMe = (
  message: IMessageIPFSWithCID,
  address: Address | undefined
) => {
  return parseMessageFrom(message) === address;
};
