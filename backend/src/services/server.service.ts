import { UserService } from ".";
import { BadRequestError, NotFoundError } from "../errors";
import { ServerModel } from "../models";
import { UUID } from "../types";
import { getImage, saveImage } from "../utils";

// TODO: Get lower res picture for server profiles
export async function createServer(
  name: string,
  image: string | undefined,
  userId: UUID,
) {
  let imageUrl: string | undefined;
  console.log({ name, image, userId });
  if (image) {
    const response = await saveImage(image);
    console.log("Cloudinary response: ", response);
    imageUrl = response?.public_id;
  }

  return ServerModel.createServer({
    serverName: name,
    serverPicture: imageUrl,
    userId,
  });
}

export async function getServerById(id: UUID) {
  const data = await ServerModel.getServerById(id);
  if (!data) throw new NotFoundError(`Server not found`);
  const serverImage = data.serverPicture
    ? await getServerImage(data.serverPicture)
    : null;

  return { ...data, serverPicture: serverImage };
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

export async function deleteServer(serverId: UUID, userId: UUID) {
  const server = await ServerModel.getOwner(serverId);
  if (server) {
    console.log(server, userId);
    if (server.userId === userId)
      return ServerModel.deleteServer(serverId, userId);
    throw new BadRequestError(`User mismatched`);
  }
  throw new NotFoundError(`Server not found`);
}

export function getServerImage(publicId: string) {
  return getImage(publicId);
}
