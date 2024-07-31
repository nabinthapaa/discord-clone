import { IServerData } from "../../interfaces/server.interface";
import { formDataSchema } from "../../schemas/server.schema";
import { createSever } from "../../services/server.service";
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
      console.log();
      const serverIcon = sidebarIcons(server);
      serverIcon.querySelector("#serverName")!.textContent = server.serverName;
      serverContainer?.appendChild(serverIcon);
      serverIcon.dataset.id = server.serverId;
      serverIcon.onclick = () => {};
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
