export interface IServerResponse<T extends Record<string, any>> {
  message: string;
  data: T[];
}
