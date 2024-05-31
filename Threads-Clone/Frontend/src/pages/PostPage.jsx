import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import UserLikesAvatar from "../components/UserLikesAvatar";
import UserName from "../components/UserName";
import { getPostById } from "../constants/string";
import useDeletePost from "../hooks/useDeletePost";
import useGetPosts from "../hooks/useGetPosts";
import useGetUserProfile from "../hooks/useGetUserProfile";


const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const {posts, fetchingPosts} = useGetPosts(getPostById);
  const currentUser = useRecoilValue(userAtom);
  const handleDeletePost = useDeletePost();
  
  if((!user && loading) || (!posts && fetchingPosts)){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  
  if(!posts || posts.length<1){
    return null;
  }
  
  const currentPost = posts[0];

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar size="md" name={user.usernameS} src={user.profilePic} />
          <Flex>
            <UserName
              isVerified={true}
              fontSize="sm"
              userName={user.username}
            />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {currentPost?.createdAt &&
              formatDistanceToNow(new Date(currentPost?.createdAt)) + " ago"}
          </Text>

          {currentUser?._id === user._id && (
            <DeleteIcon onClick={(e) => handleDeletePost(e, currentPost)} />
          )}
        </Flex>
      </Flex>
      <Text fontSize={"sm"}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={2} mt={3}>
        <Box position={"relative"} w={"full"}>
          <UserLikesAvatar
            size="2xs"
            name="John doe"
            src="https://bit.ly/prosper-baba"
          />
          <UserLikesAvatar
            size="2xs"
            name="John doe"
            src="https://bit.ly/dan-abramov"
          />
          <UserLikesAvatar
            size="2xs"
            name="John doe"
            src="https://bit.ly/sage-adebayo"
          />
        </Box>
      </Flex>
      <Flex gap={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Get the app to like, comment and reply
          </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentPost?.replies?.map((reply) => (
        //TODO: add likes and reply feature to comment
        <Comment
          key={reply._id}
          comment={reply.text}
          createdAt={2}
          userName={reply.username}
          avatar={reply.userProfilePic}
          isVerified={false}
        />
      ))}
    </>
  );
};

export default PostPage;