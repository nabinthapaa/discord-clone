import { IRegister } from "../interfaces/auth.interface";
import { registerSchema } from "../schemas/auth.schema";
import { register } from "../services/auth.service";
import { addFormError } from "../utils/addFormErrors";
import { getComponent } from "../utils/getComponent";
import { Router } from "../utils/router";
import { validate } from "../utils/validator";
import { loginForm } from "./login.view";

async function handleFormSubmit(
  data: FormData,
  formParent: HTMLDivElement,
  form: HTMLFormElement,
) {
  const dataObject = Object.fromEntries(data.entries());
  const formDataObject = {
    ...dataObject,
    dateOfBirth: new Date(dataObject.dateOfBirth as string),
  };

  const { success, errors } = validate(registerSchema, formDataObject);
  if (!success && errors) {
    addFormError(form, errors);
  } else if (success) {
    const data = await register(formDataObject as IRegister);
    if (data) {
      Router.hardNavigate("/login", () => loginForm(formParent));
    }
  }
}

export async function registerForm(app: HTMLDivElement) {
  const loginFormContent = await getComponent("auth", "registerForm");
  app.innerHTML = loginFormContent;
  const form = app.querySelector("#form") as HTMLFormElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    await handleFormSubmit(formData, app, form);
  });

  form.querySelectorAll("input").forEach((i) =>
    i.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      form.querySelector(`#${target.name}-error`)!.textContent = "";
    }),
  );

  form
    .querySelector<HTMLAnchorElement>("#sign-in")!
    .addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();

      const href = (e.target as HTMLAnchorElement).getAttribute("href");
      if (href) Router.navigate(href, () => loginForm(app));
    });
}
