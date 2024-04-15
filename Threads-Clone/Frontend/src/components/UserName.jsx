import { Image, Text } from "@chakra-ui/react";

const UserName = (props) => {
  return (
    <>
        <Text fontSize={props.fontSize} fontWeight={"bold"}>
            {props.userName}
        </Text>
        {
            props.isVerified ? <Image src="/verified.png" w={4} h={4} ml={1} /> : ''
        }
    </>
  );
};

export default UserName;