import { CookieOptions } from "express";

export const getCookieOptions = (
  additionalOptions: Partial<CookieOptions>,
): CookieOptions => {
  return {
    httpOnly: true,
    sameSite: "none",
    ...additionalOptions,
  };
};
