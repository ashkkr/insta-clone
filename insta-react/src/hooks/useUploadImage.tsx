import { useState } from "react";
import { useRecoilState } from "recoil";
import { imageSelecteed } from "../atoms/atoms";

function useUploadImage() {
    const [imagefile, setimagefile] = useRecoilState(imageSelecteed);
    const fileSizeLimit = 2 * 1024 * 1024; // in Bytes

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        var file: File;
        if (e.target.files !== null) {
            file = e.target.files[0];

            if (file && file.type.startsWith("image/") && file.size <= fileSizeLimit) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setimagefile(reader.result ?? "")
                }
                reader.readAsDataURL(file);
            }
            else {
                console.log("Not an image file or file size more than 2MB")
            }
        }
        else {
            console.log("No file selected");
        }
    }
    return { handleImage, imagefile, setimagefile }
}

export default useUploadImage;