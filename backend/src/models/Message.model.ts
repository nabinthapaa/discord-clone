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

  static getChannelMessages(channelId: UUID, serverId: UUID) {
    return MessageModel.queryBuilder()
      .table("server_messages as sm")
      .select(
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
