import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router/index.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import swaggerDocs from './swagger.js';


dotenv.config();
const PORT = process.env.PORT || 4000;
const DB_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DB_HOST = process.env.DB_URL;
const IS_DEV = process.env.IS_DEV;
const DEV_DB = process.env.DEV_DB;
const app = express();

// Добавление middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
}));
swaggerDocs(app);
app.use('/api', router);
app.use(errorMiddleware);

const runServer = async () => {
    try {
        await mongoose.connect(IS_DEV ? DEV_DB : `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/cloHelper?authSource=admin`);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

runServer();