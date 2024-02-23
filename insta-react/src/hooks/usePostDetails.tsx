import { useEffect } from "react";
import { FullPostDetails, MetaPostDataInterface, commentInterface, commentPicInterface } from "../interfaces/postinterfaces";
import { useRecoilState, useSetRecoilState } from "recoil";
import { postFullDetails, profilePosts } from "../atoms/atoms";

function checkPostInterface(post: any): post is MetaPostDataInterface {
    return 'imagePath' in post && typeof post.imagePath === 'string' &&
        'countOfLikes' in post && typeof post.countOfLikes === 'number' &&
        'countOfComments' in post && typeof post.countOfComments === 'number' &&
        'postId' in post && typeof post.postId === 'string'
}

function checkCommentInterface(comment: any): comment is commentInterface {
    return 'user' in comment && typeof comment.user === 'string' &&
        'createdAt' in comment && typeof comment.createdAt === 'string' &&
        'text' in comment && typeof comment.text === 'string' &&
        'username' in comment && typeof comment.username === 'string' &&
        'commentId' in comment && typeof comment.commentId === 'string' &&
        'likes' in comment && Array.isArray(comment.likes) && comment.likes.every((val: any) => typeof val === 'string')
}

function checkFullPostInterface(post: any): post is FullPostDetails {
    return 'postId' in post && typeof post.postId === 'string' &&
        'caption' in post && typeof post.caption === 'string' &&
        'userId' in post && typeof post.userId === 'string' &&
        'createdAt' in post && typeof post.createdAt === 'string' &&
        'imagepath' in post && typeof post.imagepath === 'string' &&
        'likes' in post && Array.isArray(post.likes) && post.likes.every((item: string) => typeof item === 'string') &&
        'comments' in post && Array.isArray(post.comments) && post.comments.every((item: commentInterface) => checkCommentInterface(item))
}

async function imageToDataUrl(data: Array<MetaPostDataInterface>) {
    const completionPromise = new Promise<void>((res, rej) => {
        var countOfImages = data.length
        data.forEach((val) => {
            val.displayLikes = false;
            fetch('http://localhost:3000/profile/postimage', {
                method: "POST",
                body: JSON.stringify({
                    imagepath: val.imagePath
                }),
                headers: {
                    "Content-Type": "application/json",
                    "userId": localStorage.getItem('userId') ?? ""
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.blob()
                    }
                    else throw new Error("Something went wrong")
                })
                .then(img => {
                    var imgReader = new FileReader()
                    imgReader.onloadend = () => {
                        val.imageDataUrl = imgReader.result as string
                        countOfImages--
                        if (countOfImages <= 0) res()
                    }
                    imgReader.readAsDataURL(img)
                })
                .catch((e) => {
                    rej()
                    console.error(e)
                })
        })

    })
    return completionPromise
}

export function usePostDetails() {
    const [profileposts, setprofileposts] = useRecoilState(profilePosts)
    useEffect(() => {
        fetch("http://localhost:3000/profile/myposts", {
            method: 'GET',
            headers: {
                "userId": localStorage.getItem('userId') ?? ""
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else return new Error("Something went wrong")
            })
            .then(async (data) => {
                if (Array.isArray(data) && data.length > 0 && data.every(item => checkPostInterface(item))) {
                    await imageToDataUrl(data)
                    setprofileposts(data)
                }
                else {
                    setprofileposts(new Array<MetaPostDataInterface>())
                    throw new Error("Unexpected response")
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }, [])
}

async function getCommentPicDetails(data: FullPostDetails): Promise<commentPicInterface[]> {
    return new Promise((res, rej) => {
        const updatedComments: commentPicInterface[] = []
        if (data.comments.length == 0) res(updatedComments)
        data.comments.forEach((val) => {
            //fetching comment profile pictures
            fetch('http://localhost:3000/profile/profileimage', {
                method: 'GET',
                headers: {
                    'userId': val.user
                }
            })
                .then(res => {
                    if (res.ok) return res.blob()
                    else throw new Error("Something went wrong")
                })
                .then(img => {
                    const imgReader = new FileReader()
                    imgReader.onloadend = () => {
                        // determing if comment is liked or not
                        const myuserid = localStorage.getItem('userId') as string
                        if (val.likes.some((u) => u === myuserid)) {
                            const temp: commentPicInterface = { ...val, isLiked: true, profilepic: imgReader.result as string }
                            updatedComments.push(temp)
                        }
                        else {
                            const temp: commentPicInterface = { ...val, isLiked: false, profilepic: imgReader.result as string }
                            updatedComments.push(temp)
                        }
                        if (updatedComments.length === data.comments.length) res(updatedComments)
                    }
                    imgReader.readAsDataURL(img)
                })
                .catch((e) => {
                    console.error(e)
                    rej()
                })
        })
    })
}

export function usePostFullDetails(postId: string) {
    const setPostFullDetails = useSetRecoilState(postFullDetails)

    useEffect(() => {
        fetch('http://localhost:3000/profile/fullpostdetails?' + new URLSearchParams({
            postId: postId
        }), {
            method: 'GET',
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
                if (checkFullPostInterface(data)) {
                    const commentsWithPic: commentPicInterface[] = await getCommentPicDetails(data)
                    setPostFullDetails({ ...data, comments: commentsWithPic })
                    console.log({ ...data, comments: commentsWithPic })
                }
                else {
                    setPostFullDetails({} as FullPostDetails)
                    throw new Error("Unexpected response")
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }, [postId])
}