import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const showToast = useShowToast();
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file.type);
        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgUrl(reader.result);
            }

            reader.readAsDataURL(file);
        } else {
            showToast("Invalid file type", "please select an image file", "error");
            setImgUrl(null);
        }
    }
    return { handleImageChange, imgUrl, setImgUrl };
}

export default usePreviewImg