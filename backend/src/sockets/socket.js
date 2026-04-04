import jwt from 'jsonwebtoken';
import { Server } from "socket.io";

export const init_sockets = (io) => {
    
    // runs once per handshake/conn.
    io.use((socket, next) => {
        const authHeader = socket.handshake.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
        return next(new Error("No token"));

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user_id = decoded.user_id;
            next();
        } catch (error) {
            return next(new Error("Authentication error"));
        }
    });




    // all below runs per event
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);
    });

    
};