import { IServerData } from "../../interfaces/server.interface";
import { formDataSchema } from "../../schemas/server.schema";
import { createServer } from "../../services/server.service";
import { serverStateStore } from "../../store/serverStateStore";
import { validate } from "../../utils/validator";
import { sidebarIcons } from "./sidebarIcons.component";

export async function setupSidebar(
  sidebar: HTMLDivElement,
  servers: IServerData[] | undefined,
) {
  const serverContainer =
    sidebar.querySelector<HTMLDivElement>("#server-container");
  const createNewSever =
    sidebar.querySelector<HTMLDivElement>("#create-new-server");
  const dmContainer = sidebar.querySelector<HTMLDivElement>("#dm-container");
  const modal = document.querySelector<HTMLDivElement>("#create-server-modal");

  let isModalOpen = false;

  const closeModal = () => {
    isModalOpen = false;
    modal?.classList.add("scale-0");
    modal?.classList.remove("animate-pop-up");
  };

  if (servers)
    servers.forEach((server: any) => {
      const serverIcon = sidebarIcons(server);
      serverIcon.querySelector("#serverName")!.textContent = server.serverName;
      serverContainer?.appendChild(serverIcon);
      serverIcon.dataset.id = server.serverId;
      serverIcon.onclick = async () => {
        serverStateStore.getState().changeActiveServer(server.serverId);
        closeModal();
      };
      serverIcon.onmouseover = (e) => {
        attachTooltipToMouse(serverIcon, e);
      };
    });

  createNewSever?.addEventListener("click", (e) => {
    e.preventDefault();
    modal?.classList.toggle("scale-0");
    modal?.classList.toggle("animate-pop-up");
    isModalOpen = !isModalOpen;
  });

  dmContainer?.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  modal!.querySelector("#close-modal")?.addEventListener("click", closeModal);
  modal!
    .querySelector<HTMLFormElement>("#create-server-form")
    ?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formdata = new FormData(form);

      const { success } = validate(formDataSchema, formdata);
      if (success) {
        modal!
          .querySelector<HTMLButtonElement>("#create-server-button")
          ?.setAttribute("disable", "true");
        await createServer(formdata);
        closeModal();
      }
    });
}

function attachTooltipToMouse(serverIcon: HTMLDivElement, e: MouseEvent) {
  const tooltip = serverIcon.querySelector<HTMLSpanElement>("#serverName");
  if (tooltip) {
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    // Calculate position so the tooltip is centered above the cursor
    const tooltipX = e.clientX - tooltipWidth / 2;
    const tooltipY = e.clientY - tooltipHeight - 10; // 10px above the cursor

    tooltip.style.position = "fixed";
    tooltip.style.left = `${tooltipX}px`;
    tooltip.style.top = `${tooltipY}px`;
  }
}
