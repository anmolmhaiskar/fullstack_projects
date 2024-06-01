import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PiChatCircleText } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import useShowToast from "../hooks/useShowToast";

const HomePage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
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
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <>
      {user && (
        <Flex position={"absolute"} top={0} right={7}>
          <Link to="/chat">
            <PiChatCircleText size={26} />
          </Link>
        </Flex>
      )}
      <Flex gap="10" alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && posts.length === 0 && (
            <h1>Follow some users to see the feed</h1>
          )}

          {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )}

          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </Box>
        <Box
          flex={30}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
