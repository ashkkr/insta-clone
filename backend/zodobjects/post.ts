import { z } from "zod";

export const newCommentCheck = z.object({
    postId: z.string(),
    commentText: z.string().min(1).max(100),
    createdTime: z.string().max(100)
});