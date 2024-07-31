import { setupSidebar } from "../components/sidebar/setup";
import { getComponent } from "../utils/getComponent";

export async function mainViewUi(parent: HTMLDivElement) {
  const sidebar = await getComponent("main", "sidebar");
  const channelBar = await getComponent("main", "channelBar");
  const messageBox = await getComponent("main", "message");
  const modal = await getComponent("modals", "createServerModal");
  parent.innerHTML = sidebar + channelBar + messageBox + modal;

  const sidebarComponent = parent.querySelector<HTMLDivElement>("#sidebar")!;
  const channelBarComponent =
    parent.querySelector<HTMLDivElement>("#channel-bar")!;
  const messageBoxComponent =
    parent.querySelector<HTMLDivElement>("#message-box")!;

  setupSidebar(sidebarComponent);

  parent.style.display = "flex";
}
