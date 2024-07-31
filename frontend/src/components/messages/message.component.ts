export function message({
  image,
  displayName,
  message,
  time,
}: Record<string, string>) {
  const div = document.createElement("div");
  div.innerHTML = `
  <div  class="border-b border-gray-600 py-3 flex items-start mb-4 text-sm">
    <img src="${image}" class="cursor-pointer w-10 h-10 rounded-3xl mr-3">
    <div class="flex-1 overflow-hidden">
      <div>
        <span class="font-bold text-red-300 cursor-pointer hover:underline">${displayName}</span>
        <span class="font-bold text-gray-400 text-xs">${time}</span>
      </div>
      <p class="text-white leading-normal">${message}</p>
    </div>
  </div>
  `;
  return div;
}
