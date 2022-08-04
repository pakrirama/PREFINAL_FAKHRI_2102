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
  Text,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../lib/api";
import renderReducer from "../../../redux/reducer/renderReducer";

const EditCaption = (props) => {
  // const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast();
  const renderSelector = useSelector((state) => state.renderReducer);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      caption: `${props.postCaption}`,
    },
    onSubmit: async () => {
      const formData = new FormData();
      const { caption } = formik.values;

      formData.append("caption", caption);
      try {
        const res = await axiosInstance.patch(
          `/post/${props.postId}`,
          formData
        );
        const data = res.data.editedPost[0];
        console.log("EDIT");
        console.log(data);

        if (data) {
          // alert("dispatch set");
          dispatch({
            type: "SET_CAPTION",
            payload: {
              value: data,
            },
          });
        }

        toast({
          title: "Post has been edited",
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
    },
  });

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EditCaption</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Input
              defaultValue={props.postCaption}
              onChange={(e) => {
                formik.setFieldValue("caption", e.target.value);
              }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => {
              formik.handleSubmit();
              props.onToggleClick();
            }}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
};

export default EditCaption;
