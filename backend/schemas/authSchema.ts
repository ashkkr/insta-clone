import mongoose, { Schema, Types } from "mongoose";

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
    followers: [{ type: Types.ObjectId, ref: 'userModel' }],
    following: [{ type: Types.ObjectId, ref: 'userModel' }]
},
    {
        collection: 'users'
    });


export const userModel = mongoose.model('usermodel', userSchema);

const postschema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    imagepath: {
        type: String,
        required: true,
        unique: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'userModel'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'userModel'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'posts'
    });

export const postModel = mongoose.model('postmodel', postschema)