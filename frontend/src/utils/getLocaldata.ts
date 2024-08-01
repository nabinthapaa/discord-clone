import { IloginPayload } from "../interfaces/auth.interface";

export function getLocalData(): IloginPayload | null {
  const accessToken = localStorage.getItem("accessToken");
  const userData = JSON.parse(
    localStorage.getItem("userData") || `{ "error": true }`,
  );
  if (!accessToken || userData.error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    return null;
  }
  return userData;
}
