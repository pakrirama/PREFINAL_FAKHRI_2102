import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  FormControl,
  Input,
  FormLabel,
  Checkbox,
  Center,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  FormHelperText,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import LinkNext from "next/link";

import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import jsCookie from "js-cookie";

import { useFormik } from "formik";
import * as Yup from "yup";
import Router from "next/router";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

function LoginForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  // const stateAuth = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  const stateAuth = useSelector((state) => state.authReducer);

  const formik = useFormik({
    initialValues: {
      uid: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      uid: Yup.string().required("user/email harus diisi"),
      password: Yup.string().required("password harus diisi"),
    }),

    onSubmit: async () => {
      const formData = new FormData();
      const { uid, password } = formik.values;

      formData.append("uid", uid);
      formData.append("password", password);

      try {
        await axios
          .post("http://localhost:3333/api/v1/login", formData)
          .then((res) => {
            if (res.status == 400) {
              throw new Error(res.message);
            }
            toast({
              title: "User Logged In!!!",
              status: "success",
              isClosable: true,
            });

            const userData = res.data.result.userModel;
            const token = res.data.result.jwt.token;

            if (!res.data.result) {
              throw new Error("User not found");
            }

            jsCookie.set("outstagram_token", token);

            dispatch({
              type: "AUTH_LOGIN",
              payload: userData,
            });
            Router.push("/home");
          });
      } catch (err) {
        console.log(err);
        console.log("asdas");

        toast({
          title: err.response.data.error.responseText.split(":")[1],
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  return (
    <>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"2xl"}
        p={8}
        width={"md"}
      >
        <Stack align={"center"} pb={12} px={6}>
          <Image alt={"text logo"} src={"/text_logo.png"} width={200} />
          <Heading fontSize={{ xl: "2xl", md: "xl" }} pb={6} textAlign="center">
            Sign in to your account
          </Heading>
          <Text
            fontSize={{ xl: "xl", md: "sm" }}
            color={"gray.600"}
            textAlign="center"
          >
            to enjoy all of our cool
            <LinkNext href="/login" color={"blue.400"}>
              features
            </LinkNext>
          </Text>
        </Stack>
        <Stack spacing={4}>
          <Button w={"full"} colorScheme={"facebook"} leftIcon={<FaFacebook />}>
            <Center>
              <Text>Continue with Facebook</Text>
            </Center>
          </Button>

          {/* Google */}
          <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />}>
            <Center>
              <Text>Sign in with Google</Text>
            </Center>
          </Button>
          <FormControl id="uid">
            <FormLabel>Email address / Username</FormLabel>
            <Input
              type="text"
              onChange={(e) => {
                formik.setFieldValue("uid", e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password" isInvalid={formik.errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value);
                }}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Stack spacing={10}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              <Checkbox>Remember me</Checkbox>
              <Link onClick={props.forgetPasswordForm} color={"blue.400"}>
                Forgot password?
              </Link>
            </Stack>
            <LinkNext href="/login">
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                width="100%"
                onClick={formik.handleSubmit}
                disabled={
                  formik.values.uid.length && formik.values.password.length
                    ? false
                    : true
                }
              >
                Sign in
              </Button>
            </LinkNext>
          </Stack>
        </Stack>
      </Box>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"2xl"}
        p={4}
      >
        <Text
          fontSize={{ xl: "lg", md: "sm" }}
          color={"gray.600"}
          textAlign="center"
        >
          Don't Have an account?{" "}
          <Link color={"blue.400"} onClick={props.toggleForm}>
            Sign Up
          </Link>
        </Text>
      </Box>
    </>
  );
}

export default LoginForm;
