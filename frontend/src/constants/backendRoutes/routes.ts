import { UUID } from "../../types";

export const BACKEND_URL = "http://192.168.1.129:8000";

// Auth routes
export const AUTH_BASE_URL = `${BACKEND_URL}/`;
export const LOGIN_URL = `${AUTH_BASE_URL}login`;
export const REGISTER_URL = `${AUTH_BASE_URL}register`;

// Server routes
export const SERVER_BASE_URL = `${BACKEND_URL}/servers`;
export const CREATE_SERVER_URL = `${SERVER_BASE_URL}`;
export const GET_USER_SERVERS_URL = (userId: UUID) =>
  `${SERVER_BASE_URL}/users/${userId}`;
export const GET_SERVER_MEMBERS_URL = (serverId: UUID) =>
  `${SERVER_BASE_URL}/${serverId}/users`;
export const GET_SERVER_INFO_URL = (serverId: UUID) =>
  `${SERVER_BASE_URL}/${serverId}`;
export const DELETE_SERVER_URL = (serverId: UUID) =>
  `${SERVER_BASE_URL}/${serverId}`;
export const ADD_USER_TO_SERVER_URL = (serverId: UUID, userId: UUID) =>
  `${SERVER_BASE_URL}/${serverId}/users/${userId}`;
export const REMOVE_USER_FROM_SERVER_URL = (serverId: UUID, userId: UUID) =>
  `${SERVER_BASE_URL}/${serverId}/users/${userId}`;

// Channel routes
export const CHANNEL_BASE_URL = `${BACKEND_URL}/channels`;
export const CREATE_CHANNEL_URL = (serverId: UUID) =>
  `${CHANNEL_BASE_URL}/server/${serverId}`;
export const GET_CHANNELS_URL = (serverId: UUID) =>
  `${CHANNEL_BASE_URL}/server/${serverId}`;
export const DELETE_CHANNEL_URL = (channelId: UUID) =>
  `${CHANNEL_BASE_URL}/${channelId}`;

//Messages routes
export const MESSAGE_BASE_URL = `${BACKEND_URL}/messages`;
export const CHANNEL_MESSAGE_URL = (channelId: UUID) =>
  `${BACKEND_URL}/messages/channel/${channelId}`;
export const DIRECT_MESSAGE_URL = (roomId: UUID) =>
  `${BACKEND_URL}/messages/direct/${roomId}`;
