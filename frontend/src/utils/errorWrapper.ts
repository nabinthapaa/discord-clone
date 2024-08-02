import { Toast } from "../enums/toast";
import { showToast } from "./showToast";

export function errorWrapper(callback: Function) {
  return () => {
    try {
      return callback();
    } catch (e) {
      if (e instanceof Error) {
        showToast(e.message, Toast.ERROR);
      }
    }
  };
}
