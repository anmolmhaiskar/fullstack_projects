import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import UserName from "./UserName";

const Comment = ({comment, createdAt, userName, avatar, isVerified}) => {
    // const [liked, setLiked] = useState(0);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar size="sm" name="Mark Zuckerberg" src={avatar} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Flex>
                    <UserName isVerified={isVerified} fontSize="sm" userName={userName} />
                </Flex>
                <Flex gap={2}>
                    <Text fontSize={"sm"} color={"gray.light"}>{createdAt}d</Text>
                    {/* <BsThreeDots /> */}
                </Flex>
            </Flex>
            <Text>{comment}</Text>
            {/* <Actions liked={liked} setLiked={setLiked}/>
            <UserLikesAndReplies likes={likes + (liked ? 1 : 0)} fontSize="sm" /> */}
        </Flex>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;