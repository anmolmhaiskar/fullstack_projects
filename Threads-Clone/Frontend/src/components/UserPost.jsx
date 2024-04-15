import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import UserLikesAndReplies from "./UserLikesAndReplies";
import UserLikesAvatar from "./UserLikesAvatar";
import UserName from "./UserName";

const UserPost = (props) => {
    const [liked, setLiked] = useState(0);
  return (
    <Link to={"posts/1"}  state={{props}}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size="md" name="Mark Zuckerberg" src="/zuck-avatar.png" />
          <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            <UserLikesAvatar size="2xs" name="John doe" src="https://bit.ly/prosper-baba" />
            <UserLikesAvatar size="2xs" name="John doe" src="https://bit.ly/dan-abramov" />
            <UserLikesAvatar size="2xs" name="John doe" src="https://bit.ly/sage-adebayo" />
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <UserName isVerified={true} fontSize="sm" userName="markzukerberg"/>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                1d
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{props.caption}</Text>
          { props.img && (
            <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                <Image src={props.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions liked={liked} setLiked={setLiked}/>
          </Flex>
          <UserLikesAndReplies likes={props.likes + (liked ? 1 : 0)} replies={props.replies} fontSize="sm" />
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;