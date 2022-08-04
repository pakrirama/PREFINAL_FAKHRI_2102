import {
  Box,
  Image,
  Avatar,
  Text,
  Spacer,
  Center,
  useProps,
} from "@chakra-ui/react";

import { FaRegPaperPlane, FaRegBookmark } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import React from "react";
import { axiosInstance } from "../../lib/api";
import PostMenu from "./PostMenu/PostMenu";
import ModalComment from "./PostMenu/ModalComment";
import PostComment from "./PostMenu/PostComment";
import moment from "moment";
import Router from "next/router";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import ShareModal from "./PostMenu/ShareModal";
import { FacebookShareButton } from "react-share";

const OutstagramPost = (props) => {
  // const { deleteComment } = props;
  const postSelector = useSelector((state) => state.postReducer);
  const userSelector = useSelector((state) => state.authReducer);
  const [isLike, setisLike] = useState(props.like);
  const [totalLike, setTotalLike] = useState(props.likes);

  const toggleLike = async () => {
    try {
      await axiosInstance.post(`/post/${props.postId}/like`);

      if (!isLike) {
        setTotalLike(totalLike + 1);
      } else {
        setTotalLike(totalLike - 1);
      }

      setisLike(!isLike);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderColor="gray.400"
        borderRadius="lg"
        maxW="xl"
        paddingY="2"
        marginY="4"
      >
        {/* Card Header */}
        <Box
          paddingX="3"
          paddingBottom="2"
          display="flex"
          alignItems="center"
          boxShadow={"2xl"}
        >
          <Avatar
            src={props.avatarPost}
            size="md"
            onClick={() => Router.push(`/profile/${props.username}`)}
            cursor="pointer"
          />
          <Box mx="2">
            <Text
              fontSize="md"
              fontWeight="bold"
              onClick={() => Router.push(`/profile/${props.username}`)}
              cursor="pointer"
            >
              {props.username}
            </Text>
            <Text fontSize="sm" color="GrayText">
              {props.location}
            </Text>
          </Box>
          {props.userPostId === props.selectorId ? (
            <>
              <Spacer />
              <PostMenu postId={props.postId} postCaption={props.postCaption} />
            </>
          ) : (
            <div></div>
          )}
        </Box>
        {/* Card Media/Content */}
        <Center>
          <Box bg="gray.100">
            <Image
              // boxSize="full"
              // maxHeight={"2xl"}
              src={props.image}
              objectFit="cover"
              onClick={() => Router.push(`/post/${props.postId}`)}
              cursor="pointer"
            />
          </Box>
        </Center>
        {/* Action Buttons */}
        <Box
          paddingX="3"
          paddingY="2"
          display="flex"
          alignItems="center"
          gap={2}
        >
          {/* ICON */}
          {/* <HStack> */}
          {/* <FaRegComment size={"22px"} /> */}
          <ModalComment
            postLocation={props.location}
            postUsername={props.username}
            postImage={props.image}
            postComment={props.comments}
            postCaption={props.postCaption}
            postId={props.postId}
            avatarComment={props.avatarComment}

            // deleteComment={deleteComment}
          />

          {isLike ? (
            <FaHeart
              size={"22px"}
              color="red"
              cursor="pointer"
              onClick={toggleLike}
            />
          ) : (
            <FaRegHeart size={"22px"} cursor="pointer" onClick={toggleLike} />
          )}
          {/* <FaRegPaperPlane size={"22px"} /> */}
          <ShareModal postId={props.postId} />
          <Spacer />
          <FaRegBookmark size={"22px"} />
        </Box>

        {/* Like Count */}
        <Box paddingX="3">
          <Text fontWeight="bold">{totalLike} likes</Text>
        </Box>

        {/* Caption */}
        <Box paddingX="3">
          <Text
            display="inline"
            fontWeight="bold"
            marginRight="2"
            onClick={() => Router.push(`/profile/${props.username}`)}
            cursor="pointer"
          >
            {props.username}
          </Text>
          <Text display="inline">{props.postCaption}</Text>
          <Text fontSize={"sm"}>{moment(props.createdAt).fromNow()}</Text>
          <Text>{props.totalComment?.toLocaleString()} comment</Text>
          {/* <PostComment
            postId={props.postId}
            mt={8}
            fetchComment={fetchComment}
            // deleteComment={deleteComment}
          /> */}
        </Box>
      </Box>
    </>
  );
};

export default OutstagramPost;
