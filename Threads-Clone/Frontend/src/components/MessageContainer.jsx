import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import messageNotificationAudio from "../../assets/audios/messageNotificationAudio.mp3";
import onFocusNotificationAudio from "../../assets/audios/onFocusNotificationAudio.mp3";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import useShowToast from "../hooks/useShowToast";
import Message from "./Message";
import MessageInput from "./MessageInput";

const MessageContainer = () => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const scrollToEndRef = useRef(null);
    const {socket} = useSocket();
    const setConversations = useSetRecoilState(conversationsAtom);

    useEffect(() => {
      const getMessages = async () => {
        try {
          setMessages([]);
          if (selectedConversation.mock) {
            return;
          }
          setLoadingMessages(true);
          const res = await fetch(
            `/api/messages/${selectedConversation.userId}`
          );
          const data = await res.json();

          if (data.error) {
            showToast("Error", "Message not found", "error");
            return;
          }
          setMessages(data);
        } catch (error) {
          showToast("Error", error, "error");
        } finally {
          setLoadingMessages(false);
        }
      };
      getMessages();
    }, [showToast, selectedConversation.userId, selectedConversation.mock]);

    useEffect(()=>{
      const isLastMessageSeen = messages.length && messages[messages.length-1].sender !== currentUser._id && !messages[messages.length-1]?.seen;
      if(isLastMessageSeen){
        socket.emit("markMessagesAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId,
        });
      }

      socket.on("messagesSeen", ({conversationId}) => {
        setMessages( (prevMessages) => {
          const updatedMessages = prevMessages.map(message => {
            if(message.conversation === conversationId){
              return {
                ...message,
                seen: true
              }
            }
            return message;
          });
          return updatedMessages;
        });
      });
    }, [currentUser._id, messages, selectedConversation, socket]);

    useEffect(()=> {
      scrollToEndRef.current?.scrollIntoView({ behavior: "smooth"});
    },[messages]);

    useEffect(()=>{
      socket?.on("newMessage", (newMessage) => {
        if (newMessage.conversation === selectedConversation._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        let notificationSound;
        if(!document.hasFocus()){
          notificationSound = new Audio(messageNotificationAudio);
        } else {
          notificationSound = new Audio(onFocusNotificationAudio);
        }
        notificationSound.play();
        
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conversation) => {
            if(conversation._id === newMessage.conversation){
              return {...conversation,
              lastMessage: {
                sender: newMessage.sender,
                text: newMessage.text
              }
              }
            }
            return conversation;
          });
          return updatedConversations;
        });
      });

      return () => socket.off("newMessage");
    }, [socket, selectedConversation._id, setConversations]);

    return (
      <Flex flex={70} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} flexDirection={"column"} p={2}>
        {/* Message Header */}
        <Flex w={"full"} h={12} alignContent={"center"} gap={2} p={2}>
          <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation.username}{" "}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Divider mt={1} />
        <Flex flexDirection={"column"} p={2} gap={4} my={4} height={"400px"} overflowY={"auto"} >
          {loadingMessages &&
            [...Array(5)].map((_, i) => (
              <Flex key={i} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}>
                {i % 2 === 0 && <SkeletonCircle size={7} m={2} />}
                <Flex flexDirection={"column"} gap={2}>
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                  <Skeleton h="8px" w="250px" />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} m={2} />}
              </Flex>
            ))}

          {!loadingMessages &&
            messages.map((message) => (
              <Flex key={message._id} direction={"column"} ref={messages.length-1 === messages.indexOf(message) ? scrollToEndRef: null}>
                <Message
                  message={message}
                  ownMessage={currentUser._id === message.sender}
                />
              </Flex>
            ))}
        </Flex>
        <MessageInput setMessages={setMessages} />
      </Flex>
    );
}

export default MessageContainer;