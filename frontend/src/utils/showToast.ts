import { Toast } from "../types/enums/toast";
import { getComponent } from "./getComponent";

export async function showToast(message: string, toast: Toast) {
  const toastData = await getComponent("toasts", getToastFileName(toast));
  if (!toastData) throw new Error(``);
  const div = document.createElement("div");
  div.classList.add("absolute");
  div.innerHTML = toastData;
  div.querySelector("#message")!.textContent = message;
  document.body.prepend(div);

  setTimeout(() => {
    div.style.display = "none";
  }, 2000);
}

function getToastFileName(toastType: Toast): string | null {
  switch (toastType) {
    case Toast.ERROR:
      return "toastError";
    case Toast.SUCCESS:
      return "toastSuccess";
    default:
      return null;
  }
}
