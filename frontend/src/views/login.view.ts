import { ILogin } from "../interfaces/auth.interface";
import { loginSchema } from "../schemas/auth.schema";
import { login } from "../services/auth.service";
import { getComponent } from "../utils/getComponent";
import { Router } from "../utils/router";
import { validate } from "../utils/validator";
import { mainViewUi } from "./main.view";
import { registerForm } from "./register.view";

async function handleFormSubmit(data: FormData, formParent: HTMLDivElement) {
  const email = data.get("email");
  const password = data.get("password");

  const { success, errors } = validate(loginSchema, { email, password });
  if (!success && errors) {
    errors.forEach((err) => {
      document.querySelector(`#${err.error}-error`)!.textContent = err.message;
    });
  } else if (success) {
    const loginData: ILogin = {
      email: email as string,
      password: password as string,
    };
    const data = await login(loginData);
    if (data) {
      Router.navigateWithData("/@me", () => mainViewUi(formParent), data.data);
    }
  }
}

export async function loginForm(app: HTMLDivElement) {
  const loginFormContent = await getComponent("auth", "loginForm");
  app.innerHTML = loginFormContent;
  const form = app.querySelector("#form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    await handleFormSubmit(formData, app);
  });

  form.querySelectorAll("input").forEach((i) =>
    i.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      form.querySelector(`#${target.name}-error`)!.textContent = "";
    }),
  );

  form
    .querySelector<HTMLAnchorElement>("#sign-up")!
    .addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      const href = (e.target as HTMLAnchorElement).getAttribute("href");
      if (href) Router.navigate(href, () => registerForm(app));
    });
}
