import { z } from "zod";

export const postImageCheck = z.object({
    imagepath: z.string().max(32)
});

export type postImageType = z.infer<typeof postImageCheck>;