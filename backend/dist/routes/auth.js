"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
const authSchema_1 = require("../schemas/authSchema");
const auth_1 = require("../zodobjects/auth");
const authfunctions_1 = require("../authfunctions");
authRouter.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = auth_1.signupCheck.safeParse(req.body);
        console.log(req.body.email);
        if (!parsedInput.success) {
            console.log(parsedInput.error);
            return res.status(400).json({
                message: "Input not in correct format"
            });
        }
        const signupDetails = parsedInput.data;
        // check if email already exists
        const existingEmail = yield authSchema_1.userModel.findOne({
            email: signupDetails.email
        });
        if (existingEmail) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }
        // check  if username is already taken
        const existingUsername = yield authSchema_1.userModel.findOne({
            username: signupDetails.username
        });
        if (existingUsername) {
            return res.status(409).json({
                message: "Username is taken."
            });
        }
        const saveUser = new authSchema_1.userModel(signupDetails);
        yield saveUser.save();
        const token = (0, authfunctions_1.getToken)(signupDetails);
        return res.json({
            token: token,
            message: "User created successfully"
        });
    }
    catch (e) {
        next(e);
    }
}));
authRouter.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = auth_1.loginCheck.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(400).json({
                message: "Input not in correct format"
            });
        }
        const loginUser = parsedInput.data;
        const userexists = yield authSchema_1.userModel.findOne(loginUser);
        if (!userexists) {
            return res.status(404).json({
                message: "Wrong credentials"
            });
        }
        const token = (0, authfunctions_1.getToken)(loginUser);
        return res.json({
            token: token,
            message: "User logged in successfully"
        });
    }
    catch (e) {
        next(e);
    }
}));
exports.default = authRouter;
