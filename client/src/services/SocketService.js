export const createSocketAPI = (socket) => {

    if (!socket) {
        throw new Error("Socket is required");
    }
    
  return {
    sendMessage: (data) => {
      socket.emit("send_message", data);
    },

    onMessage: (handler) => {
      socket.on("receive_message", handler);
    },

    offMessage: (handler) => {
      socket.off("receive_message", handler);
    }
  };
};