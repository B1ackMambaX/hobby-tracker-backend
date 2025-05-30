import {Schema, model} from "mongoose";

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
})

export default model("User", UserSchema);