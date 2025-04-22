import { Router } from "express";
import userRouter from "./userRouter.js";
import tripRouter from "./tripRouter.js";
import taskRouter from "./taskRouter.js";
import spendRouter from "./spendRouter.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

// Основные маршруты
router.use('/auth', userRouter); // Все auth-роуты (/register, /login и т.д.)
router.use('/trips', authMiddleware, tripRouter); // Маршруты для путешествий
router.use('/tasks', authMiddleware, taskRouter); // Маршруты для задач
router.use('/spends', authMiddleware, spendRouter); // Маршруты для трат

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default router;