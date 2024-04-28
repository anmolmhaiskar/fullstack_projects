import { DeleteIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import UserLikesAvatar from "../components/UserLikesAvatar";
import UserName from "../components/UserName";
import useDeletePost from "../hooks/useDeletePost";
import useGetPosts from "../hooks/useGetPosts";
import useGetUserProfile from "../hooks/useGetUserProfile";


const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const {posts, fetchingPosts} = useGetPosts("GET_POST_BY_ID");
  const currentUser = useRecoilValue(userAtom);
  const handleDeletePost = useDeletePost(posts);

  if((!user && loading) || (!posts && fetchingPosts)){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

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
            <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"} >
              {posts?.createdAt &&
                formatDistanceToNow(new Date(posts?.createdAt)) + " ago"}
            </Text>
            
            {currentUser?._id === user._id && <DeleteIcon onClick={handleDeletePost} />}
          
          </Flex>
        </Flex>
      <Text fontSize={"sm"}>{posts.text}</Text>
      {posts.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={posts.img} w={"full"} />
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
        <Actions post={posts} />
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
      {posts.replies.map(reply => (
        //TODO: add likes and reply feature to comment
        <Comment key={reply._id} likes={23} comment={reply.text} createdAt={2} userName={reply.username} avatar={reply.userProfilePic} isVerified={false}/>
      ))}
      </>
  );
};

export default PostPage;