export const createSocketAPI = (socket) => {

    if (!socket) {
        throw new Error("Socket is required");
    }
    
  return {
    onMessage: (handler) => {
      socket.on("receive_message", handler);
    },

    sendMessage: (data) => {
      socket.emit("send_message", data);
    },


    offMessage: (handler) => {
      socket.off("receive_message", handler);
    }
  };
};