import {
  Box,
  Avatar,
  Text,
  Flex,
  Button,
  Spacer,
  IconButton,
  VisuallyHidden,
  Divider,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../lib/api";
import { FiTrash } from "react-icons/fi";

const PostComment = (props) => {
  const { fetchComment, commentData, setCommentData } = props;
  const renderSelector = useSelector((state) => state.renderReducer);
  const userSelector = useSelector((state) => state.authReducer);
  // const [commentData, setCommentData] = useState([]);
  const dispatch = useDispatch();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [commentRender, setCommentRender] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const deleteComment = async (id, postId) => {
    await axiosInstance
      .delete(`/post/${postId}/comment/${id}`)
      .then((res) => {
        const idxComment = commentData
          .map(function (e) {
            return e.id;
          })
          .indexOf(id);
        commentData.splice(idxComment, 1);
        setCommentData(commentData);
        console.log(commentData);
        // alert(idxComment);
        setCommentRender(!commentRender);

        toast({
          title: "Comment Delete",
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchComment();
  }, [commentRender]);

  return (
    <>
      {commentData?.map((val, idx) => {
        return (
          <div key={idx}>
            <Flex
              align={"center"}
              gap="2"
              fontSize="0px"
              _hover={{
                fontSize: "md",
              }}
              // borderTop="1px"
              // borderColor="gray.200"
              // py={2}
            >
              <Avatar
                src={val.user_id?.avatar}
                size="sm"
                borderWidth={2}
                borderColor="blue.500"
              />
              <Box mx="2" maxW="90%">
                <Text fontSize="sm">
                  <strong>{val.user_id?.username}</strong> {val.comment}
                </Text>
                <Text fontSize={"12px"}>
                  {moment(val.created_at).fromNow()}
                </Text>
              </Box>
              <Spacer />
              {val.user_id.id === userSelector.id && (
                <Box
                  cursor="pointer"
                  onClick={() => {
                    deleteComment(val.id, props.postId);
                  }}
                >
                  <FiTrash />
                </Box>
              )}
            </Flex>
            <Divider />
          </div>
        );
      })}
      <Button
        size="xs"
        onClick={() => {
          fetchComment();
        }}
      >
        See More Comment...
      </Button>
    </>
  );
};

export default PostComment;
