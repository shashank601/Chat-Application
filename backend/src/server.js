import express from 'express'
import error_handler from './middlewares/error_handler.js'
import index_routes from './routes/index_routes.js'
import cookie_parser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookie_parser());
app.use('/api', index_routes);
app.use(error_handler);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
