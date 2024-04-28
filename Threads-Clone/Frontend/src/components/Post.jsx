import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import Actions from "./Actions";
import UserLikesAvatar from "./UserLikesAvatar";
import UserName from "./UserName";

const Post = ({post, postedBy}) => {
  const currentUser = useRecoilValue(userAtom);
  const [user, setUser] = useState();
  // const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const props = null;
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data.user);
      } catch (error) {
        showToast("Error", error, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);
    
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete this post?")){
        return;
      }
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });

      let data = null;
      if(res.status !== 204){
        data = await res.json();
        if(data.error){
            showToast("Error", data.error, "error");
            return;
        }
      }
      showToast("Success", "Post Deleted", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }    
  }
  

  if(!post || !user) return null;

  return (
    <Link to={`/${user.username}/posts/${post._id}`} state={{ props }}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies[0] && (
              <UserLikesAvatar
                size="2xs"
                name={post.replies[0].username}
                src={post.replies[0].userProfilePic}
              />
            )}
            {post.replies[1] && (
              <UserLikesAvatar
                size="2xs"
                name={post.replies[1].username}
                src={post.replies[1].userProfilePic}
              />
            )}

            {post.replies[2] && (
              <UserLikesAvatar
                size="2xs"
                name={post.replies[2].username}
                src={post.replies[2].userProfilePic}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <UserName
                isVerified={true}
                fontSize="sm"
                userName={user.username}
              />
            </Flex>
            
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"} >
                {post?.createdAt &&
                  formatDistanceToNow(new Date(post?.createdAt)) + " ago"}
              </Text>
              
              {currentUser?._id === user._id && <DeleteIcon onClick={handleDeletePost} />}
            
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{post.text}</Text>
          
          {post.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
