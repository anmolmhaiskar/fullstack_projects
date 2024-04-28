import { AddIcon } from "@chakra-ui/icons";
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postText, setPostText] = useState("");
    const imageRef = useRef(null);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const [loading, setLoading] = useState(false);
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const MAX_CHAR = 500;

    const initializePost = () => {
        setPostText("");
        setImgUrl("");
    }

    const handleTextChange = (event) => {
        try {
            if (postText.length >= MAX_CHAR) {
              const truncatedText = postText.slice(0, MAX_CHAR);
              setPostText(truncatedText);
            } else {
                setPostText(event.target.value);
            }
        } catch (error) {
            showToast("Error", error, "error");
        }
    }
    
    const handleCreatePost = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/posts/create", {
              method: "Post",
              headers : {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({postedBy: user._id, text: postText, img: imgUrl}),
            });
            const data = await res.json();
            if(data.error){
              showToast("Error", data.error, "error");
              return;
            }
            showToast("Success", "Post Created Successfully!", "success");
            onClose();
        } catch (error) {
            showToast("Error", error, "error");
        } finally {
            setLoading(false);
        }
    };
    return (
      <>
        <Button
          position={"fixed"}
          bottom={10}
          right={10}
          leftIcon={<AddIcon />}
          bg={useColorModeValue("gray.300", "gray.dark")}
          onClick={() => {
            initializePost();
            onOpen();
        }}
        >
          Post
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <Textarea
                  placeholder="Post content goes here.."
                  onChange={handleTextChange}
                  value={postText}
                />
                <Text
                  fontSize={"xs"}
                  fontWeight={"bold"}
                  textAlign={"right"}
                  m={1}
                >
                  {MAX_CHAR - postText.length}/{MAX_CHAR}
                </Text>

                <Input
                  type="file"
                  hidden
                  ref={imageRef}
                  onChange={handleImageChange}
                />
                <BsFillImageFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={20}
                  onClick={() => imageRef.current.click()}
                />
              </FormControl>
              {imgUrl && (
                <Flex mt={5} w={"full"} position={"relative"}>
                  <Image src={imgUrl} alr="selected ing" />
                  <CloseButton
                    bg={"gray.800"}
                    position={"absolute"}
                    top={2}
                    right={2}
                    onClick={() => setImgUrl("")}
                  />
                </Flex>
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
                Post
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default CreatePost;