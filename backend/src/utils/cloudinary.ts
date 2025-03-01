import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { unlink } from "fs/promises";
import { join } from "path";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export async function saveImage(
  image: string | undefined,
  folder?: string,
): Promise<UploadApiResponse | undefined> {
  if (!image) {
    return;
  }
  const path = join("/", "tmp", image);
  const cloudinaryReturns = await cloudinary.uploader.upload(path, {
    quality_analysis: true,
    folder: folder || "discord-clone",
    resource_type: "image",
    unique_filename: true,
  });
  await unlink(path);
  return cloudinaryReturns;
}

export async function getImage(
  image: string,
  width: number = 250,
): Promise<string | null> {
  if (!image) {
    return null;
  }
  const cloudinaryReturns = cloudinary.image(image, {
    quality: "auto",
    fetch_format: "auto",
    width,
  });

  if (cloudinaryReturns) {
    return cloudinaryReturns
      .split(" ")[1]
      .split("=")[1]
      .split("?")[0]
      .replace("'", "");
  }
  return null;
}
