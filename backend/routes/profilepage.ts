import express from "express"
import { postModel, userModel } from "../schemas/authSchema";
import path from "path"
import { MetaPostDataInterface } from "../interfaces/postinterfaces";
import { postImageCheck, postImageType } from "../zodobjects/profile";
const profileRouter = express.Router()

profileRouter.get('/profiledetails', async (req, res, next) => {
    try {
        const userId = req.get('userId')
        if (userId) {
            const userDetails = await userModel.findOne({
                _id: userId as string
            });

            return res.json({
                username: userDetails?.username,
                fullName: userDetails?.fullname,
                countOfFollowers: userDetails?.followers.length,
                countOfFollowing: userDetails?.following.length,
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

                posts.forEach((val) => {
                    const singlePost: MetaPostDataInterface = {
                        imagePath: val.imagepath,
                        countOfComments: val.comments.length,
                        countOfLikes: val.likes.length
                    }
                    arrayOfPosts.push(singlePost)
                })

                return res.json(arrayOfPosts)
            }
            else {
                return res.status(204)
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

export default profileRouter