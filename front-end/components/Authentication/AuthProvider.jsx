import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import jsCookie from "js-cookie";
import axios from "axios";
import Router from "next/router";
import { axiosInstance } from "../../lib/api";
import { useSelector } from "react-redux";
import { Spinner, Flex } from "@chakra-ui/react";
// import auth_types from "../redux/reducers/types/auth";
// import { axiosInstance } from "../lib/api";
function AuthProvider({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const renderSelector = useSelector((state) => state.renderReducer);

  const dispatch = useDispatch();

  //   var host = req.headers["host"];
  //   console.log("ini header atas " + host);
  useEffect(() => {
    const fetchData = async () => {
      // jika ada token maka get axios dengan token agar bisa melewati middleware backend
      const userToken = jsCookie.get("outstagram_token");

      try {
        if (userToken) {
          const userResponse = await axiosInstance.post("/refresh-token");
          const data = userResponse.data.result.userModel;

          dispatch({
            type: "AUTH_LOGIN",
            payload: data,
          });
        }
        setIsAuthChecked(true);
      } catch (error) {
        console.log(error);
        jsCookie.remove("outstagram_token");
        dispatch({
          type: "AUTH_LOGOUT",
        });
      }
    };
    fetchData();
  }, [renderSelector.setting]);

  // if (!isAuthChecked) return <Spinner />;

  return children;
}

export default AuthProvider;
