import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { IServerResponse } from "../interfaces/response.interface";
import { showToast } from "./showToast";

export async function requestToServer<T extends Record<string, any>>(
  url: string,
  {
    method,
    headers,
    data,
  }: {
    method?: HttpMethod;
    headers?: HeadersInit;
    data?: BodyInit;
  },
  callBack?: (data: IServerResponse<T>) => T[],
): Promise<T[] | undefined> {
  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        ...headers,
      },
      body: method !== HttpMethod.GET ? data : null,
    });

    const responseData: IServerResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(`${responseData.message}`);
    }
    if (callBack) {
      return callBack(responseData);
    }
    return responseData.data;
  } catch (e) {
    if (e instanceof Error) {
      showToast(e.message, Toast.ERROR);
    }
  }
}
