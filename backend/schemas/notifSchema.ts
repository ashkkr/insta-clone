import mongoose, { Types } from "mongoose";

const postedNotifSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    actionUserId: {
        type: Types.ObjectId,
        required: true
    },
    actionUsername: {
        type: String,
        required: true
    },
    postLink: {
        type: String
    },
    postId: {
        type: Types.ObjectId
    },
    commentId: {
        type: Types.ObjectId
    },
    actionTime: {
        type: String,
        required: true
    }
},
    {
        collection: 'notification_on_post'
    })

export const postNotifModel = mongoose.model('postnotif', postedNotifSchema)