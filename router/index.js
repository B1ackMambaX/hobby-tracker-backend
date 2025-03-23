import {Router} from "express";
import UserController from "../controllers/userController.js";
import {body} from "express-validator";
import auth from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);

export default router;