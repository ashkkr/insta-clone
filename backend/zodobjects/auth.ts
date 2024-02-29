import { z } from "zod"

export const signupCheck = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    fullname: z.string().min(1).max(20),
    username: z.string().min(1).max(20)
});

export type signuptype = z.infer<typeof signupCheck>;

export const loginCheck = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20)
});

export type logintype = z.infer<typeof loginCheck>;

export const userIdCheck = z.object({
    userId: z.string().max(40)
})