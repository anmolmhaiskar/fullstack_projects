import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, WrapItem, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const Conversation = ({conversation, isOnline}) => {
    const user = conversation?.participants[0];
    const lastMessage = conversation?.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const {colorMode} = useColorMode();

  return (
    <Flex gap={4} alignItems={"center"} p={2} 
        _hover={{
            cursor: "pointer",
            bg: useColorModeValue("gray.600", "gray.dark"),
            color: "white"
        }}
        borderRadius={"md"}
        onClick={() => setSelectedConversation({
            _id: conversation._id,
            userId: user._id,
            username: user.username,
            userProfilePic: user.profilePic,
            mock: conversation.mock,
        })}
        bg={selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400" : "gray.dark") : ""}
    >
        <WrapItem>
            <Avatar size={{
                base: "xs",
                sm: "sm",
                md: "sm"
            }} src={!user.profilePic ? "https://bit.ly/broken-link" : user.profilePic} >
                {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
            </Avatar>
        </WrapItem>
        
        <Stack direction={"column"} fontSize={"sm"}>
            <Text fontSize="xs" fontWeight="700" display={"flex"} alignItems={"center"}>
                {user.username} <Image src="/verified.png" w={4} h={4} ml={1}/>
            </Text>
            <Text fontSize="xs" display={"flex"} alignItems={"center"}>
                {currentUser?._id === lastMessage?.sender && (
                    <Box color={lastMessage.seen? "blue.400" : ""}>
                        <BsCheck2All />
                    </Box>
                )}
                {lastMessage.text.length > 18 ? lastMessage.text.substring(0, 18) + "..." : lastMessage.text || <BsFillImageFill size={16}/>}
            </Text>
        </Stack>
    </Flex>
  )
}

export default Conversation;