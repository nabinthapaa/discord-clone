# Discord Clone README

## Project Description

This project is a clone of the popular chat application Discord. It includes functionalities such as user authentication, server creation, message editing and deletion, and real-time chat capabilities. Additionally, the application supports voice chat using PeerJS.

## Features

- User authentication (login and registration)
- Server creation, editing, and deletion
- Channel creation and management within servers
- Real-time messaging in channels
- Direct messaging between users
- Voice chat using PeerJS
- Cloudinary integration for media storage

## Environment Setup

Create a `backend.env` file in the backend directory of your project with the following content:

```env
# Server Port
PORT=<PORT>

# JWT setup
JWT_SECRET=<JWT_SECRET>
JWT_ACCESS_EXPIRES_IN=<JWT_ACCESS_EXPIRES_IN>
JWT_REFRESH_EXPIRES_IN=<JWT_REFRESH_EXPIRES_IN>

# Database setup
DB_CLIENT=<DB_CLIENT>
DB_HOST=<DB_HOST>
DB_PORT=<DB_PORT>
DB_USER=<DB_USER>
DB_PASSWORD=<DB_PASSWORD>
DB_NAME=<DB_NAME>
POSTGRES_DB=<POSTGRES_DB> #for docker compose file
PASSWORD=<DB_PASSWORD>

# Cloudinary credentials
CLOUDINARY_NAME=<CLOUDINARY_NAME>
CLOUDINARY_API_KEY=<CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<CLOUDINARY_API_SECRET>
CLOUDINARY_API_URL=<CLOUDINARY_API_URL>
```

## Docker Compose Setup

Run the compose.yml file in the root directory using compose using

1. Create a `backend.env` inside project backend directory with the above values
1. Create a `frontend.env` inside project frontend directory

```bash
  docker --env-file backend/backend.env --env-file frontend/frontend.env compose up --build
```

## Run locally

1. Make sure `node` is installed in the machine
1. Install the dependencies using

```bash
  cd backend
  npm install
  cd frontend
  npm install
```

1. Make sure to have a local install of `postgres` for database

## Running the Project

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:<PORT>`.

## API Endpoints

### Auth Routes

- **Login**: `POST /login`
- **Register**: `POST /register`

### Server Routes

- **Create Server**: `POST /servers`
- **Get User Servers**: `GET /servers/users/:userId`
- **Get Server Members**: `GET /servers/:serverId/users`
- **Get Server Info**: `GET /servers/:serverId`
- **Delete Server**: `DELETE /servers/:serverId`
- **Add User to Server**: `POST /servers/:serverId/users/:userId`
- **Remove User from Server**: `DELETE /servers/:serverId/users/:userId`

### Channel Routes

- **Create Channel**: `POST /channels/server/:serverId`
- **Get Channels**: `GET /channels/server/:serverId`
- **Delete Channel**: `DELETE /channels/:channelId`

### Messages Routes

- **Get Channel Messages**: `GET /messages/channel/:channelId`
- **Get Direct Messages**: `GET /messages/direct/:roomId`

## Sockets for Messaging

The application uses WebSockets for real-time messaging.

## PeerJS for Voice Chat

Voice chat functionality is implemented using PeerJS.
