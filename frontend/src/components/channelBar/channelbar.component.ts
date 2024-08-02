export function channelNamse({
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
