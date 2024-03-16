import { useSetRecoilState } from "recoil"
import { SuggestUserInterface } from "../interfaces/userInterfaces"
import { searchedUsers } from "../atoms/atoms"

function isValidSuggestedUser(val: any): val is SuggestUserInterface {
    return 'userId' in val && typeof val.userId === 'string' &&
        'username' in val && typeof val.username === 'string'
}

export function useSearch() {
    const setSuggestUsers = useSetRecoilState(searchedUsers)

    const searchUser = (searchText: string) => {
        fetch(`http://localhost:3000/search/user?searchtext=${searchText}`, {
            method: 'GET'
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
                else throw new Error("Something went wrong")
            })
            .then((data) => {
                if (Array.isArray(data) && data.every(val => isValidSuggestedUser(val))) {
                    setSuggestUsers(data)
                }
                else throw new Error("Unexpected response")
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return { searchUser }
}