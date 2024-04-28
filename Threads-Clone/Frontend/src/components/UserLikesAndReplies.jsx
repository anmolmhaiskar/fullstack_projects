import { Box, Flex, Text } from "@chakra-ui/react";

const UserLikesAndReplies = (props) => {
  return (
    <Flex gap={2} alignItems={"center"}>
      <Text color={"gray.light"} fontSize={"sm"}>
        {props.likes} Likes
      </Text>
      <Box w="0.5" h="0.5" bg={"gray.light"} borderRadius={"full"}></Box>
      <Text color={"gray.light"} fontSize={props.fontSize}>
        {props.replies} Replies
      </Text>
    </Flex>
  );
}

export default UserLikesAndReplies