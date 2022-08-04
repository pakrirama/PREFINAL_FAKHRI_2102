import React from "react";
import Header from "../Header";
import { Box, Center } from "@chakra-ui/react";

export const Layout = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      <Center maxW={"5xl"} marginX={"auto"}>
        <Box pt={16} w="full">
          {children}
        </Box>
      </Center>
      {/* <Footbar /> */}
    </>
  );
};
