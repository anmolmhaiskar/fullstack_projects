import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsCheck2All } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";

const Message = ({message, ownMessage}) => {
      const selectedConversation = useRecoilValue(selectedConversationAtom);
      const currentUser = useRecoilValue(userAtom);
      const [isImgLoaded, setIsImgLoaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex alignSelf={"flex-end"}>
          <Flex pr={2}>
            {message.text && (
              <Flex maxW={"350px"} bg={"green.800"} p={1} borderRadius={"md"}>
                <Text color={"white"}>{message.text}</Text>
                <Box
                  alignSelf={"flex-end"}
                  ml={1}
                  color={message.seen ? "blue.400" : ""}
                  fontWeight={"bold"}
                  >
                  <BsCheck2All size={16} />
                </Box>
              </Flex>
            )}
            {message.img && !isImgLoaded && (
              <Flex mt={5} w={"200px"}>
                <Image src={message.img} alt="Message Image" borderRadius={4} hidden
                  onLoad={() => setIsImgLoaded(true)} />
                <Skeleton w={"200px"} h={"200px"}/>
              </Flex>
            )}

            {message.img && isImgLoaded && (
              <Flex mt={5} w={"200px"}>
                <Image src={message.img} alt="Message Image" borderRadius={4} />
                <Box
                  alignSelf={"flex-end"}
                  ml={1}
                  color={message.seen ? "blue.400" : ""}
                  fontWeight={"bold"}
                >
                  <BsCheck2All size={16} />
                </Box>
              </Flex>
            )}
          </Flex>
          <Flex pl={2}>
            <Avatar src={currentUser.profilePic} w={4} h={4} alignSelf={"flex-end"} />
          </Flex>
        </Flex>
      ) : (
        <Flex gap={1} alignSelf={"flex-start"}>
          <Flex>
            <Avatar src={selectedConversation.userProfilePic} w={4} h={4} alignSelf={"flex-end"} />
          </Flex>
          <Flex>
            
          </Flex>
          {message.text && (
            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"} >
              {message.text}
            </Text>
          )}
          {message.img && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message Image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}

export default Message;