import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiErrors.js";
import tokenModel from "../models/tokenModel.js";
import userModel from "../models/userModel.js";

class UserService {
    async register(email, password, name) {
        const candidate = await UserModel.findOne({email});
        if (candidate !== null) {
            throw ApiError.BadRequestError("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({email, password: hashedPassword, name});

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequestError("User does not exist");
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequestError("Incorrect password");
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async getAllUsers() {
        const users = await userModel.find();
        return users;
    }
}

export default new UserService();