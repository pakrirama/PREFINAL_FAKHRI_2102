import { ReactNode } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Stack,
  Center,
  Image,
  Container,
  Input,
  useColorMode,
} from "@chakra-ui/react";

import Utility from "./utility";
import Router from "next/router";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Stack
        position={"fixed"}
        w="full"
        zIndex={2}
        bg={useColorModeValue("gray.100", "gray.700")}
        align="center"
      >
        {/* <Box px={4}> */}
        {/* <Flex h={16} alignItems={"center"} justifyContent={"space-between"}> */}
        <Flex
          h={16}
          align={"center"}
          justify="space-between"
          w="100%"
          maxW={"5xl"}
        >
          <Image
            alt={"Login Image"}
            src={"/text_logo.png"}
            maxWidth="32"
            onClick={() => Router.push("/home")}
            cursor="pointer"
          />

          <Input
            placeholder="Basic usage"
            size={"md"}
            width="48"
            bg={useColorModeValue("white", "gray.600")}
          />

          <Flex alignItems={"center"}>
            <Utility />
          </Flex>
        </Flex>
        {/* </Box> */}
      </Stack>
    </>
  );
}
