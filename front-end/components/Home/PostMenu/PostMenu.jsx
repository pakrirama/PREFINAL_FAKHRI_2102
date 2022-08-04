import {
  Modal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { axiosInstance } from "../../../lib/api";
import { useDispatch, useSelector } from "react-redux";

import EditCaption from "./EditCaption";

const PostMenu = (props) => {
  const dispatch = useDispatch();
  const newPostReducer = useSelector((state) => state.newPostReducer);

  const toast = useToast();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  const handleDelete = async () => {
    console.log(props.postId);
    const res = await axiosInstance.delete(`/post/${props.postId}`);
    try {
      dispatch({
        type: "DELETE_POST",
        payload: {
          deletePost: props.postId,
        },
      });
      toast({
        title: "Post Has been deleted",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: `Error`,
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Menu placement="bottom-end">
      <MenuButton variant={"link"} cursor={"pointer"} minW={0}>
        <BsThreeDots size={"22px"} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onToggle}>
          <Text>Edit Caption</Text>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <EditCaption
              postId={props.postId}
              postCaption={props.postCaption}
              onClick={onToggle}
              onToggleClick={onToggle}
            />
          </Modal>
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PostMenu;
