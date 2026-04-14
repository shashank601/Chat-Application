import express from 'express'
import error_handler from './middlewares/error_handler.js'
import index_routes from './routes/index_routes.js'
import cookieParser from 'cookie-parser'
import http from 'http';
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io';
import { connect_db } from './config/connect_db.js';
import { init_sockets } from './sockets/socket.js';
import { pool } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredEnv = [
  "PORT",
  "JWT_SECRET",
  "CLIENT_URL",
  "JWT_EXPIRES_IN",
  "DATABASE_URL"
];

const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error("Missing env vars:", missing);
  process.exit(1);
}

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  }
});

init_sockets(io);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.get('/health', (_, res) => {
  res.send('OK');
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', index_routes);

const staticPath = path.join(__dirname, '../../client/dist');
app.use(express.static(staticPath));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use((req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.use(error_handler);

(async () => {
  try {
    await connect_db();

    const PORT = process.env.PORT || 5000;

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

      setTimeout(() => {
        console.error("Force shutdown");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();