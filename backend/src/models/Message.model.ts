import {
  IChannelMessage,
  IChannelMessageDB,
  IDirectMessage,
} from "../interfaces/message.interface";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class MessageModel extends BaseModel {
  static getDirectMessages(user1Id: UUID, user2Id: UUID) {
    return MessageModel.queryBuilder()
      .table("direct_messages as dm")
      .select(
        "dm.id as message_id",
        "u.display_name as user1_name",
        "u2.display_name as user2_name",
        "content as message",
        "is_pinned",
        "dm.created_at as send_on",
      )
      .innerJoin("users as u", "u.id", "dm.sender_id")
      .innerJoin("users as u2", "u2.id", "dm.reciever_id")
      .where(function () {
        this.where("dm.sender_id", user1Id).orWhere("dm.reciever_id", user1Id);
      })
      .andWhere(function () {
        this.where("dm.sender_id", user2Id).orWhere("dm.reciever_id", user2Id);
      });
  }

  static createDirectMessages({
    user1Id,
    user2Id,
    message,
  }: {
    user1Id: UUID;
    user2Id: UUID;
    message: string;
  }): Promise<IDirectMessage> {
    return MessageModel.queryBuilder().transaction(async (trx) => {
      const [id, content, sendOn, isPinned] = await trx("direct_messages")
        .insert({
          user1Id,
          user2Id,
          content: message,
        })
        .returning(["id", "content", "created_at", "is_pinned"]);

      const [user1Name] = await trx("users")
        .where({ id: user1Id })
        .returning(["display_name"]);
      const [user2Name] = await trx("users")
        .where({ id: user2Id })
        .returning(["display_name"]);

      return {
        messageId: id,
        user1Name,
        user2Name,
        message: content,
        sendOn,
        isPinned,
      };
    });
  }

  static createChannelMessage({
    channelId,
    serverId,
    userId,
    message,
  }: {
    channelId: UUID;
    serverId: UUID;
    userId: UUID;
    message: string;
  }): Promise<IChannelMessage> {
    return MessageModel.queryBuilder().transaction(async (trx) => {
      const [newMessage] = await trx("server_messages")
        .insert({
          channelId,
          serverId,
          content: message,
        })
        .returning<IChannelMessageDB[]>([
          "id as messageId",
          "content as message",
          "created_at as sendOn",
          "is_pinned as isPinned",
        ]);

      const [senderName] = await trx("users")
        .where({ id: userId })
        .returning(["display_name"]);
      const [serverName] = await trx("servers")
        .where({ id: serverId })
        .returning(["name"]);
      const [channelName] = await trx("server_channels")
        .where({ id: channelId })
        .returning(["name"]);

      return {
        ...newMessage,
        senderName: senderName.display_name,
        serverName: serverName.name,
        channelName: channelName.name,
      };
    });
  }

  static async getChannelMessages(channelId: UUID, serverId: UUID) {
    return await MessageModel.queryBuilder()
      .table("server_messages as sm")
      .select<IChannelMessage[]>(
        "sm.id as message_id",
        "sm.content as message",
        "sm.created_at as send_on",
        "sc.name as channelName",
        "u.name as sender_name",
      )
      .where("sm.server_id", "=", serverId)
      .andWhere("sm.channel_id", "=", channelId)
      .join("server_channels as sc", "sm.channel_id", "sc.id")
      .join("users as u", "sm.sender_id", "u.id")
      .orderBy([{ column: "sm.created_at", order: "desc" }])
      .limit(20);
  }
}
