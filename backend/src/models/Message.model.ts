import { ForbiddenError } from "../errors";
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

  static getMessageById(id: UUID) {
    return MessageModel.queryBuilder()
      .table("serverMessages")
      .where({ id })
      .first();
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
      const { channelType } = await trx("serverChannels")
        .where({ id: channelId })
        .first();
      if (channelType === "voice") {
        throw new ForbiddenError(`Cannot write message to this channel`);
      }
      const [newMessage] = await trx("server_messages")
        .insert({
          channelId,
          serverId,
          content: message,
          senderId: userId,
        })
        .returning<IChannelMessageDB[]>([
          "id as messageId",
          "content as message",
          "createdAt as sentOn",
          "isPinned as isPinned",
        ]);

      const [senderName] = await trx("users")
        .where({ id: userId })
        .returning(["displayName", "userName"]);
      const [serverName] = await trx("servers")
        .where({ id: serverId })
        .returning(["name"]);
      const [channelName] = await trx("server_channels")
        .where({ id: channelId })
        .returning(["name"]);

      return {
        ...newMessage,
        senderName: senderName.display_name,
        userName: senderName.userName,
        serverName: serverName.name,
        channelName: channelName.name,
        serverId,
      };
    });
  }

  static async getChannelMessages(channelId: UUID) {
    return await MessageModel.queryBuilder()
      .table("server_messages as sm")
      .select<IChannelMessage[]>(
        "sm.id as messageId",
        "sm.content as message",
        "sm.created_at as sentOn",
        "sc.channelName as channelName",
        "u.displayName as senderName",
        "u.userName as userName",
      )
      .andWhere("sm.channelId", "=", channelId)
      .join("serverChannels as sc", "sm.channelId", "sc.id")
      .join("users as u", "sm.senderId", "u.id")
      .orderBy([{ column: "sm.createdAt", order: "desc" }])
      .limit(20);
  }

  static async updateChannelMessage(
    id: UUID,
    message: string,
    userId: UUID,
  ): Promise<{ content: string }> {
    return await MessageModel.queryBuilder().transaction(async (trx) => {
      await trx("serverMessages")
        .where({ id, senderId: userId })
        .update("content", message);

      return await trx("serverMessages")
        .select("content")
        .where({ id })
        .first();
    });
  }

  static async deleteChannelMessage(id: UUID) {
    return await MessageModel.queryBuilder().transaction(async (trx) => {
      await trx("serverMessages").where({ id }).del();
    });
  }
}
