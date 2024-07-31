import { EChanneType, EServerRole } from "../enums";
import { NotFoundError } from "../errors";
import {
  IServer,
  IServerMember,
  IServerRetrieved,
  IUserSever,
} from "../interfaces";
import { UUID } from "../types";
import { BaseModel } from "./BaseModel";

export class ServerModel extends BaseModel {
  static async createServer(server: IServer) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      const [newServer] = await trx("servers")
        .insert(server)
        .returning(["id", "userId as ownerId"]);

      await trx("server_members").insert({
        serverId: newServer.id,
        userId: newServer.ownerId,
        serverRole: EServerRole.OWNER,
      });

      await trx("server_channels").insert([
        {
          serverId: newServer.id,
          createdBy: newServer.ownerId,
          channelName: "general",
          channelPermission: EServerRole.GUEST,
          channelType: EChanneType.TEXT,
        },
        {
          serverId: newServer.id,
          createdBy: newServer.ownerId,
          channelName: "general",
          channelPermission: EServerRole.GUEST,
          channelType: EChanneType.VOICE,
        },
      ]);
    });
  }

  static async deleteServer(id: UUID, userId: UUID) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      const query = trx("servers").where({ id }).andWhere({ userId }).del();
      await query;
    });
  }

  static getOwner(id: UUID) {
    return ServerModel.queryBuilder()
      .table("servers")
      .where({ id })
      .select(["id", "userId"])
      .first();
  }

  static async getServerById(id: UUID): Promise<IServerRetrieved | undefined> {
    return await ServerModel.queryBuilder()
      .table("servers as s")
      .where("s.id", "=", id)
      .select<
        IServerRetrieved | undefined
      >("userName as owner", "displayName as ownerDisplayName", "s.id as serverId", "serverName", "serverPicture")
      .join("users as u", "u.id", "s.userId")
      .first();
  }

  static getAllUserServer(userId: UUID) {
    return ServerModel.queryBuilder()
      .from("server_members as sm")
      .where("sm.userId", "=", userId)
      .select<
        IUserSever[]
      >("u.userName as ownerName", "u2.userName as memberName", "s.id as serverId", "serverName", "serverPicture")
      .join("servers as s", "s.id", "sm.serverId")
      .join("users as u", "u.id", "s.userId")
      .join("users as u2", "u2.id", "sm.userId");
  }

  static async addUserToServer(id: UUID, userId: UUID) {
    return await ServerModel.queryBuilder().transaction(async (trx) => {
      const server = await trx("servers").where({ id }).first();
      if (!server) throw new NotFoundError(`Server not found`);
      const user = await trx("users").where({ id: userId }).first();
      if (!user) throw new NotFoundError(`User not found`);

      await trx("serverMembers")
        .insert({ serverId: id, userId })
        .returning("id");
    });
  }

  static removeUserFromServer(id: UUID, userId: UUID) {
    return ServerModel.queryBuilder().transaction(async (trx) => {
      await trx("serverMembers").where({ serverId: id, userId }).delete();
    });
  }

  static async getAllServerMember(serverId: UUID) {
    return await ServerModel.queryBuilder()
      .table("serverMembers as sm")
      .where({ serverId })
      .join("users as u", "u.id", "sm.userId")
      .join("servers as s", "s.id", "sm.serverId")
      .select<
        IServerMember[]
      >("userName as memberName", "serverRole", "serverName", "u.id as memberId", "sm.createdAt as joinedOn");
  }
}
