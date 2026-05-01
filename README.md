# Chat Application (REST + Realtime)
<div align="center">
  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  
</div>

## Overview
This is a full-stack chat app that combines:

- JWT authentication
- PostgreSQL persistence (users, rooms, messages)
- REST APIs for fetching data and managing rooms/users
- Socket.IO for real-time messaging and live room updates

### Problem it solves
This app delivers a real chat experience: messages and room updates propagate instantly to connected clients. no pooling or refreshes

---
## Product Walkthrough

### Authentication Screens

<table>
  <tr>
    <td><img width="400" alt="Screenshot 2026-05-02 011400" src="https://github.com/user-attachments/assets/57651f16-9749-4b32-b245-3ee6ac996383" /></td>
    <td><img width="400" alt="Screenshot 2026-05-02 011347" src="https://github.com/user-attachments/assets/17874f85-91f7-4a63-bedf-7dd8323816ba" /></td>
  </tr>
</table> 

---

### User enters chat room, WebSocket connection starts.
<img width="400" alt="Screenshot 2026-05-02 024136" src="https://github.com/user-attachments/assets/4ea2c0e6-2cc9-40e2-900b-f3ec3e411b2d" />

---

### Friend Discovery & Add Flow
<table>
  <tr>
    <td><img width="400" alt="Screenshot 2026-05-02 013811" src="https://github.com/user-attachments/assets/f5cec0e1-cc7b-45ea-8e6d-2c457229dd4f" /></td>
    <td><img width="400" alt="Screenshot 2026-05-02 014023" src="https://github.com/user-attachments/assets/32a487b7-2cfc-4260-b278-ee3882c3a539" /></td>
  </tr>
</table> 




---
### Messages load in real-time with no refresh.
<img width="700"  alt="Screenshot 2026-05-02 015027" src="https://github.com/user-attachments/assets/7e41cfdb-dc6d-45c1-84df-88cb1fe4d2bb" />

---
### Create Group Chat by clicking + and Add Friends 

<table>
  <tr>
    <td><img width="500" alt="Screenshot 2026-05-02 015248" src="https://github.com/user-attachments/assets/64772d54-0897-45ef-8c5a-fea8d93ec08b" /></td>
    <td><img width="500" alt="Screenshot 2026-05-02 015401" src="https://github.com/user-attachments/assets/e400223a-fae1-4932-b26e-1ddd5436b9f2" /></td>
  </tr>
</table>
<br>
<table>
    <td><img width="500" alt="Screenshot 2026-05-02 015331" src="https://github.com/user-attachments/assets/b756c81d-e4ff-4263-8400-8583dffdff70" /></td>
    <td><img width="500" alt="Screenshot 2026-05-02 015519" src="https://github.com/user-attachments/assets/24518d42-506f-4701-9d6b-c5b85006c63e" /></td>
  </tr>
</table> 

---

### Send room-wide message

- admin can add member and delete room
- others can clear all chat

<br>
<img width="800" alt="Screenshot 2026-05-02 020641" src="https://github.com/user-attachments/assets/0866da0f-e4f4-4dc4-86e3-f334ec688b43" />
<br>
<br>
<br>
<img width="1920" height="1080" alt="Screenshot 2026-05-02 020804" src="https://github.com/user-attachments/assets/d15e94a3-2d4f-4c4d-840f-89a48456ddbd" />


---

### Admin can Delete room and notify users instantly 

<img width="1920" height="1080" alt="Screenshot 2026-05-02 020931" src="https://github.com/user-attachments/assets/39e95c19-6201-4bd9-897f-c600b7ee1e5d" />


---

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router 7, TailwindCSS 4, Socket.IO Client 4.8
- **Backend:** Node.js, Express 5, Socket.IO 4.8, JWT, bcryptjs
- **Database:** PostgreSQL with node-pg-migrate

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
CLIENT_URL=/

JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

DATABASE_URL=postgresql://your_db_url_here
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
