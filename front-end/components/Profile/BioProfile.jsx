import React from "react";

import {
  Box,
  Image,
  Button,
  HStack,
  Text,
  Stack,
  Show,
  Spinner,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";
import NextLink from "next/link";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../lib/api";
import { Router } from "next/router";

export const BioProfile = (props) => {
  const userSelector = useSelector((state) => state.authReducer);
  return (
    <HStack px={{ md: "10" }} py={2}>
      <Show breakpoint="(max-width: 400px)" above="md">
        <Image
          borderRadius="full"
          boxSize={{ base: "100", md: "150", lg: "200" }}
          src={props.userAvatar}
          alt="Avatar"
        />
      </Show>
      <Box boxSize="full" padding={{ md: "4" }}>
        <Stack gap={4}>
          <Show breakpoint="(max-width: 400px)" above="md">
            <HStack gap={4}>
              <Text fontSize={{ sm: "xl", md: "2xl" }} fontWeight="bold">
                {props.UserName}
              </Text>
              {userSelector.id === props.userId ? (
                <>
                  <NextLink href="setting">
                    <Button size="sm">Edit Profile</Button>
                  </NextLink>
                  <FiSettings size="22px" />
                </>
              ) : null}
            </HStack>
          </Show>
          <HStack gap={4}>
            <Show breakpoint="(max-width: 400px)" below="md">
              <Image
                borderRadius="full"
                boxSize={"85px"}
                src={props.userAvatar}
                alt="Avatar"
              />
            </Show>
            <Text fontSize="lg">posts</Text>
            <Text fontSize="lg">followers</Text>
            <Text fontSize="lg">followings</Text>
          </HStack>
          <Box>
            <Text fontSize="lg" fontWeight={"bold"}>
              {props.userName}
            </Text>
            <Text fontSize={{ base: "14px", lg: "16px" }}>{props.userBio}</Text>
            <Show breakpoint="(max-width: 400px)" below="md">
              <HStack gap={4}>
                <Text fontSize={{ sm: "xl" }} fontWeight="bold">
                  username
                </Text>
                {userSelector.id === props.userId ? (
                  <>
                    <NextLink href="setting">
                      <Button size="sm">Edit Profile</Button>
                    </NextLink>
                    <FiSettings size="22px" />
                  </>
                ) : (
                  <Spinner />
                )}
              </HStack>
            </Show>
          </Box>
        </Stack>
      </Box>
    </HStack>
  );
};
