import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";

import { Layout } from "../components/Layout";
import { AiOutlineClose } from "react-icons/ai";
import ProfileSetting from "../components/AccountSetting/ProfileSetting";

const Setting = () => {
  return (
    <Layout>
      <Tabs
        orientation="vertical"
        my={12}
        colorScheme="blackAlpha"
        borderWidth="2px"
      >
        <TabList minW={52} gap={4} borderRightWidth="2px">
          <Tab justifyContent={"start"}>Edit Profile</Tab>
          <Tab justifyContent={"start"}>Change Password</Tab>
          <Tab justifyContent={"start"}>Apps and Websites</Tab>
          <Tab justifyContent={"start"}>Email Notification</Tab>
          <Tab justifyContent={"start"}>Push Notification</Tab>
          <Tab justifyContent={"start"}>Manage Contacts</Tab>
          <Tab justifyContent={"start"}>Privacy and Security</Tab>
          <Tab justifyContent={"start"}>Login Activity</Tab>
          <Tab justifyContent={"start"}>Help</Tab>

          <Text align={"center"} fontWeight="bold" color={"blue.400"} py={12}>
            Switch to Proffesional Account
          </Text>
          <hr />
        </TabList>
        <TabPanels>
          <TabPanel id="editProfile" padding={0}>
            <ProfileSetting />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Setting;
