import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getToken } from "../utils/Token.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    
    socketRef.current = io("http://localhost:3000", {
      auth: {
        token: getToken()
      }
    });

    // for degugging, not mandatory
    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected");
    });


    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};



export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return socket;
};