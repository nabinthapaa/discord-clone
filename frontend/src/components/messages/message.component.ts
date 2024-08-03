import { IMAGE_SOURCE } from "../../constants/html/imageSource";

export function message({
  messageId,
  image,
  displayName,
  message,
  time,
}: Record<string, string>) {
  const imageSource = !image ? IMAGE_SOURCE : image;
  const div = document.createElement("div");
  div.id = messageId;
  div.innerHTML = `
    <div class="border-b border-gray-600 py-3 flex items-start mb-4 text-sm relative">
      <img src="${imageSource}" class="cursor-pointer w-10 h-10 rounded-3xl mr-3">
      <div class="flex-1 overflow-hidden">
        <div class="flex justify-between items-center">
          <div>
            <span class="font-bold text-red-300 cursor-pointer hover:underline">${displayName}</span>
            <span class="font-bold text-gray-400 text-xs">${time}</span>
          </div>
          <button data-id="${messageId}" id="edit-message-${messageId}" class="text-gray-400 hover:text-white focus:outline-none">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h.01M12 12h.01M18 12h.01"></path>
            </svg>
          </button>
          <div class="absolute right-0 mt-2 bg-gray-700 rounded-lg shadow-lg py-2 z-50 hidden" id="message-actions-${messageId}">
            <button data-id="${messageId}" class="block px-4 py-2 text-sm text-white hover:bg-gray-600" id="edit-button">Edit</button>
            <button data-id="${messageId}" class="block px-4 py-2 text-sm text-white hover:bg-gray-600" id="delete-button">Delete</button>
          </div>
        </div>
        <p id="message" class="text-white leading-normal">${message}</p>
        <form id="edit-message-form" class="hidden space-y-2">
          <textarea 
              class='bg-gray-700 text-white px-2 py-1 border-2 mx-4 border-gray-500 rounded w-4/5 resize-y  h-auto' 
              id="edit-message-input-${messageId}" 
          >${message}</textarea>
          <div>
            <button type="submit" class="bg-blue-500 text-white px-2 py-1 rounded">Save</button>
            <button type="button" class="bg-gray-500 text-white px-2 py-1 rounded" id="cancel-edit-${messageId}">Cancel</button>
          </div>
        </form>
        </div>
    </div>
`;
  return div;
}
