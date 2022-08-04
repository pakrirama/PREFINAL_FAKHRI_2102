import {
  useDisclosure,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Link,
} from "@chakra-ui/react";

import { Layout } from "../../components/Layout";
import { PostsProfile } from "../../components/Profile/PostsProfile";
import { BioProfile } from "../../components/Profile/BioProfile";
import { FaRegBookmark } from "react-icons/fa";
import { IoMdGrid } from "react-icons/io";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { LinkNext } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Router from "next/router";
import { useRouter } from "next/router";
import { axiosInstance } from "../../lib/api";
import { LikedPost } from "../../components/Profile/LikedPost";
import { FaRegHeart } from "react-icons/fa";

const profile = () => {
  const userSelector = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { username } = router.query;
  const [dataUser, setDataUser] = useState([]);
  const { isOpen, onToggle } = useDisclosure();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/user/${username}`);
      const data = res.data.user;
      setDataUser(data);
      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {isLoading && (
        <Layout>
          <BioProfile
            userId={dataUser.id}
            userName={dataUser.name}
            UserName={dataUser.username}
            userEmail={dataUser.email}
            userAvatar={dataUser.avatar}
            userBio={dataUser.bio}
          />
          <Tabs colorScheme="blackAlpha" align="center" defaultIndex={0}>
            <TabList gap={6}>
              <Tab gap={2}>
                <IoMdGrid />
                Posts
              </Tab>

              {dataUser.id == userSelector.id ? (
                <Tab gap={2}>
                  <FaRegHeart />
                  Liked
                </Tab>
              ) : (
                <></>
              )}

              <Tab gap={2}>
                <RiAccountPinBoxLine />
                Tagged
              </Tab>
              {/* </LinkNext> */}
            </TabList>
            <TabPanels>
              <TabPanel padding={0} my={6}>
                <PostsProfile userId={dataUser.id} />
              </TabPanel>
              <TabPanel padding={0} my={6}>
                <LikedPost userId={dataUser.id} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Layout>
      )}
    </>
  );
};

export default profile;
