import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/Token.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  if (!socketRef.current) {
    // create an instance, do not autoconn
    socketRef.current = io("http://localhost:5000", { autoConnect: false });
  }

  useEffect(() => {
    const s = socketRef.current;

    // now connect
    s.auth = { token: getToken() };
    if (!s.connected) s.connect();

    // for status
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.disconnect();
    };
  }, []);

  // Emit functions
  const joinRoom = (room_id) => socketRef.current?.emit("room:join", room_id);

  const sendMessage = (room_id, msg) =>
    socketRef.current?.emit("message:send", { room_id, msg });

  const deleteMessage = (room_id, message_id) =>
    socketRef.current?.emit("message:delete", { room_id, message_id });

  const clearRoom = (room_id) =>
    socketRef.current?.emit("room:clear", { room_id });

  const leaveRoom = (room_id) =>
    socketRef.current?.emit("room:leave", { room_id });

  // listeners regisatration
  const onReceiveMessage = (cb) => {
    socketRef.current?.on("message:new", cb);
    return () => socketRef.current?.off("message:new", cb);
  };

  const onMessageDeleted = (cb) => {
    socketRef.current?.on("message:deleted", cb);
    return () => socketRef.current?.off("message:deleted", cb);
  };

  const onRoomCleared = (cb) => {
    socketRef.current?.on("room:cleared", cb);
    return () => socketRef.current?.off("room:cleared", cb);
  };

  
  // get a room id
  const onRoomCreated = (cb) => {
    socketRef.current?.on("room:created", cb);
    return () => socketRef.current?.off("room:created", cb);
  };

  const onRoomDeleted = (cb) => {
    socketRef.current?.on("room:deleted", cb);
    return () => socketRef.current?.off("room:deleted", cb);
  };

  const onMemberAdded = (cb) => {
    socketRef.current?.on("member:added", cb);
    return () => socketRef.current?.off("member:added", cb);
  };

  const onMemberPromoted = (cb) => {
    socketRef.current?.on("member:promoted", cb);
    return () => socketRef.current?.off("member:promoted", cb);
  };

  const onMemberLeft = (cb) => {
    socketRef.current?.on("member:left", cb);
    return () => socketRef.current?.off("member:left", cb);
  };

  const value = {
    socket: socketRef,
    connected,
    joinRoom,
    sendMessage,
    deleteMessage,
    clearRoom,
    leaveRoom,

    onReceiveMessage,
    onMessageDeleted,
    onRoomCleared,
    
    onRoomCreated,
    onRoomDeleted,
    onMemberAdded,
    onMemberPromoted,
    onMemberLeft,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error("useSocket must be used inside SocketProvider");
  return socket;
};
