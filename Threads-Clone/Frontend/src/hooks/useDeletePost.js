import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useDeletePost = (post) => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return;
      }
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      let data = null;
      if (res.status !== 204) {
        data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
      }
      showToast("Success", "Post Deleted", "success");
      navigate(`/${currentUser.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return handleDeletePost;
}

export default useDeletePost;