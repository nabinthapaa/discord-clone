import { IServerData } from "../../interfaces/server.interface";
import { socket } from "../../main";
import { formDataSchema } from "../../schemas/server.schema";
import { createSever, getServerInfo } from "../../services/server.service";
import { UUID } from "../../types";
import { validate } from "../../utils/validator";
import { channelNamse } from "../channelBar/channelbar.component";
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
        fetchServerChannels(server.serverId);
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

      const { errors, success } = validate(formDataSchema, formdata);
      if (success) {
        modal!
          .querySelector<HTMLButtonElement>("#create-server-button")
          ?.setAttribute("disable", "true");
        await createSever(formdata);
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

async function fetchServerChannels(serverId: UUID) {
  const serverChannel = await getServerInfo(serverId);
  const channelBarContainer = document.querySelector("#channel-bar")!;
  const voiceChannelGroup =
    channelBarContainer.querySelector("#voice-channel")!;
  const textChannelGroup = channelBarContainer.querySelector("#text-channel")!;
  voiceChannelGroup.innerHTML = "";
  textChannelGroup.innerHTML = "";

  serverChannel?.data.forEach((channel) => {
    const channelBar = channelNamse(channel as Record<string, any>);
    const channelExists = channelBarContainer.querySelector(
      `[data-id='${channel.id}']`,
    );
    if (!channelExists) {
      if (channel.channelType === "text") {
        textChannelGroup.appendChild(channelBar);
        channelBar.onclick = () => {
          socket.emit("joinChannel", {
            id: channel.id,
          });
        };
      }
      if (channel.channelType === "voice")
        voiceChannelGroup.appendChild(channelBar);
    }
  });
}
