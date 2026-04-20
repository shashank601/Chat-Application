# Chat Application (REST + Realtime)

## Overview
This is a full-stack chat app that combines:

- JWT authentication
- PostgreSQL persistence (users, rooms, messages)
- REST APIs for fetching data and managing rooms/users
- Socket.IO for real-time messaging and live room updates

### Problem it solves
This app delivers a real chat experience: messages and room updates propagate instantly to connected clients. no pooling or refreshes

---

## Tech Stack
- Frontend: React (Vite), React Router, Axios, TailwindCSS, Socket.IO Client
- Backend: Node.js, Express, Socket.IO, JWT, bcrypt
- Database: PostgreSQL

---

## Clone & Launch (Local)

### 1) Clone
```bash
git clone <REPO_URL>
cd "Chat Application"
```

### 2) Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173

JWT_SECRET=replace_me
JWT_EXPIRES_IN=7d

DATABASE_URL=replace_me
```

Run migrations:
```bash
npm run migrate
```

Start backend:
```bash
npm run dev
```

Backend runs on:
- REST: `http://localhost:5000/api`
- Socket.IO: `http://localhost:5000`

### 3) Frontend setup
```bash
cd ..\client
npm install
npm run dev
```

Frontend runs on:
- `http://localhost:5173`

---

## Architecture (Short)
- The **React client** uses **Axios** for REST calls and **Socket.IO** for real-time events.
- The **Express backend** exposes REST routes under `/api` and runs Socket.IO on the same server.
- JWT is used for both:
  - REST: `Authorization: Bearer <token>`
  - Socket: `socket.handshake.auth.token`
- The backend follows a simple layered structure:
  - `routes -> controllers -> services -> db (SQL queries)`

---

## REST API (Backend)
Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Returns: `{ "token": "..." }`

- `POST /auth/login`
  - Body: `{ "email": string, "password": string }`
  - Returns: `{ "token": "..." }`

- `GET /auth/verify`
  - Auth: Required
  - Returns: `{ "id": number }`

### Rooms
- `GET /rooms/chats`
  - Auth: Required
  - Returns: list of rooms (includes `room_id`, `display_name`, `type`, `role`, and latest message preview fields)

- `POST /rooms`
  - Auth: Required
  - Creates direct chat (when `receiver_id` provided) OR group chat (when `group_name` provided)
  - Body:
    - Direct: `{ "receiver_id": number, "group_name": null }`
    - Group: `{ "receiver_id": null, "group_name": string }`

- `DELETE /rooms/:room_id`
  - Auth: Required
  - Notes:
    - Direct rooms can be deleted by members
    - Group rooms require admin role

- `GET /rooms/:room_id/members`
  - Auth: Required
  - Returns: members list with roles

### Messages
- `GET /messages/:room_id`
  - Auth: Required (must be member)
  - Returns: message history (non-deleted)

- `POST /messages/:room_id`
  - Auth: Required (must be member)
  - Body: `{ "content": string }`

- `DELETE /messages/:room_id`
  - Auth: Required (must be member)
  - Clears messages in the room

- `DELETE /messages/:room_id/:message_id`
  - Auth: Required (must be sender)
  - Soft-deletes message (`is_deleted = true`)

### Users / Group Management
- `GET /users/search?q=<query>`
  - Auth: Required
  - Returns: users matching username (excludes self)

- `POST /users/:room_id/:member_id`
  - Auth: Required
  - Adds member to a group (admin only)

- `POST /users/:room_id/leave`
  - Auth: Required
  - Leaves a group (blocked if you are the last admin)

- `POST /users/:room_id/promote/:member_id`
  - Auth: Required
  - Promotes member to admin (admin only)

---

## Realtime (Socket.IO)
Socket URL (dev): `http://localhost:5000`

### Connect authentication
The client connects with:
- `socket.handshake.auth.token = <JWT>`

### Client emits (events you send)
- `room:join`
  - Payload: `room_id` (string or `{ room_id }`)

- `message:send`
  - Payload: `{ room_id, msg }`

- `message:delete`
  - Payload: `{ room_id, message_id }`

- `room:clear`
  - Payload: `{ room_id }`

- `room:delete`
  - Payload: `{ room_id }`

- `room:leave`
  - Payload: `{ room_id }`

- `room:add_member`
  - Payload: `{ room_id, member_id }`

- `room:promote_member`
  - Payload: `{ room_id, member_id }`

### Server emits (events you listen to)
- `message:new`
  - Payload: message object (includes `sender_name`)

- `message:deleted`
  - Payload: `{ messageId, roomId }`

- `room:cleared`
  - Payload: `{ room_id }`

- `room:created`
  - Payload: `{ room_id }` (room created notification)

- `room:deleted`
  - Payload: `{ room_id }`

- `member:added`
  - Payload: `{ room_id, member_id, role, username }`

- `member:promoted`
  - Payload: `{ room_id, member_id, role }`

- `member:left`
  - Payload: `{ room_id, user_id }`

### Important note (keep realtime separate)
The app’s **core realtime events** are the `message:*`, `room:*`, and `member:*` events listed above.

There is also a **legacy/unused** client wrapper at `client/src/services/SocketService.js` that references `send_message` / `receive_message`. Those are not used by the current app flow (the app uses `SocketContext`) and should not be confused with the core events.

---

## Screenshots / Demo
Add your screenshots here:

![Login](./docs/screenshots/login.png)
![Sidebar + Chats](./docs/screenshots/sidebar.png)
![Chat Room](./docs/screenshots/chat-room.png)
![Group Members](./docs/screenshots/group-members.png)

Live Demo: `<ADD_LINK>`

Demo Video: `<ADD_LINK>`
