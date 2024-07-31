import { ILogin, IloginResponse } from "../interfaces/auth.interface";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { requestToServer } from "../utils/requestHandler";
import { showToast } from "../utils/showToast";

export async function login(data: ILogin) {
  return await requestToServer<IloginResponse>(
    "http://localhost:8000/login",
    {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    },
    (data: IloginResponse) => {
      showToast(data.message, Toast.SUCCESS);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("userData", JSON.stringify(data.data.payload));
      return data;
    },
  );
}
