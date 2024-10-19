import express, { Request, Response, NextFunction } from "express"
import authRouter from "./routes/auth";
import mongoose, { MongooseError } from "mongoose";
import cors from "cors"
import feedRouter from "./routes/feed";
import postRouter from "./routes/createpost";
import profileRouter from "./routes/profilepage";
import postInteractionRouter from "./routes/post";
import followRouter from "./routes/follow";
import searchRouter from "./routes/search";

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (err instanceof MongooseError) {
        return res.status(504).json({
            message: "Connection with database could not be made"
        })
    }
    else {
        return res.status(504).json({
            message: "Some server side error occurred"
        })
    }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter)
app.use('/feed', feedRouter)
app.use('/create', postRouter)
app.use('/profile', profileRouter)
app.use('/post', postInteractionRouter)
app.use('/user', followRouter)
app.use('/search', searchRouter)
app.use(errorHandler);

mongoose.connect('mongodb+srv://ashutoshsangra:4xj7hdS43aAv70PZ@cluster0.4ucnbnd.mongodb.net/',
    { dbName: 'insta-clone' })
    .then((value) => {
        console.log('Connection to mongodb created')
        app.listen(3001, () => {
            console.log(`Application is listening on port 3000`);
        });
    })
    .catch((err) =>
        console.error(`Conn to mongodb failed/ ${err}`)
    )