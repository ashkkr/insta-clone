import { useState } from "react"
import { FeedPostDetails } from "../interfaces/postinterfaces"
import { checkFullPostInterface, imageToDataUrl } from "./usePostDetails"
import { useProfilePicture } from "./useProfilePicture"

function checkIfFeedPost(post: any): post is FeedPostDetails {
    return checkFullPostInterface(post) &&
        'username' in post && typeof post.username === 'string' &&
        'commentCount' in post && typeof post.commentCount === 'number' &&
        'isUserFollowed' in post && typeof post.isUserFollowed === 'boolean' &&
        'imageDataUrl' in post && typeof post.imageDataUrl === 'string' &&
        'isPostLiked' in post && typeof post.isPostLiked === 'boolean' &&
        'likeCount' in post && typeof post.likeCount === 'number'
}

export function useGetFeed() {
    const [userFeed, setUserFeed] = useState<FeedPostDetails[]>([])
    const { updateProfiles } = useProfilePicture()

    const refreshFeed = () => {
        fetch('http://localhost:3000/feed/getfeed', {
            method: "GET",
            headers: {
                'userId': localStorage.getItem('userId') ?? ""
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else throw new Error("Something went wrong")
            })
            .then(async (data) => {
                if (Array.isArray(data) && data.length > 0 && data.every(val => checkIfFeedPost(val))) {
                    await imageToDataUrl(data as FeedPostDetails[])
                    updateProfiles(data.map(val => { return val.userId }))
                    setUserFeed(data)
                }
                else throw new Error("Unexpected response")
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return { userFeed, refreshFeed }
}

export function useTestRender() {
    const testRender = () => {
        console.log("inside render funciton")
        return undefined
    }

    return { testRender }
}