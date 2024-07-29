import { getComponent } from "../utils/getComponent";
import { requestToServer } from "../utils/requestHandler";
import { Router } from "../utils/router";
import { registerForm } from "./register.view";

async function handleFormSubmit(data: FormData) {
  console.log(data);
}

export async function loginForm(app: HTMLDivElement) {
  const loginFormContent = await getComponent("auth", "loginForm");
  app.innerHTML = loginFormContent;
  const form = app.querySelector("#form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    await requestToServer("", {});
    await handleFormSubmit(formData);
  });

  form
    .querySelector<HTMLAnchorElement>("#sign-up")!
    .addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();

      const href = (e.target as HTMLAnchorElement).getAttribute("href");
      if (href) Router.navigate(href, () => registerForm(app));
    });
}
