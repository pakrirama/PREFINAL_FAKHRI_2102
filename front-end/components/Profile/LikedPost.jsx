import { Image, Grid, Center, Spinner } from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/api";
import { useSelector } from "react-redux";
import Router from "next/router";

export const LikedPost = (props) => {
  const postSelector = useSelector((state) => state.postReducer);
  const [likedPost, setLikedPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await axiosInstance.get(`/like/${props.userId}`);
      const data = res.data.showLikeByuserId;
      setLikedPost(data);
      console.log(likedPost);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <Center>
      <Grid gridAutoRows templateColumns="repeat(3,1fr)" gap={2}>
        {isLoading ? (
          likedPost.map((val, idx) => {
            return (
              <Image
                boxSize={{ base: "140", sm: "200", md: "350" }}
                key={idx}
                //   boxSize={[200, 400]}
                //   width="200"
                objectFit="cover"
                src={val.post_id?.image}
                transition="0.3s ease-in-out"
                _hover={{
                  filter: "auto",
                  brightness: "40%",
                }}
                onClick={() => Router.push(`/post/${val.post_id?.id}`)}
                cursor="pointer"
              />
            );
          })
        ) : (
          <Spinner />
        )}
      </Grid>
    </Center>
  );
};
