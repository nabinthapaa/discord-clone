export type ValidationErrors = {
  success: boolean;
  errors: Errors[] | null;
};

export interface Errors {
  error: string | number;
  message: string;
}
