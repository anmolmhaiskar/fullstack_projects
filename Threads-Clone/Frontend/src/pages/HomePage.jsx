import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";

const HomePage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        } else {
          setPosts(data);
        }
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    }
    getFeedPosts();
  }, [showToast]);

  return (
    <>
      {!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

      {loading && (
        <Flex justifyContent={"center"}>
          <Spinner size="xl" />
        </Flex>
      )}

      {
      posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;