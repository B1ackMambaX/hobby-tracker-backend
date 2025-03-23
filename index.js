import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router';


dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

// Добавление middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', router);

const runServer = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

runServer();