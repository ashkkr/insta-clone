import { useState } from "react"

export function useLikeUnlikePost(postId: string, setPostLiked: React.Dispatch<React.SetStateAction<boolean>>, numLikes: number, setNumLikes: React.Dispatch<React.SetStateAction<number>>) {
    const likeunlikepost = (postLiked: boolean) => {
        if (postLiked) {
            //unliking post
            setPostLiked(false)
            setNumLikes(numLikes - 1)
            fetch('http://localhost:3000/post/unlikepost', {
                method: "POST",
                body: JSON.stringify({
                    postId: postId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'userId': localStorage.getItem('userId') ?? ""
                }
            })
        }
        else {
            // liking  post
            setPostLiked(true)
            setNumLikes(numLikes + 1)
            fetch('http://localhost:3000/post/likepost', {
                method: "POST",
                body: JSON.stringify({
                    postId: postId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'userId': localStorage.getItem('userId') ?? ""
                }
            })
        }
        return undefined
    }

    return { likeunlikepost }
}