import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import UserLikesAndReplies from "../components/UserLikesAndReplies";
import UserLikesAvatar from "../components/UserLikesAvatar";
import UserName from "../components/UserName";

const PostPage = () => {
  const props = useLocation()?.state?.props;
  const [liked, setLiked] = useState(0);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
          <Flex>
            <UserName
              isVerified={true}
              fontSize="sm"
              userName="markzukerberg"
            />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text fontSize={"sm"}>{props.caption}</Text>
      {props.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={props.img} w={"full"} />
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
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <UserLikesAndReplies
        likes={props.likes + (liked ? 1 : 0)}
        replies={props.replies}
        fontSize="sm"
      />
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
      <Comment likes={23} comment={"Hey, this looks great!"} createdAt={2} userName="Rajesh" avatar="https://bit.ly/ryan-florence" isVerified={false}/>
      <Comment likes={10} comment={"wow! you finally made it"} createdAt={3} userName="Rohit" avatar="https://bit.ly/code-beast" isVerified={true}/>
      <Comment likes={30} comment={"I am gonna use it for self promotion"} createdAt={3} userName="Dan Brown" avatar="https://bit.ly/dan-abramov" isVerified={true}/>
    </>
  );
};

export default PostPage;