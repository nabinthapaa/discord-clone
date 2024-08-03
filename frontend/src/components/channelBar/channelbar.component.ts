import { IMAGE_SOURCE } from "../../constants/html/imageSource";

export function textChannel({
  channelName,
  channelType,
  id,
}: Record<string, string>) {
  const div = document.createElement("div");
  div.innerHTML = `
  <button data-id='${id}'  class="mb-8">
    <div
      class="bg-teal-dark hover:bg-gray-800 cursor-pointer font-semibold py-1 px-4 text-gray-300"
    >
      ${channelType === "text" ? "#" : "🔊"} ${channelName}
    </div>
  </button>
  `;
  return div;
}

export function voiceChannel({
  channelName,
  channelType,
  id,
}: Record<string, string>) {
  const div = document.createElement("div");
  div.innerHTML = `
  <button data-id='${id}'  class="mb-8">
    <div
      class="bg-teal-dark hover:bg-gray-800 cursor-pointer font-semibold py-1 px-4 flex flex-col items-start justify-start text-gray-300"
    >
      <p>
        ${channelType === "text" ? "#" : "🔊"} ${channelName}
      </p>
      <div id='connected-user-${id}' class= 'ml-2'>
      </div>
    </div>
  </button>
  `;
  return div;
}

export function connectedUser(userData: Record<string, any>) {
  const div = document.createElement("div");
  div.innerHTML = `
  <div id='user-${userData.id}' class="flex items-center mb-1 bg-gray-800 rounded-lg shadow-md">
      <img src='${IMAGE_SOURCE}' alt="User Avatar" class="w-6 h-6 rounded-full">
      <div class="ml-4">
        <h2 class="text-sm text-gray-300">
          ${userData.displayName || userData.userName || "UserName"}
        </h2>
      </div>
  </div>
  `;
  return div;
}
