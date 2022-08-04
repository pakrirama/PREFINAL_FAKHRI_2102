import React from "react";
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
  Center,
  Link,
  useToast,
  FormHelperText,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import LinkNext from "next/link";

import { FcGoogle } from "react-icons/fc";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/router";
import * as Yup from "yup";
import jsCookie from "js-cookie";

export const RegisterForm = (props) => {
  const router = useRouter();
  const [changeForm, setChangeForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Input proper email")
        .required("Email is required"),
      username: Yup.string()
        .required("Username is required")
        .min(8, "username min 8 characters")
        .trim("Username must not include spaces"),
      name: Yup.string()
        .required("Fullname is required")
        .min(6, "username min 6 characters"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      const formData = new FormData();
      const { email, name, username, password, confirmPassword } =
        formik.values;

      formData.append("email", email);
      formData.append("name", name);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append(
        "avatar",
        `http://eu.ui-avatars.com/api/?name=${name}&size=250`
      );

      try {
        const res = await axios.post(
          "http://localhost:3333/api/v1/register",
          formData
        );
        jsCookie.set("vertoken_key", res.data.verToken.refreshToken);

        if (res.status != 201) {
          throw new Error(res.message);
        }

        const result = res.data.result;
        toast({
          title: `User ${result.name} Signed Up!!!`,
          status: "success",
          isClosable: true,
        });

        props.toggleForm();
      } catch (err) {
        console.log(err.response.data.error.messages.errors[0].message);
        toast({
          title: err.response.data.error.messages.errors[0].message,
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
        <Stack align={"center"} pb={4} px={6}>
          <Image alt={"text logo"} src={"/text_logo.png"} width={200} />
          <Heading fontSize={{ xl: "xl", md: "lg" }} textAlign="center">
            <Text>Sign up to see photos and videos from your friends</Text>.
          </Heading>
          {/* Google */}
          <Button w={"full"} variant={"outline"} leftIcon={<FcGoogle />}>
            <Center>
              <Text>Sign up with Google</Text>
            </Center>
          </Button>
        </Stack>
        {/* FORM */}
        <Stack spacing={2}>
          <FormControl id="email" isInvalid={formik.errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              onChange={(e) => {
                formik.setFieldValue("email", e.target.value);
              }}
            />
            <FormHelperText color="red">{formik.errors.email}</FormHelperText>
          </FormControl>
          <FormControl id="name" isInvalid={formik.errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              type="text"
              onChange={(e) => {
                formik.setFieldValue("name", e.target.value);
              }}
            />
            <FormHelperText color="red">{formik.errors.name}</FormHelperText>
          </FormControl>
          <FormControl id="email" isInvalid={formik.errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              onChange={(e) => {
                formik.setFieldValue("username", e.target.value);
              }}
            />
            <FormHelperText color="red">
              {formik.errors.username}
            </FormHelperText>
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
            <FormHelperText color="red">
              {formik.errors.password}
            </FormHelperText>
          </FormControl>
          <FormControl
            id="confirmPassword"
            isInvalid={formik.errors.confirmPassword}
          >
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword2 ? "text" : "password"}
                onChange={(e) => {
                  formik.setFieldValue("confirmPassword", e.target.value);
                }}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword2((showPassword2) => !showPassword2)
                  }
                >
                  {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText color="red">
              {formik.errors.confirmPassword}
            </FormHelperText>
          </FormControl>
          <Stack spacing={10} pt={8}>
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
                  formik.values.username.length &&
                  formik.values.email.length &&
                  formik.values.name.length &&
                  formik.values.confirmPassword.length &&
                  formik.values.password.length
                    ? false
                    : true
                }
              >
                Sign Up
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
          Have an account?{" "}
          <Link color={"blue.400"} onClick={props.toggleForm}>
            Sign In
          </Link>
        </Text>
      </Box>
    </>
  );
};
