import { ServerModel } from "../models/server.model";
import { UUID } from "../types";
import { UserService } from ".";
import { v2 as cloudinary } from "cloudinary";
import { saveImage } from "../utils/saveImage";
import { Multer } from "multer";

// TODO: Setup cloudinary
export async function createServer(
  name: string,
  image: string | undefined,
  userId: UUID,
) {
  let imageUrl: string | undefined;
  if (image) {
    imageUrl = (await saveImage(image))?.secure_url;
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
