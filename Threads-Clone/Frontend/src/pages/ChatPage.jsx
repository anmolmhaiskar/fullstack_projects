import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiConversation } from "react-icons/gi";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";

const ChatPage = () => {
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);
    const { socket, onlineUsers } = useSocket();

    useEffect(() => {
        const getConversations = async ()=> {
            try {
                setIsLoadingConversation(true);
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (!data) {
                  showToast("Error", "No conversations found", "error");
                  return;
                }
                setConversations(data);
            } catch (error) {
                showToast("Error", error, "error");
            } finally {
                setIsLoadingConversation(false);
            }
        }
        getConversations();
    }, [showToast, setConversations]);

    useEffect(() => {
      socket?.on("messagesSeen", ({conversationId}) => {
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map(conversation => {
            if(conversation._id === conversationId){
              return {
                ... conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true
                }
              }
            }
            return conversation;
          });
          return updatedConversations;
        });
      });
    }, [setConversations, socket]);

    const handleSearchConversation = async (event)=>{
        try {
            event.preventDefault();
            setSearchingUser(true);
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();
            if(searchedUser.error){
                showToast("Error", searchedUser.error, "error");
                return;
            }
            
            if(searchedUser._id === currentUser._id){
                showToast("Error", "You cannot message yourself", "error");
                return;    
            }

            const conversationAlreadyExist = conversations.find( conversation => {
                return conversation.participants[0]._id == searchedUser._id;
            });
            if (conversationAlreadyExist) {
              setSelectedConversation({
                _id: conversationAlreadyExist._id,
                userId: searchedUser._id,
                username: searchedUser.username,
                userProfilePic: searchedUser.profilePic,
              });
              return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    sender: "",
                    text: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    },
                ],
            };

            setConversations((prevConv) => [...prevConv, mockConversation]);
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setSearchingUser(false);
        }
    }
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleSearchConversation}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <Button size={"sm"} isLoading={searchingUser}>
                <SearchIcon onClick={handleSearchConversation} />
              </Button>
            </Flex>
          </form>

          {/* TODO: create a shimmer UI component and use that here */}
          <Flex maxH={"400px"} flexDirection={"column"} overflowY={"auto"}>
            {isLoadingConversation
              ? [0, 1, 2, 3, 4].map((_, i) => (
                  <Flex
                    key={i}
                    gap={4}
                    alignItems={"center"}
                    p={"1"}
                    borderRadius={"md"}
                  >
                    <Box>
                      <SkeletonCircle size={"10"} />
                    </Box>
                    <Flex w={"full"} flexDirection={"column"} gap={3}>
                      <Skeleton h={"10px"} w={"80px"} />
                      <Skeleton h={"8px"} w={"90%"} />
                    </Flex>
                  </Flex>
                ))
              : conversations.map((conversation) => (
                  <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                  />
                ))}
          </Flex>
        </Flex>

        {!selectedConversation?._id ? (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a Conversation to start messaging</Text>
          </Flex>
        ) : (
          <MessageContainer />
        )}
      </Flex>
    </Box>
  );
}

export default ChatPage;