import { z } from "zod";

export const newCommentCheck = z.object({
    postId: z.string(),
    commentText: z.string().min(1).max(100),
    createdTime: z.string().max(100)
});

export const commentLikeInput = z.object({
    postId: z.string().max(25),
    commentId: z.string().max(25)
})

export const postLikeInput = z.object({
    postId: z.string().max(25)
})