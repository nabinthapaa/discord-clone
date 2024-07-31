import { notFoundView } from "../views/notFound.view";
import { Router } from "./router";

export async function getComponent(
  folder: string | null,
  name: string | null,
): Promise<string> {
  const filename = folder + "/" + name + ".component.html";
  const data = await fetch(`/components/${filename}`);
  const innerHtml = await data.text();
  if (!innerHtml) return Router.hardNavigate("/notFound", notFoundView);
  return innerHtml;
}
