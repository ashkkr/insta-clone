"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCheck = exports.signupCheck = void 0;
const zod_1 = require("zod");
exports.signupCheck = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20),
    fullname: zod_1.z.string().min(1).max(20),
    username: zod_1.z.string().min(1).max(20)
});
exports.loginCheck = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20)
});
