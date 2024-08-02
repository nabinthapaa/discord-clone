import { notFoundView } from "../views/notFound.view";
import { isValidPath } from "./isValidPath";

export class Router {
  static navigate(route: string, callBackFn?: Function) {
    if (!isValidPath(route)) return Router.navigateNotFound();
    history.pushState({}, "", route);
    return callBackFn && callBackFn();
  }

  static hardNavigate(
    route: string,
    callBackFn: Function,
    data?: Record<string, any>,
  ) {
    if (!isValidPath(route)) return Router.navigateNotFound();
    history.replaceState(data, "", route);
    return callBackFn();
  }

  static navigateWithData(
    route: string,
    callBackFn: Function,
    data?: Record<string, any>,
  ) {
    if (!isValidPath(route)) return Router.navigateNotFound();
    history.pushState(data, "", route);
    return callBackFn();
  }

  private static navigateNotFound() {
    Router.hardNavigate("/not-found", notFoundView);
  }
}
