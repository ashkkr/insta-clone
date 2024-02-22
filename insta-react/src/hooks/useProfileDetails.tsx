import { useRecoilState, useRecoilValue } from "recoil";
import { profileDetails, profileimageurl } from "../atoms/atoms";
import { useEffect, useState } from "react";
import { ProfileInterface } from "../interfaces/userInterfaces";

export function useProfileDetails() {
    const [profileDetailsValue, setProfileDetails] = useRecoilState(profileDetails);
    const [profileDataurl, setProfileDataurl] = useRecoilState(profileimageurl)

    useEffect(() => {
        fetch('http://localhost:3000/profile/profiledetails', {
            method: 'GET',
            headers: {
                "userId": localStorage.getItem('userId') ?? ""
            }
        })
            .then(res => {
                if (res.ok) return res.json()
                else throw new Error("Something went wrong")
            })
            .then(data => {
                setProfileDetails(data as ProfileInterface)
            })
            .catch((e) => {
                console.error(e)
            })

        fetch('http://localhost:3000/profile/profileimage', {
            method: 'GET',
            headers: {
                "userId": localStorage.getItem('userId') ?? ""
            }
        })
            .then(res => {
                if (res.ok) return res.blob()
                else throw new Error("Something went wrong")
            })
            .then(img => {
                var imageReader = new FileReader()
                imageReader.onloadend = () => {
                    setProfileDataurl(imageReader.result as string)
                }
                imageReader.readAsDataURL(img)
            })
            .catch((e) => {
                console.error(e)
            })
    }, [])
}