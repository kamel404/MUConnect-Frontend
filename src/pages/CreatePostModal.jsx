import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  Text,
  Avatar,
  IconButton,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  Box,
  Badge,
  Icon,
  Image,
  CloseButton,
  SimpleGrid,
  Wrap,
  WrapItem,
  Tag,
  Tooltip,
  useToast,
  AspectRatio,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiImage,
  FiMapPin,
  FiUpload,
  FiVideo,
  FiFileText,
  FiLink,
  FiType,
  FiX,
  FiSmile,
  FiEdit,
  FiAtSign,
} from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const CreatePostModal = ({ isOpen, onClose, addNewPost, user }) => {
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const toast = useToast();

  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("");
  const [course, setCourse] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [studyDate, setStudyDate] = useState("");

  // Multiple attachments
  const [attachments, setAttachments] = useState({
    images: [],
    videos: [],
    documents: [],
  });

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setPostContent("");
    setPostType("");
    setCourse("");
    setEventDate("");
    setLocation("");
    setStudyDate("");
    setAttachments({
      images: [],
      videos: [],
      documents: [],
    });
  };

  const handleSubmit = () => {
    if (!postContent.trim()) {
      toast({
        title: "Post content required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create post data object with all necessary properties
    const postData = {};

    // Add post content
    postData.content = postContent;

    // Set initial type based on user selection or default
    postData.type = postType || "Default";

    // Process attachments
    // Process image attachments
    if (attachments.images.length > 0) {
      // Only set Media type if no specific type is selected
      if (!postType) {
        postData.type = "Media";
      }

      postData.images = JSON.parse(JSON.stringify(attachments.images));
      postData.media = attachments.images[0].url;
      postData.mediaType = "image";
    }

    // Process video attachments
    if (attachments.videos.length > 0) {
      if (!postType) {
        postData.type = "Media";
      }

      postData.videos = JSON.parse(JSON.stringify(attachments.videos));
      if (!postData.media) {
        postData.media = attachments.videos[0].url;
        postData.mediaType = "video";
      }
    }

    // Process document attachments
    if (attachments.documents.length > 0) {
      // Only set Course Material type if no specific type is selected
      if (!postType) {
        postData.type = "Course Material";
      }

      postData.documents = JSON.parse(JSON.stringify(attachments.documents));
      postData.file = attachments.documents[0].url;
      postData.fileName = attachments.documents[0].name;
      postData.fileType = attachments.documents[0].type || "application/pdf";
    }

    // Add course if selected
    if (course) {
      postData.course = course;
    }

    // Add event details if applicable
    if (postType === "Event" && eventDate) {
      postData.date = eventDate;
      postData.location = location;
      const eventDateObj = new Date(eventDate);
      if (!isNaN(eventDateObj.getTime())) {
        postData.formattedDate = eventDateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        postData.formattedTime = eventDateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    // Add study group details if applicable
    if (postType === "Study Group" && studyDate) {
      postData.date = studyDate;
      // Create a formatted date string
      const studyDateObj = new Date(studyDate);
      if (!isNaN(studyDateObj.getTime())) {
        postData.formattedDate = studyDateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        postData.formattedTime = studyDateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }

    // Add post to parent component state
    addNewPost(postContent, postData.type, postData);

    // Reset form and close modal
    resetForm();
    onClose();
  };

  // Convert file to base64 for more reliable storage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      // Show loading indicator
      toast({
        title: "Uploading images...",
        status: "info",
        duration: 2000,
        isClosable: true,
      });

      const uploadedImages = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        const base64 = await fileToBase64(file);
        uploadedImages.push({
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
        });
      }

      setAttachments((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      // Success notification
      if (uploadedImages.length > 0) {
        toast({
          title: "Images uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error uploading images",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("video/") ||
          file.name.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i)
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description: "Only video files are allowed for video upload",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (sizeValidFiles.length !== validFiles.length) {
        toast({
          title: "File too large",
          description:
            "Some videos exceed the 20MB size limit and will be skipped",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const newVideos = await Promise.all(
        sizeValidFiles.map(async (file) => {
          try {
            const base64 = await fileToBase64(file);
            return {
              id: `video-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              name: file.name,
              url: base64,
              size: file.size,
              type: "video",
              mimeType: file.type || "video/mp4",
            };
          } catch (err) {
            console.error(`Error processing video ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulVideos = newVideos.filter((video) => video !== null);

      if (successfulVideos.length > 0) {
        setAttachments((prev) => {
          if (postType !== "Media") {
            setPostType("Media");
          }
          return {
            ...prev,
            videos: [...prev.videos, ...successfulVideos].slice(0, 2), // Limit to 2 videos
          };
        });

        toast({
          title: "Videos uploaded",
          description: `Successfully added ${successfulVideos.length} videos`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload failed",
          description:
            "Failed to process any videos. Please try different files.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      e.target.value = null;
    } catch (error) {
      console.error("Error processing videos:", error);
      toast({
        title: "Error uploading videos",
        description: "Please try again with different videos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      const validFiles = files.filter((file) =>
        file.name.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i)
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description:
            "Only document file types (PDF, Word, Excel, PowerPoint, etc.) are allowed",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (sizeValidFiles.length !== validFiles.length) {
        toast({
          title: "File too large",
          description:
            "Some documents exceed the 10MB size limit and will be skipped",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const newDocuments = await Promise.all(
        sizeValidFiles.map(async (file) => {
          try {
            const base64 = await fileToBase64(file);
            const extension = file.name.split(".").pop().toLowerCase();
            let mimeType = file.type || "application/octet-stream";
            if (!file.type || file.type === "application/octet-stream") {
              if (extension === "pdf") mimeType = "application/pdf";
              else if (["doc", "docx"].includes(extension))
                mimeType = "application/msword";
              else if (["xls", "xlsx"].includes(extension))
                mimeType = "application/vnd.ms-excel";
              else if (["ppt", "pptx"].includes(extension))
                mimeType = "application/vnd.ms-powerpoint";
              else if (extension === "txt") mimeType = "text/plain";
            }

            return {
              id: `doc-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              name: file.name,
              url: base64,
              size: file.size,
              type: "document",
              mimeType: mimeType,
            };
          } catch (err) {
            console.error(`Error processing document ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulDocuments = newDocuments.filter((doc) => doc !== null);

      if (successfulDocuments.length > 0) {
        setAttachments((prev) => {
          if (postType !== "Course Material") {
            setPostType("Course Material");
          }
          return {
            ...prev,
            documents: [...prev.documents, ...successfulDocuments].slice(0, 4), // Limit to 4 documents
          };
        });

        toast({
          title: "Documents uploaded",
          description: `Successfully added ${successfulDocuments.length} documents`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload failed",
          description:
            "Failed to process any documents. Please try different files.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      e.target.value = null;
    } catch (error) {
      console.error("Error processing documents:", error);
      toast({
        title: "Error uploading documents",
        description: "Please try again with different documents",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeAttachment = (type, id) => {
    setAttachments((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  // Format file size for documents
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Post type selection options
  const postTypes = [
    {
      type: "Study Group",
      icon: FiUsers,
      title: "Group",
      description: "Create a study group",
    },
    {
      type: "Course Material",
      icon: FiBook,
      title: "Material",
      description: "Share course materials",
    },
    {
      type: "Event",
      icon: FiCalendar,
      title: "Event",
      description: "Announce an event",
    },
    {
      type: "Media",
      icon: FiImage,
      title: "Media",
      description: "Share images or videos",
    },
  ];

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
    { type: "link", icon: FiLink, label: "Link", handler: () => null },
  ];

  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} overflow="hidden">
        <ModalHeader borderBottomWidth="1px" py={3}>
          <Flex align="center">
            <Avatar
              name={user?.name || "User"}
              src={user?.avatar || "https://bit.ly/dan-abramov"}
              size="md"
              mr={3}
              border="2px solid"
              borderColor={accentColor}
            />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                Create Post
              </Text>
              <Text fontSize="sm" color="gray.500">
                {postType ? postType : "Create a new post"}
              </Text>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton size="lg" mt={1} />

        <ModalBody py={4}>
          <VStack spacing={4} align="stretch">
            {/* Post type selector */}
            <HStack spacing={2} py={2}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color="gray.500"
                minW="80px"
              >
                Post type:
              </Text>
              <Wrap spacing={2}>
                {postTypes.map((item) => (
                  <WrapItem key={item.type}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant={postType === item.type ? "solid" : "subtle"}
                      colorScheme={postType === item.type ? "blue" : "gray"}
                      cursor="pointer"
                      onClick={() =>
                        setPostType((prev) =>
                          prev === item.type ? "" : item.type
                        )
                      }
                      px={3}
                      py={1}
                    >
                      <Icon as={item.icon} mr={1} />
                      <Text fontSize="xs">{item.title}</Text>
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </HStack>

            {/* Content textarea */}
            <FormControl>
              <Textarea
                placeholder="Share your knowledge or ask a question..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                size="lg"
                borderRadius="lg"
                minHeight="120px"
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
              <Flex justify="flex-end" mt={2}>
                <Badge colorScheme="gray" fontSize="xs">
                  {postContent.length}/500
                </Badge>
              </Flex>
            </FormControl>

            {/* Type-specific fields */}
            {postType === "Study Group" && (
              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Icon as={FiCalendar} /> Study Date
                </FormLabel>
                <Input
                  type="datetime-local"
                  value={studyDate}
                  onChange={(e) => setStudyDate(e.target.value)}
                  borderRadius="lg"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                />
              </FormControl>
            )}

            {postType === "Course Material" && (
              <FormControl>
                <FormLabel display="flex" alignItems="center" gap={2}>
                  <Icon as={FiBook} /> Related Course
                </FormLabel>
                <Select
                  placeholder="Select course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  borderRadius="lg"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                >
                  <option value="CS 101">CS 101</option>
                  <option value="MATH 202">MATH 202</option>
                  <option value="PHYS 301">PHYS 301</option>
                </Select>
              </FormControl>
            )}

            {postType === "Event" && (
              <Box>
                <FormControl mb={3}>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    <Icon as={FiCalendar} /> Event Date
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    borderRadius="lg"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    <Icon as={FiMapPin} /> Location
                  </FormLabel>
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    borderRadius="lg"
                    borderColor={borderColor}
                    _focus={{
                      borderColor: accentColor,
                      boxShadow: `0 0 0 1px ${accentColor}`,
                    }}
                  />
                </FormControl>
              </Box>
            )}

            {/* Attachments preview */}
            {(attachments.images.length > 0 ||
              attachments.videos.length > 0 ||
              attachments.documents.length > 0) && (
              <Box
                borderWidth="1px"
                borderRadius="lg"
                p={3}
                borderColor={borderColor}
                bg={hoverBg}
              >
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Attachments:
                </Text>

                {/* Images preview */}
                {attachments.images.length > 0 && (
                  <Box mb={3}>
                    <SimpleGrid
                      columns={{
                        base: attachments.images.length === 1 ? 1 : 2,
                        md: attachments.images.length === 1 ? 1 : 3,
                      }}
                      spacing={2}
                    >
                      {attachments.images.map((image) => (
                        <Box
                          key={image.id}
                          position="relative"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Image
                            src={image.url}
                            alt={image.name}
                            borderRadius="md"
                            objectFit="cover"
                            width="100%"
                            height="100px"
                          />
                          <CloseButton
                            position="absolute"
                            top={1}
                            right={1}
                            size="sm"
                            bg="blackAlpha.700"
                            color="white"
                            onClick={() => removeAttachment("images", image.id)}
                            _hover={{ bg: "blackAlpha.800" }}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Videos preview */}
                {attachments.videos.length > 0 && (
                  <Box mb={3}>
                    <SimpleGrid columns={1} spacing={2}>
                      {attachments.videos.map((video) => (
                        <Box
                          key={video.id}
                          position="relative"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <AspectRatio ratio={16 / 9}>
                            <Box
                              as="video"
                              src={video.url}
                              controls
                              borderRadius="md"
                            />
                          </AspectRatio>
                          <CloseButton
                            position="absolute"
                            top={1}
                            right={1}
                            size="sm"
                            bg="blackAlpha.700"
                            color="white"
                            onClick={() => removeAttachment("videos", video.id)}
                            _hover={{ bg: "blackAlpha.800" }}
                          />
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Documents preview */}
                {attachments.documents.length > 0 && (
                  <Box>
                    <VStack spacing={2} align="stretch">
                      {attachments.documents.map((doc) => (
                        <Flex
                          key={doc.id}
                          p={2}
                          borderRadius="md"
                          bg="blackAlpha.50"
                          align="center"
                          justify="space-between"
                        >
                          <Flex align="center">
                            <Icon as={FiFileText} mr={2} color="blue.500" />
                            <Box>
                              <Text fontSize="sm" noOfLines={1}>
                                {doc.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {formatFileSize(doc.size)}
                              </Text>
                            </Box>
                          </Flex>
                          <CloseButton
                            size="sm"
                            onClick={() =>
                              removeAttachment("documents", doc.id)
                            }
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            )}

            <Divider borderColor={borderColor} />

            {/* Attachment buttons */}
            <HStack spacing={3} justify="space-between">
              <HStack>
                {attachmentOptions.map((option) => (
                  <Box key={option.type}>
                    {option.ref ? (
                      <Tooltip label={option.label} placement="top">
                        <IconButton
                          icon={<option.icon />}
                          aria-label={option.label}
                          borderRadius="full"
                          size="md"
                          variant="ghost"
                          onClick={() => option.ref.current.click()}
                          colorScheme="blue"
                          opacity={0.8}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip label={option.label} placement="top">
                        <IconButton
                          icon={<option.icon />}
                          aria-label={option.label}
                          borderRadius="full"
                          size="md"
                          variant="ghost"
                          onClick={option.handler}
                          colorScheme="blue"
                          opacity={0.8}
                        />
                      </Tooltip>
                    )}
                    {option.ref && (
                      <Input
                        type="file"
                        accept={option.accept}
                        ref={option.ref}
                        onChange={option.handler}
                        display="none"
                        multiple
                      />
                    )}
                  </Box>
                ))}
                <Tooltip label="Tag someone" placement="top">
                  <IconButton
                    icon={<FiAtSign />}
                    aria-label="Tag someone"
                    borderRadius="full"
                    size="md"
                    variant="ghost"
                    colorScheme="blue"
                    opacity={0.8}
                  />
                </Tooltip>
              </HStack>

              <Button
                colorScheme="blue"
                size="md"
                onClick={handleSubmit}
                isDisabled={!postContent.trim()}
                px={6}
                borderRadius="full"
                _hover={{ transform: "translateY(-1px)", shadow: "md" }}
                _active={{ transform: "translateY(0)" }}
                transition="all 0.2s"
              >
                Publish
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
