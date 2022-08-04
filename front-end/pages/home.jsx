import { Layout } from "../components/Layout";
import OutstagramPost from "../components/Home/OutstagramPost";
import SuggestionBox from "../components/Home/SuggestionBox";

import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Center,
  Flex,
  useToast,
  HStack,
  Skeleton,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Router from "next/router";
import React from "react";
import { axiosInstance } from "../lib/api";
import InfiniteScroll from "react-infinite-scroller";
import Header from "../components/Header";

const Home = () => {
  const [dataPost, setDataPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(true);

  const userSelector = useSelector((state) => state.authReducer);
  const postSelector = useSelector((state) => state.postReducer);
  const newPostSelector = useSelector((state) => state.newPostReducer);
  const captionSelector = useSelector((state) => state.captionReducer);
  const renderSelector = useSelector((state) => state.renderReducer);

  const [scrollRender, setScrollRender] = useState(false);
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get(`/post/?page=${page}`);
      const post = res.data.posts.data;
      const meta = res.data.posts.meta;

      console.log("laspage = " + meta.last_page);
      console.log("lastPage usestat = " + lastPage);

      console.log(post);

      if (!post.length) {
        setLastPage(false);
        console.log("finish fetch post");
      }
      setPage(page + 1);
      console.log("post length = " + post.length);
      console.log("page = " + page);
      setDataPost([...dataPost, ...post]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [scrollRender]);

  useEffect(() => {
    if (newPostSelector?.value?.id) {
      console.log("lewat upload" + newPostSelector.value.id);
      const newData = newPostSelector?.value;
      console.log("newData");
      console.log(newData);

      const arr = [newData, ...dataPost];
      console.log(arr);
      setDataPost(arr);
      console.log(dataPost);
    }
  }, [newPostSelector?.value?.id]);

  useEffect(() => {
    console.log("edit usefek");
    console.log(captionSelector.value);
    if (captionSelector?.value?.id) {
      console.log("lewat CAPTION" + captionSelector.value.id);
      const idxPostCaption = dataPost
        .map(function (val) {
          return val.id;
        })
        .indexOf(captionSelector.value.id);

      const newData = captionSelector?.value;
      console.log("newData");
      console.log(newData);

      const arr = dataPost;
      arr[idxPostCaption] = newData;
      console.log(arr);
      setDataPost([...arr]);
      console.log(dataPost);
    }
  }, [captionSelector.value.id]);

  const fetchDelete = () => {
    if (newPostSelector?.deletePost) {
      const idxDelete = dataPost
        .map(function (val) {
          return val.id;
        })
        .indexOf(newPostSelector.deletePost);

      console.log(idxDelete);
      dataPost.splice(idxDelete, 1);

      const arr = dataPost;

      setDataPost([...arr]);
      console.log(dataPost);
    }
  };
  useEffect(() => {
    setTimeout(fetchDelete(), 1000);
  }, [newPostSelector?.deletePost]);

  useEffect(() => {
    console.log(userSelector);
    if (!userSelector?.id) {
      // setIsLoading(true);
      Router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [userSelector?.id]);

  return (
    <>
      <Layout>
        <Center>
          <Flex gap={4}>
            <Box>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => {
                  fetchPost();
                }}
                hasMore={lastPage}
              >
                {dataPost.length ? (
                  dataPost.map((val, idx) => {
                    let like = false;
                    val.like.find((e) => e.user_id === userSelector.id)
                      ? (like = true)
                      : (like = false);

                    // let siCaption = caption;

                    return (
                      <div key={idx}>
                        <OutstagramPost
                          avatarPost={val.user_id?.avatar}
                          username={val.user_id?.username}
                          location={val.location}
                          userPostId={val.user_id?.id}
                          selectorId={userSelector.id}
                          postId={val.id}
                          postCaption={val.caption}
                          image={val.image}
                          comment={val.comment}
                          avatarComment={val.user_id?.avatar}
                          like={like}
                          likes={val.likes}
                          createdAt={val.created_at}
                          totalComment={val.total_comment}
                          idx={idx}

                          // deleteComment={deleteComment}
                        />
                      </div>
                    );
                  })
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
              </InfiniteScroll>
              {/* <Button onClick={loadMore}>Load More</Button> */}
            </Box>
            {/* Right Box */}
            {/* {dataPost ? <SuggestionBox /> : null} */}
          </Flex>
        </Center>
      </Layout>
    </>
  );
};

export default Home;

// </HStack> */}
