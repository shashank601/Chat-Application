import jwt from "jsonwebtoken";

export const socket_auth = (io) => {
    io.use((socket, next) => {
        const authHeader = socket.handshake.auth?.token;

        if (!authHeader)
            return next(new Error("Authentication token is required"));

        const token = authHeader;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user_id = decoded.user_id;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError')
                return next(new Error("Token expired"));
            return next(new Error("Invalid authentication token"));
        }
    });
}