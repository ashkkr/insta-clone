import express from "express"
import { newCommentCheck } from "../zodobjects/post"
import { postModel } from "../schemas/authSchema"

const postInteractionRouter = express.Router()

postInteractionRouter.post('/addcomment', async (req, res, next) => {
    try {
        const commentDetailsInput = newCommentCheck.safeParse(req.body)
        const userId = req.get('userId')

        if (!commentDetailsInput.success) {
            return res.status(400).json({
                message: "Unexpected request"
            })
        }
        const commentDetails = {
            user: userId,
            text: commentDetailsInput.data.commentText,
            createdAt: commentDetailsInput.data.createdTime
        }

        const updatedDoc = await postModel.findByIdAndUpdate(commentDetailsInput.data.postId,
            {
                $push: {
                    comments: commentDetails
                }
            },
            { new: true });

        if (updatedDoc) {
            return res.sendStatus(200)
        }
        else {
            return res.sendStatus(500)
        }
    }
    catch (e) {
        next(e)
    }
})

export default postInteractionRouter;