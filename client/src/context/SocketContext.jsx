import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/Token.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // create but not autoconnet
    socketRef.current = io("http://localhost:5000", { autoConnect: false });

    const s = socketRef.current;

    // Connect with current token
    s.auth = { token: getToken() };
    s.connect();

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    return () => {
      s.disconnect();
    };
  }, []);

  // Emit functions 
  const joinRoom = (room_id) => socketRef.current?.emit("join_room", room_id);
  
  const sendMessage = (room_id, msg) =>
    socketRef.current?.emit("send_message", { room_id, msg });

  const deleteMessage = (room_id, message_id) =>
    socketRef.current?.emit("delete_message", { room_id, message_id });
  
  const clearRoom = (room_id) =>
    socketRef.current?.emit("clear_room", room_id);
  
  const leaveRoom = (room_id) =>
    socketRef.current?.emit("leave_room", room_id);

  // Listener registration 
  const onReceiveMessage = (cb) =>
    socketRef.current?.on("receive_message", cb);
  
  const onMessageDeleted = (cb) =>
    socketRef.current?.on("message_deleted", cb);
  
  const onRoomCleared = (cb) =>
    socketRef.current?.on("room_cleared", cb);
  
  const onRoomLeft = (cb) => socketRef.current?.on("room_left", cb);
  
  const onError = (cb) => socketRef.current?.on("error", cb);

  const value = {
    socket: socketRef.current,
    connected,
    joinRoom,
    sendMessage,
    deleteMessage,
    clearRoom,
    leaveRoom,
    onReceiveMessage,
    onMessageDeleted,
    onRoomCleared,
    onRoomLeft,
    onError,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};


export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return socket;
};