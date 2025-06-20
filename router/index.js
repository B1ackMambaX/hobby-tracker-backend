import { Router } from "express";
import userRouter from "./userRouter.js";
import tripRouter from "./tripRouter.js";
import taskRouter from "./taskRouter.js";
import spendRouter from "./spendRouter.js";
import tripTemplateRouter from "./tripTemplateRouter.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import notificationRouter from './notificationRouter.js';

const router = new Router();

// Основные маршруты
router.use('/auth', userRouter); // Все auth-роуты (/register, /login и т.д.)
router.use('/trips', authMiddleware, tripRouter); // Маршруты для путешествий
router.use('/tasks', authMiddleware, taskRouter); // Маршруты для задач
router.use('/spends', authMiddleware, spendRouter); // Маршруты для трат
router.use('/trip-templates', authMiddleware, tripTemplateRouter);
router.use('/notifications', notificationRouter);

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

export default router;