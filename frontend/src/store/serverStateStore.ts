import { createStore } from "zustand";
import { UUID } from "../types";

interface IServerStateStore {
  activeServerId: UUID | null;
  activeChannelId: UUID | null;
  messageContainer: HTMLDivElement | null;
  channelContainer: HTMLDivElement | null;
  changeActiveServer(id: UUID): void;
  updateChannels(id: UUID): void;
  updateMessageContainer(messageContainer: HTMLDivElement): void;
}

export const serverStateStore = createStore<IServerStateStore>((set) => ({
  activeServerId: null,
  messageContainer: null,
  channelContainer: null,
  activeChannelId: null,
  changeActiveServer: (id: UUID) =>
    set((state) => {
      return {
        ...state,
        activeServerId: id,
      };
    }),
  updateChannels: (id: UUID) =>
    set((state) => {
      return {
        ...state,
        activeChannelId: id,
      };
    }),
  updateMessageContainer: (messageContainer) =>
    set((state) => ({
      ...state,
      messageContainer,
    })),
}));
