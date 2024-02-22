import express from 'express'
const authRouter = express.Router();
import { userModel } from '../schemas/authSchema';
import { loginCheck, logintype, signupCheck, signuptype } from '../zodobjects/auth';
import { getToken } from '../authfunctions';
import { MongooseError } from 'mongoose';
import { userInterface } from '../interfaces/authInterfaces';

authRouter.post('/signup', async (req, res, next) => {
    try {
        const parsedInput = signupCheck.safeParse(req.body)
        console.log(req.body.email);
        if (!parsedInput.success) {
            console.log(parsedInput.error);
            return res.status(400).json({
                message: "Input not in correct format"
            });
        }

        const signupDetails: signuptype = parsedInput.data;
        // check if email already exists
        const existingEmail = await userModel.findOne({
            email: signupDetails.email
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email is already registered"
            })
        }
        // check  if username is already taken
        const existingUsername = await userModel.findOne({
            username: signupDetails.username
        });
        if (existingUsername) {
            return res.status(409).json({
                message: "Username is taken."
            })
        }

        const saveUser = new userModel(signupDetails);
        await saveUser.save()
        const token = getToken(signupDetails);

        return res.json({
            token: token,
            userId: saveUser.id,
            message: "User created successfully"
        })
    }
    catch (e) {
        next(e);
    }
});

authRouter.post('/login', async (req, res, next) => {
    try {
        const parsedInput = loginCheck.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(400).json({
                message: "Input not in correct format"
            });
        }

        const loginUser: logintype = parsedInput.data;
        const userexists = await userModel.findOne(loginUser);
        if (!userexists) {
            return res.status(404).json({
                message: "Wrong credentials"
            })
        }

        const token = getToken(loginUser);

        return res.json({
            token: token,
            userId: userexists.id,
            message: "User logged in successfully"
        });
    }
    catch (e) {
        next(e);
    }
})


export default authRouter;