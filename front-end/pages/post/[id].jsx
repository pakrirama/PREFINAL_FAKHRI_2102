import React from "react";
import { Layout } from "../../components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Center, Flex } from "@chakra-ui/react";
import SuggestionBox from "../../components/Home/SuggestionBox";
import axios from "axios";
import OutstagramPost from "../../components/Home/OutstagramPost";
import Page from "./Page";

const postDetail = ({ dataPost }) => {
  // const [dataPost, setDataPost] = useState();
  const router = useRouter();
  const userSelector = useSelector((state) => state.authReducer);

  console.log(dataPost);
  const { id } = router.query;
  const url = `http://localhost:3000${router.pathname}`;

  let like = true;
  like = dataPost.like.find((e) => e.user_id === userSelector.id)
    ? (like = true)
    : (like = false);
  console.log(like);
  return (
    <>
      <Page
        title={`Outstagram from ${dataPost.user_id?.username}`}
        description={dataPost?.caption}
        image={dataPost.image}
        url={url}
        type="website"
      />
      <Layout>
        <Center>
          <Flex gap={4}>
            <Box>
              {dataPost ? (
                <OutstagramPost
                  avatarPost={dataPost.user_id?.avatar}
                  username={dataPost.user_id?.username}
                  location={dataPost.location}
                  userPostId={dataPost.user_id?.id}
                  selectorId={userSelector.id}
                  postId={dataPost.id}
                  postCaption={dataPost.caption}
                  image={dataPost?.image}
                  comment={dataPost.comment}
                  avatarComment={dataPost.user_id?.avatar}
                  like={like}
                  likes={dataPost.likes}
                  createdAt={dataPost.created_at}
                  totalComment={dataPost.total_comment}
                />
              ) : (
                <>
                  <Box
                    padding="6"
                    boxShadow="lg"
                    bg="white"
                    width={"xl"}
                    mt={4}
                  >
                    <SkeletonCircle size="10" />
                    <SkeletonText my="4" noOfLines={2} spacing="4" />
                    <Skeleton h="xs" mb={4} />
                    <SkeletonText mt="4" noOfLines={2} spacing="4" />
                  </Box>
                  <Box
                    padding="6"
                    boxShadow="lg"
                    bg="white"
                    width={"xl"}
                    mt={4}
                  >
                    <SkeletonCircle size="10" />
                    <SkeletonText my="4" noOfLines={2} spacing="4" />
                    <Skeleton h="xs" mb={4} />
                    <SkeletonText mt="4" noOfLines={2} spacing="4" />
                  </Box>
                </>
              )}
            </Box>
            {/* Right Box */}
            {/* <SuggestionBox /> */}
          </Flex>
        </Center>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  const res = await axios.get(`http://localhost:3333/api/v1/post/${id}`);
  return {
    props: {
      dataPost: res.data.post[0],
    },
  };
}

export default postDetail;
