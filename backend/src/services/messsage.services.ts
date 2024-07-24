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

export async function getChannelMessages(channelId: UUID, serverId: UUID) {
  try {
    return await MessageModel.getChannelMessages(channelId, serverId);
  } catch (e) {
    logger.error(
      `Error retrieving messages for channel: ${channelId} and server: ${serverId}`,
    );
    throw new BaseError(`Could not retrieve messages`);
  }
}
