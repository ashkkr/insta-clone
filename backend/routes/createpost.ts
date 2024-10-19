import express from "express"
import multer from "multer"
import { postModel, userModel } from "../schemas/authSchema";
import { PostDataBackendInterface } from "../interfaces/postinterfaces";
import { Types } from "mongoose";
import { postNotifModel } from "../schemas/notifSchema";

const postRouter = express.Router()
const uploadPostImage = multer({
    dest: 'insta-pics/'
})

postRouter.post('/createpost', uploadPostImage.single('postimage'), async (req, res, next) => {
    try {
        const { userId, caption, createdAt } = JSON.parse(req.body.postdata);
        console.log(req.file)
        if (req.file) {
            const newpostobject = {
                userId: userId,
                caption: caption,
                createdAt: createdAt,
                imagepath: req.file?.filename,
                likes: [],
                comments: []
            }

            const newpost = new postModel(newpostobject)
            await newpost.save()

            postNotification(userId, createdAt, newpost._id);

            return res.json({
                message: "Post created successfully"
            })
        }

        return res.status(404).json({
            message: "Image not sent"
        })
    }
    catch (err) {
        next(err)
    }
});

export default postRouter;

async function postNotification(userId: string, createdAt: string, postId: Types.ObjectId) {
    const userdetails = await userModel.findOne({
        _id: userId
    })

    userdetails?.followers.forEach(async (val) => {
        if (val._id == undefined) return;

        const notifDetails: NotificationInterface = {
            userId: val.toString(),
            actionUserId: userId,
            actionUsername: userdetails.username,
            action: 'NEWPOST',
            actionTime: createdAt,
            postId: postId.toString(),
            postLink: ""
        }
        const newNotif = new postNotifModel(notifDetails)
        await newNotif.save()
    })
}

