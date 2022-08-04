import {
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Text,
  Avatar,
  useDisclosure,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
} from "@chakra-ui/react";

import { FaHeart, FaRegBookmark } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineCompass, AiOutlineUserSwitch } from "react-icons/ai";
import { SiMessenger } from "react-icons/si";
import { HiHome, HiOutlineHome } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

import NextLink from "next/link";
import { useRouter } from "next/router";

import jsCookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";

import React from "react";
import UploadModal from "./uploadModal";
// import UploadModal from "./uploadModal";

function Utility(props) {
  const userSelector = useSelector((state) => state.authReducer);
  // console.log(userSelector);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const router = useRouter();

  function btnlogout() {
    jsCookie.remove("outstagram_token");
    jsCookie.remove("outstagram_refreshToken");

    dispatch({
      type: "AUTH_LOGOUT",
    });

    router.push("/login");
  }
  return (
    <Stack direction={"row"} spacing={4} alignItems="center">
      <NextLink href="/home">
        <Button>
          {router.pathname == "/home" ? (
            <HiHome size={"22px"} />
          ) : (
            <HiOutlineHome size={"22px"} />
          )}
        </Button>
      </NextLink>
      <SiMessenger size={"22px"} />
      <UploadModal />
      <AiOutlineCompass size={"25px"} />
      <Popover offset={[-40, 0]} m={0}>
        <PopoverTrigger>
          <Button px={0}>
            <FaHeart />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Confirmation!</PopoverHeader>
          <PopoverBody>
            Are you sure you want to have that milkshake?
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Menu placement="bottom-end">
        <MenuButton
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
        >
          <Avatar size={"sm"} src={userSelector?.avatar} />
        </MenuButton>
        <MenuList alignItems={"center"}>
          <NextLink href={`/profile/${userSelector.username}`}>
            <MenuItem gap={2}>
              <CgProfile />
              Profile
            </MenuItem>
          </NextLink>
          <NextLink href="/profile/liked">
            <MenuItem gap={2} onClick={props.toggleForm}>
              <FaRegBookmark />
              Saved
            </MenuItem>
          </NextLink>
          <NextLink href="/setting">
            <MenuItem gap={2}>
              <FiSettings />
              Setting
            </MenuItem>
          </NextLink>
          <MenuItem gap={2}>
            <AiOutlineUserSwitch />
            Switch Account
          </MenuItem>
          <MenuDivider />

          <MenuItem onClick={btnlogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Stack>
  );
}

export default Utility;
