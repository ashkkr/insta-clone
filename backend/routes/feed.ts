import express from "express"
import { userModel } from "../schemas/authSchema";
const feedRouter = express.Router()

feedRouter.get('/getfeed', async (req, res) => {
    const userId = req.body.userid;

    //check if user exists
    const checkuser = await userModel.findOne({ _id: userId });
    if (checkuser) {

    }
    else {
        return res.status(404).json({
            message: "User does not exist"
        })
    }
})

feedRouter.post('/likepost', async (req, res) => {

})

export default feedRouter;