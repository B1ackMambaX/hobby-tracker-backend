import {Router} from "express";
import UserController from "../controllers/userController.js";
import {body} from "express-validator";
import auth from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Пользователь успешно зарегистрирован.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Ошибка валидации данных запроса.
 */
router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    UserController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Авторизация пользователя.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Пользователь успешно авторизован.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Неверные учетные данные.
 */
router.post('/login', UserController.login);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Выход пользователя из системы.
 *     tags: [User]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Пользователь успешно вышел из системы.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *       400:
 *         description: Ошибка при выходе.
 */
router.post('/logout', UserController.logout);
/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Обновление access токена.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Токен успешно обновлен.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Неверный токен или пользователь не авторизован.
 */
router.get('/refresh', UserController.refresh);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получение списка всех пользователей.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список пользователей.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Пользователь не авторизован.
 */
router.get('/users', authMiddleware, UserController.getUsers);

export default router;