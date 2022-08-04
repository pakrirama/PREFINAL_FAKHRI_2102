import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure,
  Center,
} from "@chakra-ui/react";

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { FaLink, FaRegPaperPlane } from "react-icons/fa";
import { useState } from "react";

const ShareModal = (props) => {
  // const { deleteComment } = props;
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [copied, setCopied] = useState(false);

  function copy() {
    setCopied(true);
  }

  return (
    <>
      <FaRegPaperPlane size={"22px"} onClick={onToggle} cursor={"pointer"} />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />

        <ModalContent>
          <ModalCloseButton size="lg" />
          <ModalHeader>Share Content</ModalHeader>
          <ModalBody>
            <Center gap={2}>
              <TwitterShareButton
                url={`http://localhost:3000/post/${props.postId}`}
              >
                <TwitterIcon size={60} round={true} />
              </TwitterShareButton>
              <FacebookShareButton
                url={`http://localhost:3000/post/${props.postId}`}
              >
                <FacebookIcon size={60} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton
                url={`http://localhost:3000/post/${props.postId}`}
              >
                <WhatsappIcon size={60} round={true} />
              </WhatsappShareButton>
              <Button
                rounded={"full"}
                size="xl"
                padding={4}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:3000/post/${props.postId}`
                  );
                  setCopied(true);
                }}
              >
                <FaLink size={26}></FaLink>
                {!copied ? "Copy link" : "Copied!"}
              </Button>
            </Center>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button colorScheme="blue" mr={3}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShareModal;
