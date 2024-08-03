export async function getUserMedia() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      throw new Error("Media Devices API is not supported.");
    }
  } catch (error) {
    console.error("Failed to get local stream", error);
  }
}
