import { io } from "socket.io-client";
import "./styles/styles.css";
import { isValidPath } from "./utils/isValidPath";
import { Router } from "./utils/router";
import { loginForm } from "./views/login.view";
import { mainViewUi } from "./views/main.view";
import { notFoundView } from "./views/notFound.view";

export const socket = io("http://localhost:8000");
const app = document.querySelector<HTMLDivElement>("#app")!;

const currentPath = location.pathname;

const accessToken = localStorage.getItem("accessToken");
const userData = JSON.parse(
  localStorage.getItem("userData") || `{ "errror": true }`,
);

if (isValidPath(currentPath)) {
  console.log({ accessToken, userData });
  if (!accessToken || userData.error) {
    Router.hardNavigate("/login", () => {
      localStorage.removeItem("accessToken");
      loginForm(app);
    });
  } else {
    Router.hardNavigate("/@me", () => mainViewUi(app));
  }
} else {
  Router.hardNavigate("/not-found", notFoundView);
}
