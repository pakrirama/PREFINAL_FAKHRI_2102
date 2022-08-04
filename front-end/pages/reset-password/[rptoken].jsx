import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  createIcon,
  useToast,
  Spinner,
  Image,
  FormControl,
  Input,
  FormLabel,
  Link,
  FormHelperText,
  Flex,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import * as Yup from "yup";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import LinkNext from "next/link";
import axios from "axios";
import jsCookie from "js-cookie";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const resetPassword = () => {
  const router = useRouter();
  const { rptoken } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
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
      const { password, confirmPassword } = formik.values;

      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      try {
        const res = await axios.patch(
          "http://localhost:3333/api/v1/reset/password/" + rptoken,
          formData,
          {
            headers: {
              authorization: "Bearer " + rptoken,
            },
          }
        );

        jsCookie.remove("rp_key");
        console.log("rptoken " + rptoken);
        if (res.status != 200) {
          throw new Error(res.message);
        }

        toast({
          title: `Password Changed`,
          status: "success",
          isClosable: true,
        });
      } catch (err) {
        const errors = err.response.data.error;
        toast({
          title: errors,
          status: "error",
          isClosable: true,
        });
      }
      formik.setSubmitting(false);
      formik.resetForm("password", "");
      formik.resetForm("confirmPassword", "");
    },
  });

  return (
    <>
      <>
        <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
          <Flex flex={1} justifyContent={"center"} alignItems="center">
            <Stack spacing={2} mx={"auto"} py={12} px={6}>
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
                    <Text>Reset Password</Text>.
                  </Heading>
                </Stack>
                {/* FORM */}
                <Stack spacing={2}>
                  <FormControl id="password" isInvalid={formik.errors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
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
                        value={formik.values.confirmPassword}
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "confirmPassword",
                            e.target.value
                          );
                        }}
                      />
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          onClick={() =>
                            setShowPassword2((showPassword2) => !showPassword2)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormHelperText color="red">
                      {formik.errors.confirmPassword}
                    </FormHelperText>
                  </FormControl>

                  <Stack spacing={10} pt={8}>
                    {/* <LinkNext href="/login"> */}

                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      // disabled={invalidToken ? true : false}
                      width="100%"
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                    >
                      Reset Password
                    </Button>
                    {/* </LinkNext> */}
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
                  <Link color={"blue.400"}>Sign In</Link>
                </Text>
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </>
    </>
  );
};

const Arrow = createIcon({
  displayName: "Arrow",
  viewBox: "0 0 72 24",
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
});
export default resetPassword;
