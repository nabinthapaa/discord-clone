import { IServerData } from "../../interfaces/server.interface";
import { createServerSchema } from "../../schemas/server.schema";
import { createServer } from "../../services/server.service";
import { serverStateStore } from "../../store/serverStateStore";
import { addFormError } from "../../utils/addFormErrors";
import { validate } from "../../utils/validator";
import { sidebarIcons } from "./sidebarIcons.component";

export async function setupSidebar(
  sidebar: HTMLDivElement,
  servers: IServerData[] | undefined,
) {
  const serverContainer =
    sidebar.querySelector<HTMLDivElement>("#server-container")!;
  const createNewSever =
    sidebar.querySelector<HTMLDivElement>("#create-new-server")!;
  const modal = document.querySelector<HTMLDivElement>("#create-server-modal");

  const submitCreateServer = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formdata = new FormData(form);

    const { success, errors } = validate(createServerSchema, formdata);
    if (!success) {
      addFormError(form, errors);
    }
    if (success) {
      modal!
        .querySelector<HTMLButtonElement>("#create-server-button")
        ?.setAttribute("disabled", "true");
      await createServer(formdata);
      closeModal();
    }
  };

  const closeModal = () => {
    modal?.classList.add("scale-0");
    modal?.classList.remove("animate-pop-up");
    modal!
      .querySelector<HTMLButtonElement>("#close-modal")!
      .removeEventListener("click", closeModal);
    modal!
      .querySelector<HTMLFormElement>("#create-server-form")
      ?.removeEventListener("submit", submitCreateServer);
  };

  const openModal = () => {
    modal?.classList.toggle("scale-0");
    modal?.classList.toggle("animate-pop-up");
    modal!
      .querySelector<HTMLButtonElement>("#close-modal")!
      .addEventListener("click", closeModal);
    modal!
      .querySelector<HTMLFormElement>("#create-server-form")
      ?.addEventListener("submit", submitCreateServer);
  };

  if (servers)
    servers.forEach((server: any) => {
      const serverIcon = sidebarIcons(server);
      serverIcon.querySelector("#serverName")!.textContent = server.serverName;
      serverContainer?.appendChild(serverIcon);
      serverIcon.dataset.id = server.serverId;

      serverIcon.onmouseover = (e) => {
        attachTooltipToMouse(serverIcon, e);
      };

      serverIcon.onclick = async () => {
        serverStateStore.getState().changeActiveServer(server.serverId);
        document.querySelector(`#server-name`)!.textContent = server.serverName;
      };
    });

  createNewSever?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(modal);
    openModal();
  });

  document.addEventListener("click", (e) => {
    if (e.target === modal) {
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
