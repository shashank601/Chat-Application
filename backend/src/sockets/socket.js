import { Server } from "socket.io";
import { socket_auth } from "./socket_auth.js";
import { socket_chat } from "./handlers/socket_chat.js";


export const init_sockets = (io) => {
    
    // runs once per handshake/conn.
    socket_auth(io);

    // all below runs per event
    io.on("connection", (socket) => {
        




        socket.disconnect(true);
    });


    
};