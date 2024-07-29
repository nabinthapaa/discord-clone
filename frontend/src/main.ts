import { io } from "socket.io-client";
import "./styles/styles.css";
import { Router } from "./utils/router";
import { loginForm } from "./views/login.view";
import { mainViewUi } from "./views/main.view";

const app = document.querySelector<HTMLDivElement>("#app")!;

const accessToken = localStorage.getItem("accessToken");

if (!accessToken) {
  Router.hardNavigate({}, "/login", () => loginForm(app));
} else {
  Router.hardNavigate({}, "/@me", () => mainViewUi(app));
}

export const socket = io("http://localhost:8000");
