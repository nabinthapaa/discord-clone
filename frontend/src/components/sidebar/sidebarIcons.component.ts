import { IMAGE_SOURCE } from "../../constants/html/imageSource";

export function sidebarIcons({
  serverName,
  serverPicture,
  serverId,
}: Record<string, string>) {
  const image = serverPicture ? serverPicture : IMAGE_SOURCE;
  const div = document.createElement("div");
  div.innerHTML = `
    <button data-open="true" data-id="${serverId}" class="relative cursor-pointer mb-4  pb-2 group" id="serverid-${serverId}" >
      <div
        class="bg-white h-12 w-12 flex items-center justify-center text-black text-2xl font-semibold rounded-3xl mb-1 overflow-hidden"
      >
        <img 
          class="object-cover w-full h-full"
          src="${image}" 
          alt="server photo of server ${serverName}" 
        />
      </div>
    <span
      class="absolute scale-0 w-auto top-1/2 z-50 p-2 m-2 min-w-max left-[100%] -translate-y-1/2 rounded-md shadow-md text-white bg-gray-900 text-sm font-bold transition-all duration-100 origin-left group-hover:scale-100"
      id="serverName"></span
    </button>
  `;
  return div;
}
