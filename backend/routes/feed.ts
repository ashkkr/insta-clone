import express from "express"
import { commentModel, postModel, userModel } from "../schemas/authSchema";
import { FeedPostDetails } from "../interfaces/postinterfaces";
const feedRouter = express.Router()

// has to be reviewed
feedRouter.get('/getfeed', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        const findUser = await userModel.findOne({ _id: userId });

        if (findUser) {
            const listOfFollowing = findUser?.following.map(val => {
                return val.toString()
            })

            const topFivePosts = await postModel.find({
                userId: { $in: listOfFollowing }
            }).limit(5)

            if (topFivePosts) {
                const feedPosts: FeedPostDetails[] = []

                for (var i = 0; i < topFivePosts.length; i++) {
                    const userDet = await userModel.findOne({ _id: topFivePosts[i].userId })
                    const numOfComments = (await commentModel.find({ postId: topFivePosts[i]._id })).length

                    const singleFeed: FeedPostDetails = {
                        username: userDet?.username ?? "",
                        commentCount: numOfComments,
                        isUserFollowed: true, // check
                        postId: topFivePosts[i]._id.toString(),
                        caption: topFivePosts[i].caption,
                        userId: topFivePosts[i].userId.toString(),
                        createdAt: topFivePosts[i].createdAt.toString(),
                        imagePath: topFivePosts[i].imagepath,
                        likeCount: topFivePosts[i].likes.length,
                        likes: [],
                        comments: [],
                        imageDataUrl: "",
                        isPostLiked: topFivePosts[i].likes.map(i => i.toString()).some(val => val === userId)
                    }
                    feedPosts.push(singleFeed)
                }

                return res.json(feedPosts)
            }
            else {
                return res.sendStatus(404)
            }
        }
        else {
            return res.status(404).json({
                message: "User does not exist"
            })
        }
    }
    catch (e) {
        next(e)
    }
})


export default feedRouter;