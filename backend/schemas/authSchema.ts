import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    bio: String,
    profilepicture: String,
    followers: [{ type: Types.ObjectId, ref: 'userModel' }]
},
    {
        collection: 'users'
    });


export const userModel = mongoose.model('usermodel', userSchema);