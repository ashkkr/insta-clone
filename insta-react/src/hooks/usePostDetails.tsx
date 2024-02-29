import { useEffect } from "react";
import { FullPostDetails, MetaPostDataInterface, PostImageInterface, commentInterface, commentPicInterface } from "../interfaces/postinterfaces";
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
        'commentlikes' in comment && Array.isArray(comment.commentlikes) && comment.commentlikes.every((val: any) => typeof val === 'string')
}

export function checkFullPostInterface(post: any): post is FullPostDetails {
    return 'postId' in post && typeof post.postId === 'string' &&
        'caption' in post && typeof post.caption === 'string' &&
        'userId' in post && typeof post.userId === 'string' &&
        'createdAt' in post && typeof post.createdAt === 'string' &&
        'imagePath' in post && typeof post.imagePath === 'string' &&
        'likes' in post && Array.isArray(post.likes) && post.likes.every((item: string) => typeof item === 'string') &&
        'comments' in post && Array.isArray(post.comments) && post.comments.every((item: commentInterface) => checkCommentInterface(item))
}

export function imageToDataUrl<T extends PostImageInterface>(data: Array<T>) {
    const completionPromise = new Promise<void>((res, rej) => {
        var countOfImages = data.length
        data.forEach((val) => {
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

export function usePostDetails(userId: string) {
    const [profileposts, setprofileposts] = useRecoilState(profilePosts)
    useEffect(() => {
        if (userId == "me" || userId == "") userId = localStorage.getItem('userId') ?? ""
        fetch("http://localhost:3000/profile/myposts", {
            method: 'GET',
            headers: {
                "userId": userId ?? ""
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
                    'userId': localStorage.getItem('userId') ?? "",
                    'profileId': val.user
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
                        if (val.commentlikes.some((u) => u === myuserid)) {
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

export function usePostFullDetails(postId: string, username: string) {
    const setPostFullDetails = useSetRecoilState(postFullDetails)

    const refreshPost = () => {
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
                    const myuserid = localStorage.getItem('userId') as string
                    if (data.likes.some((val) => val === myuserid)) {
                        setPostFullDetails({ ...data, isPostLiked: true, comments: commentsWithPic, username: username })
                    }
                    else {
                        setPostFullDetails({ ...data, isPostLiked: false, comments: commentsWithPic, username: username })
                    }
                }
                else {
                    setPostFullDetails({} as FullPostDetails)
                    throw new Error("Unexpected response")
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }
    return { refreshPost }
}