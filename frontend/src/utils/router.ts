export class Router {
  constructor() {}

  static hardNavigate(data: {}, route: string, callBackFn: Function) {
    history.replaceState(data, "", route);
    return callBackFn();
  }

  static navigateWithData() {}

  static navigate(link: string, callBackFn?: Function) {
    history.pushState({}, "", link);
    return callBackFn && callBackFn();
  }

  static navigateAndFetch() {}
}
