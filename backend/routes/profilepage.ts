import express from "express"
import { commentModel, postModel, userModel } from "../schemas/authSchema";
import path from "path"
import { FullPostDetails, MetaPostDataInterface, commentInterface } from "../interfaces/postinterfaces";
import { postImageCheck, postImageType } from "../zodobjects/profile";
import { ObjectId } from "mongoose";
const profileRouter = express.Router()

profileRouter.get('/profiledetails', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        if (userId) {
            const userDetails = await userModel.findOne({
                _id: userId as string
            });

            const postCount = await postModel.find({
                userId: userId
            }).countDocuments()

            return res.json({
                username: userDetails?.username,
                fullName: userDetails?.fullname,
                countOfFollowers: userDetails?.followers.length,
                countOfFollowing: userDetails?.following.length,
                countOfPosts: postCount.toString(),
                bio: userDetails?.bio
            })
        }
        else {
            return res.status(400).send()
        }
    }
    catch (e) {
        next(e)
    }
})

profileRouter.get('/profileimage', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        if (userId) {
            const userDetails = await userModel.findOne({
                _id: userId as string
            });

            const dirname = path.join(__dirname, '..', '..', '/profile-pics')
            if (userDetails?.profilepicture) {
                return res.sendFile(userDetails?.profilepicture as string, {
                    root: dirname
                });
            }
            else {
                return res.sendFile('5907.jpg', {
                    root: dirname
                });
            }
        }
        else {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }
    }
    catch (e) {
        next(e)
    }
})

profileRouter.get('/myposts', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        if (userId) {
            const posts = await postModel.find({
                userId: userId
            });

            if (posts) {
                const arrayOfPosts = new Array<MetaPostDataInterface>

                for (var i = 0; i < posts.length; i++) {
                    const comments = await commentModel.find({
                        postId: posts[i]._id
                    });
                    const singlePost: MetaPostDataInterface = {
                        postId: posts[i]._id.toString(),
                        imagePath: posts[i].imagepath,
                        countOfComments: comments?.length ?? 0,
                        countOfLikes: posts[i].likes.length
                    }
                    arrayOfPosts.push(singlePost)
                }

                return res.json(arrayOfPosts)
            }
            else {
                return res.sendStatus(204)
            }
        }
        else {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }
    }
    catch (e) {
        next(e)
    }
})

profileRouter.post('/postimage', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        const imageresult = postImageCheck.safeParse(req.body)

        if (!imageresult.success) {
            console.log(imageresult.error);
            return res.status(400).json({
                message: "Input not in correct format"
            });
        }
        const imageobj: postImageType = imageresult.data
        const dirname = path.join(__dirname, '..', '..', '/insta-pics')

        if (userId) {
            return res.sendFile(imageobj.imagepath, {
                root: dirname
            })
        }
        else {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }
    }
    catch (e) {
        next(e)
    }
})

profileRouter.get('/fullpostdetails', async (req, res, next) => {
    try {
        const postId = req.query.postId;

        if (postId) {
            const postfulldetails = await postModel.findOne({ _id: postId })
            const commentdetails = await commentModel.find({ postId: postId })

            const postDetailsObj: FullPostDetails = {
                postId: postfulldetails?.id,
                userId: postfulldetails?.userId.toString() ?? "0",
                imagepath: postfulldetails?.imagepath ?? "",
                caption: postfulldetails?.caption ?? "",
                likes: postfulldetails?.likes.reduce((acc, val) => {
                    acc.push(val.toString());
                    return acc;
                }, [] as string[]) ?? [] as string[],
                comments: commentdetails?.reduce((acc, val) => {
                    const tempComm: commentInterface = {
                        commentId: val._id?.toString() as string,
                        text: val.text as string ?? "",
                        user: val.userId?.toString() ?? "",
                        username: "",
                        createdAt: val.createdAt.toString() as string ?? "",
                        commentlikes: val.commentlikes?.reduce((likeacc, likeval) => {
                            likeacc.push(likeval.toString())
                            return likeacc
                        }, [] as string[]) ?? [] as string[]
                    }
                    acc.push(tempComm)
                    return acc;
                }, [] as commentInterface[]) ?? [] as commentInterface[],
                createdAt: postfulldetails?.createdAt.toString() ?? ""
            }
            const finalResult: FullPostDetails = await addUsernameToComments(postDetailsObj)

            return res.json(finalResult)
        }
        else {
            return res.sendStatus(400)
        }
    }
    catch (e) {
        next(e)
    }
})

async function addUsernameToComments(postDetailsObj: FullPostDetails): Promise<FullPostDetails> {
    return new Promise((res, rej) => {
        var numOfUsernamesadded: number = 0;
        if (postDetailsObj.comments.length == 0) res(postDetailsObj)
        postDetailsObj.comments.forEach(async (val) => {
            const userdet = await userModel.findOne({
                _id: val.user
            })
            val.username = userdet?.username as string
            numOfUsernamesadded++
            if (numOfUsernamesadded >= postDetailsObj.comments.length) res(postDetailsObj)
        })
    })
}

export default profileRouter