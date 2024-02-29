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
    followers: {
        type: [Types.ObjectId],
        ref: 'userModel',
        validate: {
            validator: function (array: Types.ObjectId[]) {
                const setSize = array.map(val => val.toString())
                return array.length === new Set(setSize).size
            },
            message: 'User is already in array'
        }
    },
    following: {
        type: [Types.ObjectId],
        ref: 'userModel',
        validate: {
            validator: function (array: Types.ObjectId[]) {
                const setSize = array.map(val => val.toString())
                return array.length === new Set(setSize).size
            },
            message: 'User is already in array'
        }
    }
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
    likes: {
        type: [Types.ObjectId],
        ref: 'userModel',
        validate: {
            validator: function (array: Types.ObjectId[]) {
                const setSize = array.map(val => val.toString())
                return array.length === new Set(setSize).size
            },
            message: 'User is already in array'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'posts'
    });



export const postModel = mongoose.model('postmodel', postschema)

const commentSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        require: true,
        ref: 'userModel'
    },
    postId: {
        type: Types.ObjectId,
        require: true,
        ref: 'postModel'
    },
    text: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    commentlikes: {
        type: [Types.ObjectId],
        ref: 'userModel',
        validate: {
            validator: function (array: Types.ObjectId[]) {
                const setSize = array.map(val => val.toString())
                return array.length === new Set(setSize).size
            },
            message: 'User is already in array'
        }
    }
},
    { collection: 'comments' })

export const commentModel = mongoose.model('commentmodel', commentSchema)