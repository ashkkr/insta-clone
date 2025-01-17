import { useRecoilState, useRecoilValue } from "recoil";
import { profileDetails, profileimageurl } from "../atoms/atoms";
import { useEffect, useState } from "react";
import { ProfileInterface } from "../interfaces/userInterfaces";

export function useProfileDetails(profileId: string) {
    const [profileDetailsValue, setProfileDetails] = useRecoilState(profileDetails);
    const [profileDataurl, setProfileDataurl] = useRecoilState(profileimageurl)

    useEffect(() => {
        if (profileId == "me" || profileId == "") profileId = localStorage.getItem('userId') ?? ""

        fetch('https://api2.coderswims.xyz/profile/profiledetails', {
            method: 'GET',
            headers: {
                "userId": localStorage.getItem('userId') ?? "",
                "profileId": profileId
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

        fetch('https://api2.coderswims.xyz/profile/profileimage', {
            method: 'GET',
            headers: {
                "profileId": profileId ?? "",
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