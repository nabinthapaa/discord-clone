import { createStore } from "zustand";
import { UUID } from "../types";

interface IServerStateStore {
  activeServerId: UUID | null;
  activeChannelId: UUID | null;
  messageContainer: HTMLDivElement | null;
  channelContainer: HTMLDivElement | null;
  channelName: string | null;
  changeActiveServer(id: UUID): void;
  updateChannels(id: UUID, channelName: string): void;
  updateMessageContainer(messageContainer: HTMLDivElement): void;
}

export const serverStateStore = createStore<IServerStateStore>((set) => ({
  activeServerId: null,
  messageContainer: null,
  channelContainer: null,
  activeChannelId: null,
  channelName: null,
  changeActiveServer: (id: UUID) =>
    set((state) => {
      return {
        ...state,
        activeServerId: id,
      };
    }),
  updateChannels: (id, channelName) =>
    set((state) => {
      return {
        ...state,
        activeChannelId: id,
        channelName: channelName,
      };
    }),
  updateMessageContainer: (messageContainer) =>
    set((state) => ({
      ...state,
      messageContainer,
    })),
}));
