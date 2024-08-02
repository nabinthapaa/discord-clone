import { io } from "socket.io-client";
import "./styles/styles.css";
import { isValidPath } from "./utils/isValidPath";
import { Router } from "./utils/router";
import { loginForm } from "./views/login.view";
import { mainViewUi } from "./views/main.view";
import { notFoundView } from "./views/notFound.view";
import { getLocalData } from "./utils/getLocaldata";

export const socket = io("http://localhost:8000");
const app = document.querySelector<HTMLDivElement>("#app")!;

const currentPath = location.pathname;
const localData = getLocalData();

if (isValidPath(currentPath)) {
  if (!localData) {
    Router.hardNavigate("/login", () => {
      loginForm(app);
    });
  } else {
    Router.hardNavigate("/@me", () => mainViewUi(app));
  }
} else {
  Router.hardNavigate("/not-found", notFoundView);
}
