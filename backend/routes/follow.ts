import express from "express"
import { userIdCheck } from "../zodobjects/auth"
import { userModel } from "../schemas/authSchema"
import mongoose from "mongoose"
const followRouter = express.Router()

followRouter.post("/follow", async (req, res, next) => {
    try {
        const userId = req.get('userId')

        const toBeFollowedVal = userIdCheck.safeParse(req.body)

        if (!toBeFollowedVal.success) {
            return res.status(400).json({
                message: "Input not in correct format"
            })
        }
        const toBeFollowed = toBeFollowedVal.data.userId;

        const userOne = await userModel.findOne({
            _id: userId
        })

        if (!userOne) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const userTwo = await userModel.findOne({
            _id: toBeFollowed
        })

        if (!userTwo) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        userOne?.following.push(new mongoose.Types.ObjectId(toBeFollowed))
        await userOne?.save()

        userTwo.followers.push(new mongoose.Types.ObjectId(userId))
        await userTwo.save()

        return res.sendStatus(200)
    }
    catch (e) {
        next(e)
    }
})

followRouter.post('/unfollow', async (req, res, next) => {
    const userId = req.get('userId')

    const toBeUnfollowedVal = userIdCheck.safeParse(req.body)

    if (!toBeUnfollowedVal.success) {
        return res.status(400).json({
            message: "Input not in correct format"
        })
    }
    const toBeUnfollowed = toBeUnfollowedVal.data.userId

    const updateDocOne = await userModel.findOneAndUpdate({
        _id: userId
    },
        {
            $pull: { following: new mongoose.Types.ObjectId(toBeUnfollowed) }
        },
        {
            new: true
        })

    if (!updateDocOne) {
        return res.status(404).json({
            message: "Some error occurred"
        })
    }

    const updateDocTwo = await userModel.findOneAndUpdate({
        _id: toBeUnfollowed
    },
        {
            $pull: { followers: new mongoose.Types.ObjectId(userId) }
        },
        {
            new: true
        })

    if (!updateDocTwo) {
        return res.status(404).json({
            message: "Some error occurred"
        })
    }

    return res.sendStatus(200)

})

followRouter.get('/suggestusers', async (req, res, next) => {
    try {
        const userId = req.get('userId')

        const userDetails = await userModel.findOne({
            _id: userId
        })

        const listOfFollowing = userDetails?.following.map((val) => {
            return val.toString()
        }) as string[]

        const suggestUsers = await userModel.find({
            _id: { $nin: [...listOfFollowing, userId] }
        }).limit(5);

        const finalResult = suggestUsers.reduce((acc, val) => {
            acc.push({
                userId: val._id.toString(),
                username: val.username
            })
            return acc;
        }, [] as SuggestUserInterface[])

        return res.json(finalResult)
    }
    catch (e) {
        next(e)
    }
})

export default followRouter;