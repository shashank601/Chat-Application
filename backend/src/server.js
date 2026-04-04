import express from 'express'
import error_handler from './middlewares/error_handler.js'
import index_routes from './routes/index_routes.js'
import cookie_parser from 'cookie-parser'
import http from 'http';
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io';
import { connect_db } from './config/connect_db.js';
import { init_sockets } from './sockets/socket.js';
import { pool } from './config/db.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookie_parser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));


app.get('/health', (_, res) => {
    res.send('OK');
});
app.use('/api', index_routes);
app.use(error_handler);

const requiredEnv = [
    "PORT",
    "JWT_SECRET",
    "CLIENT_URL",
    "JWT_EXPIRES_IN",
    "PGHOST",
    "PGPORT",
    "PGUSER",
    "PGPASSWORD",
    "PGDATABASE"
];

const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error("Missing env vars:", missing);
    process.exit(1);
}



( async () => {
    try {
        await connect_db();
        const httpServer = http.createServer(app);
    
        const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
            credentials: true
        }
        });
    
        init_sockets(io);
    
        const PORT = process.env.PORT || 3000
    
        httpServer.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
        
        
        const shutdown = async () => {
            console.log("Shutting down...");

            await pool.end();
            io.close();

            httpServer.close(() => {
                console.log("Server closed");
                process.exit(0);
            });

            setTimeout(() => {    // force exit after 5sec
                console.error("Force shutdown");
                process.exit(1);
            }, 5000);
        };

        process.on("SIGINT", shutdown);   // ctrl+c
        process.on("SIGTERM", shutdown);  // production
    
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }

})();

