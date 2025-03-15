import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiImage, FiVideo, FiUserPlus, FiFile } from "react-icons/fi";

const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [content, setContent] = useState("");

  const handlePost = () => {
    if (content.trim() !== "") {
      onPost(content);
      setContent("");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Share your thoughts, resources or questions..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            resize="vertical"
          />
          <HStack spacing={4} mt={4}>
            <Tooltip label="Add Image" hasArrow>
              <IconButton icon={<FiImage />} aria-label="Add Image" variant="ghost" />
            </Tooltip>
            <Tooltip label="Add Video" hasArrow>
              <IconButton icon={<FiVideo />} aria-label="Add Video" variant="ghost" />
            </Tooltip>
            <Tooltip label="Tag People" hasArrow>
              <IconButton icon={<FiUserPlus />} aria-label="Tag People" variant="ghost" />
            </Tooltip>
            <Tooltip label="Add Document" hasArrow>
              <IconButton icon={<FiFile />} aria-label="Add Document" variant="ghost" />
            </Tooltip>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handlePost}>
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
