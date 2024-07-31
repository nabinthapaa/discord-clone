import { IFetchHtml } from "../interfaces/fetchHtml";
import { getComponent } from "./getComponent";

export async function getHtml(components: IFetchHtml[]) {
  let html = "";

  for (let i = 0; i < components.length; i++) {
    html += await getComponent(components[i].folder, components[i].filename);
  }
  return html;
}
