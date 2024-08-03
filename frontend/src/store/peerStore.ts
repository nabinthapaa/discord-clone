import { createStore } from "zustand";
import { getLocalData } from "../utils/getLocaldata";
import { PeerService } from "../mediaConnections/peer";

interface IPeerStore {
  peer: PeerService;
}

const userData = getLocalData();

export const peerStore = createStore<IPeerStore>((set) => ({
  peer: new PeerService(),
}));
