import { useRecoilState, useSetRecoilState } from "recoil";
import { imageSelecteed, imagefileselected } from "../atoms/atoms";

function useUploadImage() {
    const [imagedata, setimagedata] = useRecoilState(imageSelecteed);
    const setimagefile = useSetRecoilState(imagefileselected);
    const fileSizeLimit = 2 * 1024 * 1024; // in Bytes

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        var file: File;
        if (e.target.files !== null) {
            file = e.target.files[0];

            if (file && file.type.startsWith("image/") && file.size <= fileSizeLimit) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setimagedata(reader.result?.toString() ?? "")
                    setimagefile(file)
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
    return { handleImage, imagedata, setimagedata }
}

export default useUploadImage;