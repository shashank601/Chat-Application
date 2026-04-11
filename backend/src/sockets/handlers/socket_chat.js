import { pool } from "../../config/db.js";
import {
  delete_message_service,
  clear_room_service,
  add_message_service,
} from "../../services/messages_service.js";
import {
  is_user_in_room_service,
  delete_room_service,
} from "../../services/room_services.js";
import { check_user_exists_service } from "../../services/user_service.js";
import {
  leave_room_service,
  add_member_to_group_service,
  promote_to_admin_service,
} from "../../services/user_service.js";

export const socket_chat = (socket, io) => {
  const user_id = socket.user_id;
  socket.join(String(user_id));

  socket.on("room:join", async (payload) => {
    let { room_id } =
      typeof payload === "string" ? { room_id: payload } : payload || {};

    if (typeof room_id === "number") room_id = String(room_id);

    if (!room_id || typeof room_id !== "string") {
      return socket.emit("error", {
        type: "room:join",
        message: "Invalid payload",
      });
    }

    try {
      const row = await is_user_in_room_service(room_id, user_id);

      if (!row) {
        return socket.emit("error", {
          type: "room:join",
          message: "Not allowed in this room",
        });
      }
      // user notification room is joined on connect
      socket.join(room_id);
    } catch {
      return socket.emit("error", {
        type: "room:join",
        message: "Server error",
      });
    }
  });

  socket.on("message:send", async (payload) => {
    let { room_id, msg } = payload || {};

    if (typeof room_id === "number") room_id = String(room_id);

    if (
      !room_id ||
      typeof room_id !== "string" ||
      !msg ||
      msg.trim().length === 0
    ) {
      return socket.emit("error", {
        type: "message:send",
        message: "Invalid message",
      });
    }

    try {
      const allowed = await is_user_in_room_service(room_id, user_id);

      if (!allowed) {
        return socket.emit("error", {
          type: "message:send",
          message: "Not allowed in this room",
        });
      }

      const messageRows = await add_message_service(room_id, user_id, msg);
      const message = messageRows[0];
      
      
      const userRows = await check_user_exists_service(user_id);
      const user = userRows[0];
      io.to(room_id).emit("message:new", { ...message, sender_name: user.username });
    } catch {
      return socket.emit("error", {
        type: "message:send",
        message: "Server error",
      });
    }
  });

  socket.on("message:delete", async (payload) => {
    const { room_id, message_id } = payload || {};

    if (
      !room_id ||
      typeof room_id !== "string" ||
      !message_id ||
      typeof message_id !== "string"
    ) {
      return socket.emit("error", {
        type: "message:delete",
        message: "Invalid payload",
      });
    }

    try {
      const allowed = await is_user_in_room_service(room_id, user_id);

      if (!allowed) {
        return socket.emit("error", {
          type: "message:delete",
          message: "Not allowed in this room",
        });
      }

      const message = await delete_message_service(message_id, user_id);

      if (!message || message.length === 0) {
        return socket.emit("error", {
          type: "message:delete",
          message: "Message not found",
        });
      }

      io.to(room_id).emit("message:deleted", message_id);
    } catch {
      return socket.emit("error", {
        type: "message:delete",
        message: "Server error",
      });
    }
  });

  socket.on("room:clear", async (payload) => {
    const { room_id } = payload || {};

    if (!room_id || typeof room_id !== "string") {
      return socket.emit("error", {
        type: "room:clear",
        message: "Invalid payload",
      });
    }

    try {
      const row = await clear_room_service(room_id, user_id);

      if (!row) {
        return socket.emit("error", {
          type: "room:clear",
          message: "Not allowed in this room",
        });
      }

      io.to(room_id).emit("room:cleared", row);
    } catch {
      return socket.emit("error", {
        type: "room:clear",
        message: "Server error",
      });
    }
  });

  socket.on("room:delete", async (payload) => {
    const { room_id } = payload || {};

    if (!room_id || typeof room_id !== "string") {
      return socket.emit("error", {
        type: "room:delete",
        message: "Invalid payload",
      });
    }

    try {

      await delete_room_service(room_id, user_id);
      const sockets = await io.in(room_id).fetchSockets();
      sockets.forEach(s => s.leave(room_id));
    } catch {
      return socket.emit("error", {
        type: "room:delete",
        message: "Server error",
      });
    }
  });

  socket.on("room:leave", async (payload) => {
    const { room_id } = payload || {};

    if (!room_id || typeof room_id !== "string") {
      return socket.emit("error", {
        type: "room:leave",
        message: "Invalid payload",
      });
    }

    try {
      const result = await leave_room_service(user_id, room_id);

      socket.leave(room_id);

      socket.emit("room:left", result);
      socket.to(room_id).emit("member:left", { room_id, user_id });
    } catch {
      return socket.emit("error", {
        type: "room:leave",
        message: "Server error",
      });
    }
  });

  socket.on("room:add_member", async (payload) => {
    const { room_id, member_id } = payload || {};

    if (!room_id || !member_id) {
      return socket.emit("error", {
        type: "room:add_member",
        message: "Invalid payload",
      });
    }
    try {
      let result_row = await add_member_to_group_service(
        user_id,
        room_id,
        member_id,
      );

      io.to(room_id).emit("member:added", { room_id, member_id });
    } catch {
      return socket.emit("error", {
        type: "room:add_member",
        message: "Server error",
      });
    }
  });

  socket.on("room:promote_member", async (payload) => {
    const { room_id, member_id } = payload || {};

    if (!room_id || !member_id) {
      return socket.emit("error", {
        type: "room:promote_member",
        message: "Invalid payload",
      });
    }
    try {
      const result_row = await promote_to_admin_service(
        user_id,
        room_id,
        member_id,
      );

      io.to(room_id).emit("member:promoted", { room_id, member_id });
    } catch {
      return socket.emit("error", {
        type: "room:promote_member",
        message: "Server error",
      });
    }
  });
};
