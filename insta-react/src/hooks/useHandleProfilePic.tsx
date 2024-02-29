import { useToast } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil"
import { modalProfilePic } from "../atoms/atoms"

export function useHandleProfilePic() {
    const toast = useToast()
    const setProfilePicModal = useSetRecoilState(modalProfilePic)
    const deleteProfilePic = () => {
        fetch('http://localhost:3000/profile/deleteprofilepic', {
            method: 'DELETE',
            headers: {
                'userId': localStorage.getItem('userId') ?? ""
            }
        })
            .then(res => {
                if (res.ok) {
                    toast({
                        title: "Profile photo removed",
                        status: 'success',
                        isClosable: true
                    })
                }
                else throw new Error("Request could not be completed")
            })
            .catch((e) => {
                console.error(e)
                toast({
                    title: "Profile photo could not be removed",
                    status: 'error',
                    isClosable: true
                })
            })
            .finally(() => {
                setProfilePicModal(false)
            })
    }

    const uploadProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files != null) {
            const formData = new FormData()
            formData.append('profilepic', e.target.files[0])

            fetch('http://localhost:3000/profile/setprofilepicture', {
                method: 'POST',
                body: formData,
                headers: {
                    'userId': localStorage.getItem('userId') ?? ""
                }
            })
                .then(res => {
                    if (res.ok) {
                        toast({
                            title: "Profile photo set",
                            status: 'success',
                            isClosable: true
                        })
                    }
                    else throw new Error("Request could not be completed")
                })
                .catch((e) => {
                    console.error(e)
                    toast({
                        title: "Some error occurred",
                        status: 'error',
                        isClosable: true
                    })
                })
                .finally(() => {
                    setProfilePicModal(false)
                })
        }
    }

    return { deleteProfilePic, uploadProfilePic }
}