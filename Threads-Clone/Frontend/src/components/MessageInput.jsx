import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const showToast = useShowToast();
  const { onClose } = useDisclosure();
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (event) => {
    if(!messageText && !imgUrl) return;
    if(isSending) return;

    setIsSending(true);
    try {
        event.preventDefault();
        const res = await fetch("api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientId: selectedConversation.userId,
            message: messageText,
            img: imgUrl,
          }),
        });
    
        const data = await res.json();
        if(!data || data.error){
          showToast("Error", data.error, "error");
        }

        setMessages((prevMessages) => [...prevMessages, data]);
    
        setConversations(prevConversations => {
          const updatedConversation = prevConversations.map(conversation => {
            if(conversation._id === selectedConversation._id){
              return {
                ...conversation,
                lastMessage: {
                  sender: data.sender,
                  text: messageText
                }
              }
            }
            return conversation;
          });
          return updatedConversation;
        });
        setMessageText("");
        setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsSending(false);
    }
  }
  

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message..."
            onChange={(event) => setMessageText(event.target.value)}
            value={messageText}
            bg={useColorModeValue("gray.300", "gray.dark")}
          />
          <InputRightElement>
            <IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <ImAttachment size={20} onClick={() => imageRef.current.click()} />
        <Input hidden type={"file"} ref={imageRef} onChange={handleImageChange}/>
        <Modal onClose={()=>{ 
          onClose();
          setImgUrl('');
        }} 
          isOpen={imgUrl} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Attachment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex mt={5} w={'full'}>
                <Image src={imgUrl} alt="Selected Image" />
              </Flex>
            </ModalBody>
            <ModalFooter>
              { !isSending ? ( <IoSendSharp onClick={handleSendMessage} size={26} cursor={"pointer"} /> ) 
              : ( <Spinner size={"md"}/> )
              }
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default MessageInput;