import userService from "../services/userService.js";
import {validationResult} from "express-validator";
import ApiError from "../exceptions/apiErrors.js";

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequestError("Validation error", errors.array()));
            }

            const {email, password, name} = req.body;
            if (!email || !password) {
                return next(ApiError.BadRequestError("Email and password are required"));
            }

            const userData = await userService.register(email, password, name);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                return next(ApiError.BadRequestError("Email and password are required"));
            }

            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return next(ApiError.BadRequestError("Refresh token is missing"));
            }

            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return next(ApiError.UnauthorizedError());
            }
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            //проверки не нужны
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();