import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import { getPostById, getPostByUsername } from '../constants/string';
import useShowToast from './useShowToast';

const useGetPosts = (type) => {
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { username, postId } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setPosts(null);
        let req = null;
        switch (type) {
          case getPostByUsername:
            req = await fetch(`/api/posts/user/${username}`);
            if (req) {
              const data = await req.json();
              setPosts(data);
            }
            break;
          case getPostById:
            req = await fetch(`/api/posts/${postId}`);
            if (req) {
              const data = await req.json();
              setPosts([data]);
            }
            break;
          default: setPosts(null);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [postId, username, showToast, type, setPosts]);

  return { posts, fetchingPosts };
};

export default useGetPosts;