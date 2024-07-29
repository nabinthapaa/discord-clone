import { HttpMethod } from "../types/enums/method";
import { Toast } from "../types/enums/toast";
import { showToast } from "./showToast";

export async function requestToServer(
  url: string,
  {
    method,
    headers,
    data,
  }: {
    method?: HttpMethod;
    headers?: Headers;
    data?: BodyInit;
  },
) {
  try {
    throw new Error("Server side error");
    const response = await fetch(url, {
      method,
      headers,
      body: method === HttpMethod.GET ? data : null,
    });

    return await response.json();
  } catch (e) {
    if (e instanceof Error) {
      showToast(e.message, Toast.ERROR);
    }
  }
}
