import { Avatar } from "@chakra-ui/react";

const UserLikesAvatar = (props) => {
  return (
    <Avatar
      size={props.size}
      name={props.name}
      src={props.src}
      position={props.position}
      top={props.top}
      left={props.left}
      right={props.right}
      padding={props.padding}
      bottom={props.bottom}
    />
  );
};

export default UserLikesAvatar;