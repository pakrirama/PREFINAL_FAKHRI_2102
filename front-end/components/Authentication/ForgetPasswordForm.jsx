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
  Link,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";

import LinkNext from "next/link";

import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import jsCookie from "js-cookie";

export const ForgetPasswordForm = (props) => {
  const router = useRouter();

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Input proper email")
        .required("Email is required"),
    }),
    validateOnChange: false,

    onSubmit: async () => {
      const formData = new FormData();
      const { email } = formik.values;

      formData.append("email", email);
      formData.append("rpKey", jsCookie.get("rp_key"));

      try {
        const res = await axios.post(
          "http://localhost:3333/api/v1/verify/password",
          formData
        );
        jsCookie.set("rp_key", res.data.token.refreshToken);

        if (res.status != 200) {
          throw new Error(res.message);
        }

        const result = res.data.result;
        toast({
          title: `Check your email!`,
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
            <Text>Forget Password</Text>.
          </Heading>
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

          <Stack spacing={10} pt={8}>
            <LinkNext href="/login">
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                width="100%"
                onClick={() => {
                  formik.handleSubmit();
                }}
                disabled={formik.values.email.length ? false : true}
              >
                Reset Password
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
