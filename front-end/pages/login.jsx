import { Flex, Image, Stack, Show, Spinner } from "@chakra-ui/react";
import LoginForm from "../components/Authentication/LoginForm";
import { RegisterForm } from "../components/Authentication/RegisterForm";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Router from "next/router";
import { ForgetPasswordForm } from "../components/Authentication/ForgetPasswordForm";

export default function SplitScreen() {
  // const userSelector = useSelector((state) => state);
  const userSelector = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(userSelector);
    if (userSelector?.id) {
      // setIsLoading(true);
      Router.push("/home");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  const [changeForm, setChangeForm] = useState("login");

  const setForm = () => {
    if (changeForm === "register") {
      return <RegisterForm toggleForm={() => setChangeForm("login")} />;
    } else if (changeForm === "login") {
      return (
        <LoginForm
          toggleForm={() => setChangeForm("register")}
          forgetPasswordForm={() => setChangeForm("password")}
        />
      );
    } else if (changeForm === "password") {
      return <ForgetPasswordForm toggleForm={() => setChangeForm("login")} />;
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
          <Show above="md">
            <Flex
              flex={1}
              alignItems="center"
              justifyContent={{ xl: "end", sm: "center" }}
            >
              <Image
                alt={"Login Image"}
                src={"/outstagram.png"}
                height={"60vh"}
                minWidth="96"
              />
            </Flex>
          </Show>
          <Flex flex={1} justifyContent={"center"} alignItems="center">
            <Stack spacing={2} mx={"auto"} py={12} px={6}>
              <>{setForm()}</>
            </Stack>
          </Flex>
        </Stack>
      )}
    </>
  );
}
