import { setupChannelBar } from "../components/channelBar/setup";
import { setupMessage } from "../components/messages/setup";
import { setupSidebar } from "../components/sidebar/setup";
import { mainViewHtml } from "../constants/html/mainPageHtml";
import { getAllServers } from "../services/server.service";
import { authStore } from "../store/authStore";
import { serverStateStore } from "../store/serverStateStore";
import { getHtml } from "../utils/getPageHtml";

export async function mainViewUi(parent: HTMLDivElement) {
  const html = await getHtml(mainViewHtml);
  parent.innerHTML = html;
  parent.style.display = "flex";

  const userData = authStore.getState().userData;
  if (!userData) {
    authStore.getState().logout();
    return;
  }

  // Fetching all servers of user stored locally
  const servers = await getAllServers(userData.id);

  const sidebarComponent = parent.querySelector<HTMLDivElement>("#sidebar")!;
  const channelBarComponent =
    parent.querySelector<HTMLDivElement>("#channel-bar")!;
  const messageBoxComponent =
    parent.querySelector<HTMLDivElement>("#message-box")!;

  setupSidebar(sidebarComponent, servers?.data);
  setupChannelBar(channelBarComponent);
  if (servers && servers.data.length) {
    serverStateStore.getState().changeActiveServer(servers.data[0].serverId);
  }
  setupMessage(messageBoxComponent);
}
