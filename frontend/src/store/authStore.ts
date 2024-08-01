import { createStore } from "zustand";
import { getLocalData } from "../utils/getLocaldata";
import { IloginPayload } from "../interfaces/auth.interface";

interface authStoreState {
  userData: IloginPayload | null;
  isAuthenticated: boolean;
  login(user: IloginPayload): void;
  logout(): void;
}

const userData = getLocalData();

export const authStore = createStore<authStoreState>((set) => ({
  userData: userData ? userData : null,
  isAuthenticated: !!userData,
  login: (user: IloginPayload) =>
    set((state) => ({
      ...state,
      userData: user,
      isAuthenticated: true,
    })),
  logout: () =>
    set((state) => ({
      ...state,
      userData: null,
      isAuthenticated: false,
    })),
}));
