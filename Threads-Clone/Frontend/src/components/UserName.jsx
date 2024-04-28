import { Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const UserName = (props) => {
  const navigate = useNavigate();
  
  return (
    <>
      <Text
        fontSize={props.fontSize}
        fontWeight={"bold"}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/${props.userName}`);
        }}
      >
        {props.userName}
      </Text>
      {props.isVerified ? <Image src="/verified.png" w={4} h={4} ml={1} /> : ""}
    </>
  );
};

export default UserName;