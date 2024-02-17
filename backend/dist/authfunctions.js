"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRETKEY = 'SECRET_KEY';
const getToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, SECRETKEY, {
        expiresIn: '1h'
    });
    return token;
};
exports.getToken = getToken;
