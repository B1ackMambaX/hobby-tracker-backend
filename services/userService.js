import UserModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";

class UserService {
    async register(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate !== null) {
            console.log(candidate);
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({email, password: hashedPassword});

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }
}

export default new UserService();