import { profilePictures } from "../atoms/atoms"
import { useRecoilState } from "recoil"

export function useProfilePicture() {
    const [profilePicturesVal, setProfilePictures] = useRecoilState(profilePictures)
    //const [singleDataUrl, setSingleDataUrl] = useState<string>("")

    const updateProfiles = async (listOfUserIds: string[]) => {
        try {
            const pictureMap = profilePicturesVal
            for (var i = 0; i < listOfUserIds.length; i++) {
                if (!pictureMap.has(listOfUserIds[i])) {
                    const val = listOfUserIds[i]
                    const imgDataUrl = await fetchProfilePicture(val)
                    pictureMap.set(val, imgDataUrl)
                }
            }
            setProfilePictures(pictureMap)
        }
        catch (e: any) {
            console.error("Error in fetching profile images", e)
        }
    }

    return { updateProfiles }
}


function fetchProfilePicture(profileId: string) {
    return new Promise<string>((res, rej) => {
        fetch('http://localhost:3000/profile/profileimage', {
            method: 'GET',
            headers: {
                'userId': localStorage.getItem('userId') ?? "",
                'profileId': profileId
            }
        })
            .then(res => {
                if (res.ok) return res.blob()
                else throw new Error("Something went wrong")
            })
            .then(img => {
                const imgReader = new FileReader()
                imgReader.onloadend = () => {
                    res(imgReader.result as string)
                }
                imgReader.readAsDataURL(img)
            })
            .catch((e) => {
                console.error(e)
                rej()
            })
    })
}