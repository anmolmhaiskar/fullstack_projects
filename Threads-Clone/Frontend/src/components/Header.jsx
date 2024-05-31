import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { BiHomeAlt2 } from "react-icons/bi";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  const user = useRecoilValue(userAtom);
  
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <BiHomeAlt2 size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {user && (
        <Link as={RouterLink} to={`/${user.username}`}>
          <RxAvatar size={24} />
        </Link>
      )}
      {/* <Flex position={"absolute"} right={10} marginRight={30}>
          {user && (
            <Link as={RouterLink} to="/">
              <BsFillChatQuoteFill size={24} />
            </Link>
          )}
        </Flex> */}
    </Flex>
  );
}

export default Header;