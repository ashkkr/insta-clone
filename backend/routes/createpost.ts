import express from "express"
import multer from "multer"
import { postModel } from "../schemas/authSchema";
import { PostDataBackendInterface } from "../interfaces/postinterfaces";

const postRouter = express.Router()
const uploadPostImage = multer({
    dest: 'insta-pics/'
})

postRouter.post('/createpost', uploadPostImage.single('postimage'), async (req, res, next) => {
    try {
        const { userId, caption, createdAt } = JSON.parse(req.body.postdata);
        console.log(req.file)
        if (req.file) {
            const newpostobject: PostDataBackendInterface = {
                userId: userId,
                caption: caption,
                createdAt: createdAt,
                imagePath: req.file?.filename,
                likes: [],
                comments: []
            }

            const newpost = new postModel(newpostobject)
            await newpost.save()

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

