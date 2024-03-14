import express from "express"
import { z } from "zod";
import { userModel } from "../schemas/authSchema";

const searchRouter = express.Router()

const searchQueryTest = z.string().min(2).max(100)

searchRouter.get('/user', async (req, res, next) => {
    try {
        const searchText = searchQueryTest.safeParse(req.query.searchtext)

        if (!searchText.success) {
            return res.status(400).json({
                message: "Unexpected request"
            })
        }

        const userDetails = await userModel.find({
            $or: [
                { username: { $regex: searchText.data } },
                { fullname: { $regex: searchText.data } }
            ]
        })

        const searchedUsers: SuggestUserInterface[] = userDetails.reduce((acc, val) => {
            acc.push({
                userId: val._id.toString(),
                username: val.username
            })
            return acc
        }, [] as SuggestUserInterface[])

        return res.json(searchedUsers)
    }
    catch (e) {
        next(e)
    }
})

export default searchRouter