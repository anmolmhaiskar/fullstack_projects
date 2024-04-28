import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if(data.error){
                showToast("Error", data.error, "error");
                }
                setUser(data.user);
            } catch (error) {
                setUser(null);
                showToast("Error", error, "error")
            } finally {
                setLoading(false);
            }
        }
        getUser();
    },[showToast, username]);
    return {user, loading};
}

export default useGetUserProfile;