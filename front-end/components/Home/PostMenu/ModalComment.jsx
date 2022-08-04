import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
  Flex,
  Stack,
  Text,
  Input,
  Avatar,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";

import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { FaRegComment } from "react-icons/fa";
import { axiosInstance } from "../../../lib/api";
import { useEffect, useState } from "react";
import PostComment from "./PostComment";
import * as Yup from "yup";

const ModalComment = (props) => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const toast = useToast();
  const renderSelector = useSelector((state) => state.renderReducer);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      comment: " ",
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string().max(300, "Maximum comment character is 300"),
    }),
    validateOnChange: false,
    onSubmit: async () => {
      const formData = new FormData();
      const { comment } = formik.values;

      formData.append("comment", comment);
      try {
        const res = await axiosInstance.post(
          `/post/${props.postId}/comment`,
          formData
        );

        dispatch({
          type: "FETCH_DATA",
          payload: {
            value: !renderSelector.value,
          },
        });
        toast({
          title: "Comment added",
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
      formik.resetForm("comment", "");
      newComment(6);
    },
  });
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [commentData, setCommentData] = useState([]);
  const [commentRender, setCommentRender] = useState(false);

  const newComment = async () => {
    try {
      const res = await axiosInstance.get(
        `/post/${props.postId}/comment?page=${lastPage}`
      );
      const data = res.data.comments.data;
      const meta = res.data.comments.meta;
      const totalData = meta.total;
      console.log("totalData = " + totalData);

      if (totalData % 5 == 0) {
        alert("et");
        setLastPage(meta.last_page + 1);
      }

      const dataFinal = data[data.length - 1];
      if (page) {
      }
      console.log("ini LAST PAGE = " + 1);
      // setPage(meta.current_page + 1);
      console.log(data);
      console.log(dataFinal);

      setCommentRender(!commentRender);
      setCommentData([dataFinal, ...commentData]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComment = async () => {
    try {
      const res = await axiosInstance.get(
        `/post/${props.postId}/comment/?page=${page}`
      );
      const data = res.data.comments.data;
      const meta = res.data.comments.meta;
      const totalData = meta.total;
      console.log("totalData = " + totalData);

      setLastPage(meta.last_page);

      if (!data.length) {
        console.log("finish fetch comment");
        return;
      }
      setPage(meta.current_page + 1);

      setCommentRender(!commentRender);
      setCommentData([...commentData, ...data]);

      console.log(data);
      console.log(commentData);
      console.log("ini page = " + page);
      console.log("ini LAST PAGE = " + meta.last_page_url);
      console.log("loadMoreComment()");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FaRegComment size={"22px"} onClick={onToggle} cursor={"pointer"} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />

        <ModalContent minWidth={"50%"} minHeight={"80%"}>
          <ModalCloseButton size="lg" />

          {/* <Flex flex={1} bg="gray.800">
              <Center>
                <Image maxH="100%" src={props.postImage} objectFit="cover" />
              </Center>
            </Flex> */}
          <ModalHeader bg="blackAlpha.200">
            <Flex align={"center"} gap="2">
              <Avatar
                src={props.avatarComment}
                size="sm"
                borderWidth={2}
                borderColor="blue.500"
              />
              <Text fontSize="md" fontWeight="bold">
                {props.postUsername}
              </Text>
              <Text fontSize="sm">{props.postCaption}</Text>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Flex flex={3} align={"start"}>
              <Stack spacing={2} width="full">
                <PostComment
                  postId={props.postId}
                  // deleteComment={deleteComment}
                  fetchComment={fetchComment}
                  commentRender={commentRender}
                  commentData={commentData}
                  newComment={newComment}
                  setCommentData={setCommentData}
                />
              </Stack>
            </Flex>
          </ModalBody>
          <ModalFooter gap={2}>
            <FormControl>
              <Input
                placeholder="comment"
                bg="white"
                value={formik.values.comment}
                onChange={(e) => {
                  formik.setFieldValue("comment", e.target.value);
                }}
              />
              <FormHelperText color="red">
                {formik.errors.comment}
              </FormHelperText>
            </FormControl>
            <Button colorScheme="blue" mr={3} onClick={formik.handleSubmit}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComment;
