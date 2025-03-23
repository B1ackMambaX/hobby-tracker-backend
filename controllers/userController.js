import userService from "../services/userService.js";

class UserController {
    async register(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.register(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', '456']);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();