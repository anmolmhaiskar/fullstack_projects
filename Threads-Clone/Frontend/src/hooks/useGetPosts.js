import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

const useGetPosts = (type) => {
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { username, postId } = useParams();
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const getPosts = async () => {
      try {
        console.log(username, postId);
        let req = null;
        switch (type) {
          case "GET_POST_BY_USERNAME":
            req = await fetch(`/api/posts/user/${username}`);
            break;
          case "GET_POST_BY_ID":
            req = await fetch(`/api/posts/${postId}`);
            break;
        }
        const data = await req.json();
        console.log(type, data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [postId, username, showToast, type]);

  return { posts, fetchingPosts };
};

export default useGetPosts;