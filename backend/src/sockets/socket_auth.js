import jwt from "jsonwebtoken";

export const socket_auth = (io) => {
    io.use((socket, next) => {
        const authHeader = socket.handshake.auth?.token;

        if (!authHeader)
            return next(new Error("No token"));

        const token = authHeader;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user_id = decoded.user_id;
            next();
        } catch (error) {
            return next(new Error("Authentication error"));
        }
    });
}