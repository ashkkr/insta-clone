import express from "express"
import { commentLikeInput, newCommentCheck, postLikeInput } from "../zodobjects/post"
import { commentModel, postModel } from "../schemas/authSchema"
import mongoose from "mongoose"

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

        const newComment = new commentModel({
            userId: userId,
            postId: commentDetailsInput.data.postId,
            createdAt: commentDetailsInput.data.createdTime,
            text: commentDetailsInput.data.commentText,
            likes: [] as string[],
        })

        await newComment.save()

        return res.sendStatus(200)
    }
    catch (e) {
        next(e)
    }
})

postInteractionRouter.post('/likecomment', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        const postcommentid = commentLikeInput.safeParse(req.body)

        if (!postcommentid.success) {
            return res.status(400).json({
                message: "Unexpected request"
            })
        }

        const { postId, commentId } = postcommentid.data

        const updatedDoc = await commentModel.findOne({
            _id: commentId,
            postId: postId
        })

        updatedDoc?.commentlikes.push(new mongoose.Types.ObjectId(userId))
        await updatedDoc?.save()

        if (updatedDoc) {
            return res.sendStatus(200)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (e) {
        next(e)
    }
})

postInteractionRouter.post('/unlikecomment', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        const postcommentid = commentLikeInput.safeParse(req.body)

        if (!postcommentid.success) {
            return res.status(400).json({
                message: "Unexpected request"
            })
        }

        const { postId, commentId } = postcommentid.data

        const updatedDoc = await commentModel.findOneAndUpdate(
            {
                _id: commentId,
                postId: postId
            },
            {
                $pull: {
                    commentlikes: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                new: true
            }
        )
        if (updatedDoc) {
            return res.sendStatus(200)
        }
        else {
            return res.sendStatus(404)
        }
    }
    catch (e) {
        next(e)
    }
})

postInteractionRouter.post('/likepost', async (req, res, next) => {
    try {
        const postLike = postLikeInput.safeParse(req.body)
        const userId = req.get('userId')

        if (!postLike.success) {
            return res.status(400).json({
                message: "Unexpected request"
            })
        }

        const post = await postModel.findOne({
            _id: postLike.data.postId
        })

        post?.likes.push(new mongoose.Types.ObjectId(userId))
        await post?.save()

        if (post) {
            res.sendStatus(200)
        }
        else {
            res.sendStatus(404)
        }

    }
    catch (e) {
        next(e)
    }
})


postInteractionRouter.post('/unlikepost', async (req, res, next) => {
    const postLike = postLikeInput.safeParse(req.body)
    const userId = req.get('userId')

    if (!postLike.success) {
        return res.status(400).json({
            message: "Unexpected request"
        })
    }

    const updatedDoc = await postModel.findOneAndUpdate({
        _id: postLike.data.postId
    }, {
        $pull: {
            likes: new mongoose.Types.ObjectId(userId)
        }
    },
        {
            new: true
        })

    if (updatedDoc) {
        return res.sendStatus(200)
    }
    else {
        return res.sendStatus(404)
    }

})

export default postInteractionRouter;