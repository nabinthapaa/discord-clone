import { ILogin, IloginData, IRegister } from "../interfaces/auth.interface";
import { HttpMethod } from "../enums/method";
import { Toast } from "../enums/toast";
import { requestToServer } from "../utils/requestHandler";
import { showToast } from "../utils/showToast";
import { LOGIN_URL, REGISTER_URL } from "../constants/backendRoutes/routes";

export async function login(data: ILogin) {
  return await requestToServer<IloginData>(
    LOGIN_URL,
    {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    },
    (data) => {
      showToast(data.message, Toast.SUCCESS);
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("userData", JSON.stringify(data.data.payload));
      return data;
    },
  );
}

export async function register(registrationData: IRegister) {
  return await requestToServer(
    REGISTER_URL,
    {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(registrationData),
    },
    (data) => {
      showToast(data.message, Toast.SUCCESS);
      return data;
    },
  );
}
