import React, { useRef } from "react";
import { 
  Flex, 
  Button, 
  Icon, 
  Text, 
  HStack, 
  Divider, 
  useColorModeValue 
} from "@chakra-ui/react";
import { 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiLink, 
  FiType,
  FiBarChart2 
} from "react-icons/fi";

const AttachmentControls = ({ 
  handleImageUpload, 
  handleVideoUpload, 
  handleDocumentUpload,
  handleLinkAdd,
  handlePollAdd
}) => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("blue.500", "blue.200");

  // Attachment option buttons
  const attachmentOptions = [
    {
      type: "images",
      icon: FiImage,
      label: "Photo",
      ref: fileInputRef,
      accept: "image/*",
      handler: handleImageUpload,
    },
    {
      type: "videos",
      icon: FiVideo,
      label: "Video",
      ref: videoInputRef,
      accept: "video/*",
      handler: handleVideoUpload,
    },
    {
      type: "documents",
      icon: FiFileText,
      label: "Document",
      ref: documentInputRef,
      accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
      handler: handleDocumentUpload,
    },
    { type: "link", icon: FiLink, label: "Link", handler: handleLinkAdd },
    { type: "poll", icon: FiBarChart2, label: "Poll", handler: handlePollAdd },
  ];

  return (
    <>
      <Divider my={4} borderColor={borderColor} />
      
      <HStack spacing={2} justify="space-between">
        <Flex>
          {attachmentOptions.map((option) => (
            <React.Fragment key={option.type}>
              {option.ref ? (
                <>
                  <Button
                    size="sm"
                    leftIcon={<Icon as={option.icon} />}
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => option.ref.current?.click()}
                    _hover={{ bg: hoverBg }}
                    px={3}
                  >
                    {option.label}
                  </Button>
                  <input
                    type="file"
                    multiple
                    hidden
                    ref={option.ref}
                    accept={option.accept}
                    onChange={option.handler}
                  />
                </>
              ) : (
                <Button
                  size="sm"
                  leftIcon={<Icon as={option.icon} />}
                  variant="ghost"
                  colorScheme="blue"
                  onClick={option.handler}
                  _hover={{ bg: hoverBg }}
                  px={3}
                >
                  {option.label}
                </Button>
              )}
            </React.Fragment>
          ))}
        </Flex>
      </HStack>
    </>
  );
};

export default AttachmentControls;
