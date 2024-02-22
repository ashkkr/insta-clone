import { useEffect } from "react";
import { MetaPostDataInterface } from "../interfaces/postinterfaces";
import { useRecoilState } from "recoil";
import { profilePosts } from "../atoms/atoms";

function checkPostInterface(post: any): post is MetaPostDataInterface {
    return 'imagePath' in post && typeof post.imagePath === 'string' &&
        'countOfLikes' in post && typeof post.countOfLikes === 'number' &&
        'countOfComments' in post && typeof post.countOfComments === 'number'
}

async function imageToDataUrl(data: Array<MetaPostDataInterface>) {
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