import { ChannelService } from ".";
import { EServerRole } from "../enums";
import { BaseError } from "../errors";
import { MessageModel } from "../models";
import { UUID } from "../types";
import { loggerWithNameSpace } from "../utils";

const logger = loggerWithNameSpace("Messge Service");

export async function getDirectMesages(user1Id: UUID, user2Id: UUID) {
  try {
    return await MessageModel.getDirectMessages(user1Id, user2Id);
  } catch (e) {
    logger.error(`Error retrieving messages for ${user1Id} and ${user2Id}`);
    throw new BaseError(`Could not retrieve messages`);
  }
}

export async function createDirectMessage(
  user1Id: UUID,
  user2Id: UUID,
  message: string,
) {
  try {
    return await MessageModel.createDirectMessages({
      user1Id,
      user2Id,
      message,
    });
  } catch (e) {
    logger.error(`Error retrieving messages for ${user1Id} and ${user2Id}`);
    throw new BaseError(`Could not retrieve messages`);
  }
}

export async function getChannelMessages(channelId: UUID) {
  try {
    return await MessageModel.getChannelMessages(channelId);
  } catch (e) {
    logger.error(`Error retrieving messages for channel: ${channelId}`);
    throw new BaseError(`Could not retrieve messages`);
  }
}

export async function createChannelMessage(
  channelId: UUID,
  message: string,
  userId: UUID,
  serverId: UUID,
) {
  try {
    return await MessageModel.createChannelMessage({
      channelId,
      userId,
      serverId,
      message,
    });
  } catch (e) {
    logger.error(
      `Error sending messages for channel: ${channelId} and server: ${serverId}`,
    );
    throw new BaseError(`Error writing message`);
  }
}

export async function deleteChannelMessage(messageId: UUID, senderId: UUID) {
  try {
    const searchedMessage = await MessageModel.getMessageById(messageId);

    if (searchedMessage.senderId !== senderId) {
      const permission = await ChannelService.getUserPermssion(
        searchedMessage.serverId,
        senderId,
      );
      if (permission.serverRole === EServerRole.GUEST) {
        throw new Error("Operation not permitted");
      }
    }
    return await MessageModel.deleteChannelMessage(messageId);
  } catch (e) {
    logger.error(`Error deleting messages for channel: ${messageId}`);
    throw new BaseError(`Error writing message`);
  }
}

export async function editChannelMessage({
  messageId,
  message,
  senderId,
}: {
  messageId: UUID;
  message: string;
  senderId: UUID;
}) {
  const searchedMessage = await MessageModel.getMessageById(messageId);

  if (searchedMessage.senderId !== senderId) {
    const permission = await ChannelService.getUserPermssion(
      searchedMessage.serverId,
      senderId,
    );
    if (permission.serverRole === EServerRole.GUEST) {
      throw new Error("Operation not permitted");
    }
  }

  return await MessageModel.updateChannelMessage(messageId, message, senderId);
}
