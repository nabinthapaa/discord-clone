import { getComponent } from "../utils/getComponent";

export async function notFoundView() {
  console.log("Not found page");

  const app = document.querySelector(`#app`)!;
  const response = await getComponent("errors", "notFound");
  app.innerHTML = response;
}
