import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Textarea,
  FormHelperText,
  useDisclosure,
  Modal,
  useToast,
  Text,
} from "@chakra-ui/react";

import { AiOutlineClose } from "react-icons/ai";
import { axiosInstance } from "../../lib/api";
import UplaodAvatar from "./UploadAvatar";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import renderReducer from "../../redux/reducer/renderReducer";
import { Router, useRouter } from "next/router";
import { BiCheckShield } from "react-icons/bi";
import jsCookie from "js-cookie";

const ProfileSetting = () => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const userSelector = useSelector((state) => state.authReducer);
  const renderSelector = useSelector((state) => state.renderReducer);
  const [userData, setUserData] = useState([]);

  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/user`);
      const data = res.data.user;
      setUserData(data);
      console.log("fetchuser()");
    } catch (error) {
      console.log(error);
    }
  };

  const { name, username, bio, email, avatar } = userData;
  const formik = useFormik({
    initialValues: {
      name,
      username,
      bio,
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { name, username, bio } = formik.values;

      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      try {
        const res = await axiosInstance.patch(`/user`, formData);
        if (res.status != 200) {
          const errors = res.response.data.error.messages.errors[0].message;
          toast({
            title: errors,
            status: "error",
            isClosable: true,
          });
          return;
        }
        dispatch({
          type: "FETCH_DATA",
          payload: {
            setting: !renderSelector.setting,
          },
        });
        toast({
          title: "User Updated",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: `Error `,
          status: "error",
          isClosable: true,
        });
      }

      formik.setSubmitting(false);
    },
  });

  const handleSubmit = () => {
    formik.setFieldValue("name", document.querySelector("#name").value);
    formik.setFieldValue("username", document.querySelector("#username").value);
    formik.setFieldValue("bio", document.querySelector("#bio").value);
    formik.handleSubmit();
  };

  const sendUserVerification = async () => {
    const vertokenKey = new FormData();
    vertokenKey.append("vertokKey", jsCookie.get("vertoken_key"));
    try {
      const res = await axiosInstance.post("/verify/user", vertokenKey);

      jsCookie.set("vertoken_key", res.data.token.refreshToken);
      toast({
        title: "Check your email",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [renderSelector.setting]);

  return (
    <Stack spacing={4} bg={useColorModeValue("white", "gray.700")} p={6}>
      <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
        Profile Setting
      </Heading>
      <FormControl id="userName">
        <Stack direction={["column", "row"]} spacing={6} align="center">
          <Center>
            <Avatar size="xl" src={avatar}>
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="red"
                aria-label="remove Image"
                icon={<AiOutlineClose />}
              />
            </Avatar>
          </Center>
          <Button onClick={onToggle} borderWidth={2}>
            Change Avatar
          </Button>
          {!userSelector.is_verified ? (
            <Button
              onClick={sendUserVerification}
              borderWidth={2}
              colorScheme="blue"
            >
              Send Verification
            </Button>
          ) : (
            <BiCheckShield size={"30px"} color="blue"></BiCheckShield>
          )}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <UplaodAvatar onToggle={onToggle} />
          </Modal>
        </Stack>
      </FormControl>
      <FormControl id="name" isRequired>
        <FormLabel>Full name</FormLabel>
        <Input
          defaultValue={name}
          placeholder="Full Name"
          _placeholder={{ color: "gray.500" }}
          type="text"
        />
        <FormHelperText>
          Help people discover your account by using the name that you're known
          by: either your full name, nickname or business name. You can only
          change your name twice within 14 days
        </FormHelperText>
      </FormControl>
      <FormControl id="username" isRequired>
        <FormLabel>User name</FormLabel>
        <Input
          defaultValue={username}
          placeholder="Username"
          _placeholder={{ color: "gray.500" }}
          type="text"
        />
        <FormHelperText>
          In most cases, you'll be able to change your username back to
          pakrirama for another 14 days. Learn more
        </FormHelperText>
      </FormControl>
      <FormControl id="bio" isRequired>
        <FormLabel>Bio</FormLabel>
        <Textarea
          defaultValue={bio}
          placeholder="Bio"
          _placeholder={{ color: "gray.500" }}
          type="text"
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormHelperText fontWeight={"bold"}>
          Personal information
        </FormHelperText>
        <FormHelperText>
          Provide your personal information, even if the account is used for a
          business, pet or something else. This won't be part of your public
          profile.
          <FormLabel mt={4}>Email address</FormLabel>
        </FormHelperText>
        <Input
          defaultValue={email}
          placeholder="your-email@example.com"
          _placeholder={{ color: "gray.500" }}
          type="email"
          disabled
        />
      </FormControl>

      <Stack spacing={6} direction={["column", "row"]} justify="end">
        <Button
          bg={"red.400"}
          color={"white"}
          _hover={{
            bg: "red.500",
          }}
          onClick={router.back}
        >
          Exit
        </Button>
        <Button
          bg={"blue.400"}
          color={"white"}
          _hover={{
            bg: "blue.500",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProfileSetting;
