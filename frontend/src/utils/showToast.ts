import { Toast } from "../enums/toast";
import { getComponent } from "./getComponent";

export async function showToast(message: string, toast: Toast) {
  const toastFile = getToastFileName(toast);
  const toastData = await getComponent("toasts", toastFile);
  if (!toastData) throw new Error(``);
  const div = document.createElement("div");
  div.classList.add("absolute");
  div.innerHTML = toastData;
  div.querySelector("#message")!.textContent = message;
  document.body.prepend(div);

  setTimeout(() => {
    div.style.display = "none";
    document.body.removeChild(div);
  }, 2000);
}

function getToastFileName(toastType: Toast): string | null {
  switch (toastType) {
    case Toast.ERROR:
      return "toastError";
    case Toast.SUCCESS:
      return "toastSuccess";
    case Toast.INFO:
      return "toastSuccess";
    default:
      return null;
  }
}
