import { ExtendedError } from "socket.io/dist/namespace";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type SocketNext = (err?: ExtendedError | undefined) => void;
