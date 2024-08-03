import { Errors } from "../types/errors";

export function addFormError(form: HTMLFormElement, errors: Errors[] | null) {
  if (errors)
    errors.forEach((err) => {
      form.querySelector(`#${err.error}-error`)!.textContent = err.message;
    });
}
