import { useState, useRef } from "react";
import { axiosInstance } from "../../lib/api";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Lorem,
  Button,
  useDisclosure,
  useToast,
  Box,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Center,
  Image,
} from "@chakra-ui/react";

import NextImage from "next/image";
import { useFormik } from "formik";
import jsCookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

const UploadModal = (props) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [selectedFiles, setSelctedFiles] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const inputFileRef = useRef(null);
  const toast = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const userSelector = useSelector((state) => state.authReducer);
  const newPostSelector = useSelector((state) => state.newPostReducer);

  const formik = useFormik({
    initialValues: {
      caption: " ",
      location: " ",
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { caption, location } = formik.values;

      formData.append("caption", caption);
      formData.append("location", location);
      formData.append("image", selectedFiles);
      // formData.append("user_id", 1);

      try {
        const res = await axiosInstance.post("/post", formData);
        const data = res.data.newPost;

        data.like = [];
        console.log(data);

        if (data) {
          dispatch({
            type: "SET_POST",
            payload: {
              value: data,
            },
          });
        }
        toast({
          title: "Post Has been added",
          status: "success",
          isClosable: true,
        });
      } catch (err) {
        console.log(err);
        toast({
          title: `Error ${err.response.data.error}`,
          status: "error",
          isClosable: true,
        });
      }
    },
  });

  const handleFiles = (event) => {
    setSelctedFiles(event.target.files[0]);
    const uploaded = event.target.files[0];
    setPreviewImage(URL.createObjectURL(uploaded));
  };
  return (
    <>
      <Button onClick={onToggle} borderWidth={2} borderColor="black">
        +
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        {userSelector.is_verified ? (
          <>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Image</FormLabel>
                  <Box>
                    <Box w="400" h="300px" rounded="lg">
                      {!previewImage ? (
                        <Box
                          w="400px"
                          h="300px"
                          rounded="lg"
                          bg="blackAlpha.200"
                        />
                      ) : (
                        <Image
                          src={previewImage}
                          objectFit="contain"
                          w="400px"
                          h="300px"
                          rounded="lg"
                          bg="blackAlpha.200"
                        />
                      )}
                    </Box>
                    <Input
                      type={"file"}
                      display={"none"}
                      onChange={handleFiles}
                      accept={("image/png", "image/jpg", "image/jpeg")}
                      ref={inputFileRef}
                      colorScheme={"blue"}
                    ></Input>
                    {!previewImage ? (
                      <Button
                        colorScheme={"blue"}
                        onClick={() => inputFileRef.current.click()}
                        m={2}
                      >
                        Select Image
                      </Button>
                    ) : (
                      <Button
                        m={2}
                        bg={"red.400"}
                        color={"white"}
                        _hover={{
                          bg: "red.500",
                        }}
                        onClick={() => {
                          setPreviewImage(null);
                          setSelctedFiles(null);
                        }}
                      >
                        Disscard
                      </Button>
                    )}
                  </Box>
                </FormControl>
                <FormControl>
                  <FormLabel>Caption</FormLabel>
                  <Input
                    onChange={(e) => {
                      formik.setFieldValue("caption", e.target.value);
                    }}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    onChange={(e) => {
                      formik.setFieldValue("location", e.target.value);
                    }}
                  ></Input>
                </FormControl>
              </ModalBody>

              <ModalFooter gap={2}>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  _hover={{
                    bg: "red.500",
                  }}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    formik.handleSubmit();
                    setPreviewImage(null);
                    // setSelctedFiles(null);
                    onClose();
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </ModalContent>
          </>
        ) : (
          <ModalContent>
            <ModalHeader>Upload Post</ModalHeader>
            <ModalCloseButton />
            <ModalBody>To Access this feauture,please Verify User</ModalBody>

            <ModalFooter gap={2}>
              <Button
                bg={"red.400"}
                color={"white"}
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  router.push("/setting");
                }}
              >
                Setting
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </>
  );
};

export default UploadModal;
