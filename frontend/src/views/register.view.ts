import { registerSchema } from "../schemas/auth.schema";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { getComponent } from "../utils/getComponent";
import { requestToServer } from "../utils/requestHandler";
import { Router } from "../utils/router";
import { showToast } from "../utils/showToast";
import { validate } from "../utils/validator";
import { loginForm } from "./login.view";
import { mainViewUi } from "./main.view";

async function handleFormSubmit(data: FormData, formParent: HTMLDivElement) {
  const dataObject = Object.fromEntries(data.entries());

  const formDataObject = {
    ...dataObject,
    dateOfBirth: new Date(dataObject.dateOfBirth as string),
  };

  const { success, errors } = validate(registerSchema, formDataObject);
  if (!success && errors) {
    errors.forEach((err) => {
      document.querySelector(`#${err.error}-error`)!.textContent = err.message;
    });
  } else if (success) {
    await requestToServer(
      "http://localhost:8000/register",
      {
        method: HttpMethod.POST,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(formDataObject),
      },
      (data: any) => {
        showToast(data.message, Toast.SUCCESS);
        localStorage.setItem("accessToken", data.data.accessToken);
        Router.navigateWithData(
          "/@me",
          () => mainViewUi(formParent),
          data.data,
        );
      },
    );
  }
}

export async function registerForm(app: HTMLDivElement) {
  const loginFormContent = await getComponent("auth", "registerForm");
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
    .querySelector<HTMLAnchorElement>("#sign-in")!
    .addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();

      const href = (e.target as HTMLAnchorElement).getAttribute("href");
      if (href) Router.navigate(href, () => loginForm(app));
    });
}
