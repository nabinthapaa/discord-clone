import { authStore } from "./store/authStore";
import "./styles/styles.css";
import { isValidPath } from "./utils/isValidPath";
import { Router } from "./utils/router";
import { loginForm } from "./views/login.view";
import { mainViewUi } from "./views/main.view";
import { notFoundView } from "./views/notFound.view";

const app = document.querySelector<HTMLDivElement>("#app")!;
const currentPath = location.pathname;

if (isValidPath(currentPath)) {
  if (!authStore.getState().isAuthenticated) {
    Router.hardNavigate("/login", () => {
      loginForm(app);
    });
  } else {
    Router.hardNavigate("/@me", () => mainViewUi(app));
  }
} else {
  Router.hardNavigate("/not-found", notFoundView);
}

authStore.subscribe(() => {
  if (isValidPath(currentPath)) {
    console.log(authStore.getState());
    if (!authStore.getState().isAuthenticated) {
      console.log("Unauthenticated", authStore.getState());
      Router.hardNavigate("/login", () => {
        loginForm(app);
      });
    } else {
      Router.hardNavigate("/@me", () => mainViewUi(app));
    }
  } else {
    Router.hardNavigate("/not-found", notFoundView);
  }
});
