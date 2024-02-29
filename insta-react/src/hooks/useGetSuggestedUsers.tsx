import { useEffect, useState } from "react";
import { SuggestUserInterface } from "../interfaces/userInterfaces";
import { useProfilePicture } from "./useProfilePicture";

function checkSuggestUserInterface(data: any): data is SuggestUserInterface {
    return 'userId' in data && typeof data.userId === 'string' &&
        'username' in data && typeof data.username === 'string'
}

export function useGetSuggestedUsers() {
    const { updateProfiles } = useProfilePicture()
    const [suggestUsersVal, setSuggestUsers] = useState<SuggestUserInterface[]>([])

    const followUser = (userId: string, setFollowed: React.Dispatch<React.SetStateAction<boolean>>) => {
        fetch('http://localhost:3000/user/follow', {
            method: "POST",
            body: JSON.stringify({
                "userId": userId
            }),
            headers: {
                'userId': localStorage.getItem('userId') ?? "",
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    setFollowed(true)
                }
                else throw new Error("Could not perform operation")
            })
            .catch((e) => {
                console.error(e)
            })
    }

    const unfollowUser = (userId: string, setFollowed: React.Dispatch<React.SetStateAction<boolean>>) => {
        fetch('http://localhost:3000/user/unfollow', {
            method: "POST",
            body: JSON.stringify({
                "userId": userId
            }),
            headers: {
                'userId': localStorage.getItem('userId') ?? "",
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.ok) {
                    setFollowed(false)
                }
                else throw new Error("Could not perform operation")
            })
            .catch((e) => {
                console.error(e)
            })
    }

    useEffect(() => {
        fetch('http://localhost:3000/user/suggestusers', {
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
            .then(data => {
                if (Array.isArray(data) && data.every(item => checkSuggestUserInterface(item))) {
                    updateProfiles(data.map(val => val.userId))
                    setSuggestUsers(data as SuggestUserInterface[])
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }, [])

    return { suggestUsersVal, followUser, unfollowUser }
}