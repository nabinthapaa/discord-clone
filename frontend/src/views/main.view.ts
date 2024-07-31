import { setupSidebar } from "../components/sidebar/setup";
import { mainViewHtml } from "../constants/html/mainPageHtml";
import { getAllServers } from "../services/server.service";
import { getLocalData } from "../utils/getLocaldata";
import { getHtml } from "../utils/getPageHtml";
import { Router } from "../utils/router";
import { loginForm } from "./login.view";

export async function mainViewUi(parent: HTMLDivElement) {
  const html = await getHtml(mainViewHtml);
  parent.innerHTML = html;
  parent.style.display = "flex";

  // Fetching locally stored user data
  const userData = await getLocalData();
  if (!userData) Router.hardNavigate("/login", () => loginForm(parent));

  // Fetching all servers of user stored locally
  const servers = await getAllServers(userData.id);

  const sidebarComponent = parent.querySelector<HTMLDivElement>("#sidebar")!;
  const channelBarComponent =
    parent.querySelector<HTMLDivElement>("#channel-bar")!;
  const messageBoxComponent =
    parent.querySelector<HTMLDivElement>("#message-box")!;

  setupSidebar(sidebarComponent, servers?.data);
}
