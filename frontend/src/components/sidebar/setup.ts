import { HttpMethod } from "../../enums/method";
import { IServerData } from "../../interfaces/server.interface";
import { formDataSchema } from "../../schemas/server.schema";
import { requestToServer } from "../../utils/requestHandler";
import { Router } from "../../utils/router";
import { validate } from "../../utils/validator";
import { sidebarIcons } from "./sidebarIcons.component";

export async function setupSidebar(sidebar: HTMLDivElement) {
  const serverContainer =
    sidebar.querySelector<HTMLDivElement>("#server-container");
  const createNewSever =
    sidebar.querySelector<HTMLDivElement>("#create-new-server");
  const dmContainer = sidebar.querySelector<HTMLDivElement>("#dm-container");
  const modal = document.querySelector<HTMLDivElement>("#create-server-modal");
  let isModalOpen = false;
  const accessToken = localStorage.getItem("accessToken");
  const userData = JSON.parse(
    localStorage.getItem("userData") || `{ "error": true }`,
  );
  if (!accessToken || userData.error) {
    return Router.hardNavigate("/login", () => {
      if (accessToken) {
        localStorage.removeItem("accessToken");
      }
    });
  }

  const closeModal = () => {
    isModalOpen = false;
    modal?.classList.add("scale-0");
    modal?.classList.remove("animate-pop-up");
  };

  const servers = await requestToServer<IServerData[]>(
    `http://localhost:8000/servers/users/${userData.id}`,
    {
      method: HttpMethod.GET,
    },
    (data) => data.data,
  );

  if (servers)
    servers.forEach((server: any) => {
      const serverIcon = sidebarIcons(server);
      serverIcon.querySelector("#serverName")!.textContent = server.serverName;
      serverContainer?.appendChild(serverIcon);
      serverIcon.onclick = closeModal;
    });

  createNewSever?.addEventListener("click", (e) => {
    e.preventDefault();
    modal?.classList.toggle("scale-0");
    modal?.classList.toggle("animate-pop-up");
    isModalOpen = !isModalOpen;
  });

  parent.addEventListener("click", (e) => {
    const parent = document.querySelector<HTMLDivElement>("#app");
    console.log(isModalOpen);
    if (isModalOpen && e.target === parent) {
      closeModal();
      return;
    }
  });

  dmContainer?.addEventListener("click", (e) => {
    e.preventDefault();
  });

  modal!.querySelector("#close-modal")?.addEventListener("click", closeModal);
  modal!
    .querySelector<HTMLFormElement>("#create-server-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formdata = new FormData(form);

      const { errors, success } = validate(formDataSchema, formdata);
      console.log({
        errors,
        success,
      });
    });
}
