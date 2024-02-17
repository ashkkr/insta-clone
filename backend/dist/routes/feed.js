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
const authSchema_1 = require("../schemas/authSchema");
const feedRouter = express_1.default.Router();
feedRouter.get('/getfeed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userid;
    //check if user exists
    const checkuser = yield authSchema_1.userModel.findOne({ _id: userId });
    if (checkuser) {
    }
    else {
        return res.status(404).json({
            message: "User does not exist"
        });
    }
}));
feedRouter.post('/likepost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.default = feedRouter;
