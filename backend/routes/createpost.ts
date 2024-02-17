import express from "express"
const postRouter = express.Router()

postRouter.post('/createpost', async (req, res) => {
    return res.json({
        message: "Post created successfully"
    })
});

export default postRouter;

