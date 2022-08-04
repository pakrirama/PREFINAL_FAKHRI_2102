import { Text } from "@chakra-ui/react";
import React from "react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../lib/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeTotal = (props) => {
  const postSelector = useSelector((state) => state.postReducer);
  const userSelector = useSelector((state) => state.authReducer);
  const [totalLike, setTotalLike] = useState(props.likes);
  const [isLike, setisLike] = useState(props.isLike);
  const dispatch = useDispatch();

  const likeCount = () => {
    setisLike(!isLike);
  };

  return (
    <>
      {isLike ? (
        <Text
          fontWeight="bold"
          onClick={() => {
            likeCount;
            setTotalLike(totalLike - 1);
          }}
        >
          {totalLike} likes
        </Text>
      ) : (
        <Text
          fontWeight="bold"
          onClick={() => {
            likeCount;
            setTotalLike(totalLike + 1);
          }}
        >
          {totalLike} likes
        </Text>
      )}
    </>
  );
};

export default LikeTotal;
