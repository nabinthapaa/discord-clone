import { ServerModel } from "../models/server.model";
import { UUID } from "../types";
import { UserService } from ".";

// TODO: Setup cloudinary
export function createServer(name: string, image: File, userId: UUID) {
  let imageUrl: string | null = null;
  if (image) {
    // get link from cloudinary
  }

  return ServerModel.createServer({
    serverName: name,
    serverPicture: imageUrl,
    userId,
  });
}

export function getServerById(id: UUID) {
  return ServerModel.getServerById(id);
}

export function getAllUserServer(userId: UUID) {
  const user = UserService.getUserById(userId);
  if (!user) throw new Error(`User specified is not found`);
  return ServerModel.getAllUserServer(userId);
}

export function addUserToServer(id: UUID, userId: UUID) {
  const user = UserService.getUserById(userId);
  if (!user) throw new Error(`User specified is not found`);

  return ServerModel.addUserToServer(id, userId);
}

export function removeUserFromServer(id: UUID, userId: UUID) {
  const user = UserService.getUserById(userId);
  if (!user) throw new Error(`User specified is not found`);

  return ServerModel.removeUserFromServer(id, userId);
}

export function getAllSeverMembers(serverId: UUID) {
  return ServerModel.getAllServerMember(serverId);
}
