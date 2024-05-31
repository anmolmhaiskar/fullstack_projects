import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useDeletePost = () => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [ posts, setPosts ] = useRecoilState(postsAtom);
  const handleDeletePost = async (e, post) => {
    try {
      if(!post){
        return null;
      }
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) {
        return;
      }
      console.log("useDeletePost post", post);
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
      if(Array.isArray(posts)){
        setPosts(posts.filter((p) => p._id !== post._id));
      } else {
        setPosts(null);
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