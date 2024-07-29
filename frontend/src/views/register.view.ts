import { getComponent } from "../utils/getComponent";
import { Router } from "../utils/router";
import { loginForm } from "./login.view";

async function handleFormSubmit(data: FormData) {
  console.log(data);
}

export async function registerForm(app: HTMLDivElement) {
  const loginFormContent = await getComponent("auth", "registerForm");
  app.innerHTML = loginFormContent;
  const form = app.querySelector("#form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    await handleFormSubmit(formData);
  });

  form
    .querySelector<HTMLAnchorElement>("#sign-in")!
    .addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();

      const href = (e.target as HTMLAnchorElement).getAttribute("href");
      if (href) Router.navigate(href, () => loginForm(app));
    });
}
