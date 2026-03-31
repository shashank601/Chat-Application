import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4040;
export const CLIENT_URL = process.env.CLIENT_URL || '*';
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"; // minutes
