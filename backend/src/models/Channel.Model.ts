import { IChannel } from "../interfaces/channel.interface";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class ChannelModel extends BaseModel {
  static async createChannel(channel: IChannel) {
    return await ChannelModel.queryBuilder().transaction(async (trx) => {
      await trx("servers").where({ id: channel.serverId });
      await trx("serverChannels").insert(channel);
    });
  }

  static async deleteChannel(id: UUID) {
    return await ChannelModel.queryBuilder().transaction(async (trx) => {
      await trx("serverChannels").where({ id }).del();
    });
  }

  static getChannelById(id: UUID) {
    return ChannelModel.queryBuilder()
      .table("serverChannels")
      .where({ id })
      .select("*")
      .first();
  }

  static getAllChannelOfSever(serverId: UUID) {
    return ChannelModel.queryBuilder()
      .table("serverChannels as sc")
      .where({ serverId })
      .select("*")
      .join("servers as s", "s.id", "sc.serverId");
  }
}
