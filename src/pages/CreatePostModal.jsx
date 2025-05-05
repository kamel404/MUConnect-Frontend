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
  ModalFooter,
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
  FiSend,
  FiVideo,
  FiFileText,
  FiLink,
  FiType,
  FiX,
  FiSmile,
  FiEdit,
  FiAtSign,
} from "react-icons/fi";
import { useState, useRef, useEffect, useMemo } from "react";

// Helper function to sort attachments for a social media style grid
const sortAttachmentsByType = (attachments) => {
  // Make sure attachment properties exist and are arrays
  const images = attachments.images || [];
  const videos = attachments.videos || [];
  const documents = attachments.documents || [];
  
  // Combine all attachment types for a unified gallery
  const allItems = [
    ...images.map(item => ({ ...item, mediaType: 'image' })),
    ...videos.map(item => ({ ...item, mediaType: 'video' })),
    ...documents.map(item => ({ ...item, mediaType: 'document' }))
  ];
  
  // Sort by creation time (using ID since it contains timestamp)
  return allItems.sort((a, b) => {
    if (!a.id || !b.id) return 0;
    const aTime = a.id.split('-')[1] || 0;
    const bTime = b.id.split('-')[1] || 0;
    return bTime - aTime;
  });
};

const CreatePostModal = ({ isOpen, onClose, addNewPost, user }) => {
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const toast = useToast();
  const textColor = useColorModeValue("blue.500", "blue.200");

  const [postTitle, setPostTitle] = useState("");
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

  // Track if we have mixed attachment types
  const hasMixedAttachments = useMemo(() => {
    const types = [
      attachments.images.length > 0,
      attachments.videos.length > 0,
      attachments.documents.length > 0,
    ];
    return types.filter(Boolean).length > 1;
  }, [attachments]);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setPostTitle("");
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

    // Add Post Content
    postData.content = postContent;

    // Set initial type based on user selection or default
    postData.type = postType || "Default";

    // Process attachments
    // Determine post type based on attached content if not explicitly selected
    if (!postType && hasMixedAttachments) {
      // If we have mixed attachments, use "Mixed Content" type
      postData.type = "Mixed Content";
    }
    
    // Process image attachments
    if (attachments.images.length > 0) {
      // Only set Media type if no specific type is selected and we don't have mixed content
      if (!postType && !hasMixedAttachments) {
        postData.type = "Media";
      }

      postData.images = JSON.parse(JSON.stringify(attachments.images));
      postData.media = attachments.images[0].url;
      postData.mediaType = "image";
    }

    // Process video attachments
    if (attachments.videos.length > 0) {
      if (!postType && !hasMixedAttachments) {
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
      // Only set Course Material type if no specific type is selected and we don't have mixed content
      if (!postType && !hasMixedAttachments) {
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

        // Generate a unique ID for the image
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const imageId = `img-${timestamp}-${randomString}`;
        
        const base64 = await fileToBase64(file);
        uploadedImages.push({
          id: imageId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
        });
      }

      setAttachments((prev) => {
        // Check if this will create mixed attachments
        const willHaveMixedAttachments = prev.videos.length > 0 || prev.documents.length > 0;
        if (willHaveMixedAttachments && !postType) {
          setPostType("Mixed Content");
        } else if (!willHaveMixedAttachments && !postType) {
          setPostType("Media");
        }
        
        return {
          ...prev,
          images: [...prev.images, ...uploadedImages],
        };
      });

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
          // Only auto-set type if we don't have mixed attachments
          const willHaveMixedAttachments = prev.images.length > 0 || prev.documents.length > 0;
          if (postType !== "Media" && !willHaveMixedAttachments) {
            setPostType("Media");
          } else if (willHaveMixedAttachments && !postType) {
            setPostType("Mixed Content");
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
          // Only auto-set type if we don't have mixed attachments
          const willHaveMixedAttachments = prev.images.length > 0 || prev.videos.length > 0;
          if (postType !== "Course Material" && !willHaveMixedAttachments) {
            setPostType("Course Material");
          } else if (willHaveMixedAttachments && !postType) {
            setPostType("Mixed Content");
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
    {
      type: "Mixed Content",
      icon: FiEdit,
      title: "Mixed",
      description: "Share mixed content types",
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
        <ModalHeader bg={useColorModeValue("gray.50", "gray.800")} borderBottomWidth="1px" borderColor={borderColor} pb={4} pt={3}>
          <Flex align="center" gap={3}>
            <Avatar
              src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
              size="md"
              name={user?.name || "User"}
              border="2px solid"
              borderColor={accentColor}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" lineHeight="short" color={textColor}>
                {user?.name || "You"}
              </Text>
              <HStack spacing={1} mt={1}>
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                  Visible to everyone
                </Text>
              </HStack>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton size="lg" mt={1} />

        <ModalBody pt={5} pb={2}>
          <VStack spacing={5} align="stretch">
            {/* Content textarea */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1} ml={1} color={useColorModeValue("gray.700", "gray.300")}>
                Content
              </FormLabel>
              <Textarea
                placeholder="Share your knowledge, resources, or ask a question..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                size="md"
                borderRadius="md"
                borderWidth="2px"
                bg={useColorModeValue("white", "gray.700")}
                minHeight="140px"
                p={3}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
              <Flex justify="flex-end" mt={1.5}>
                <Text fontSize="xs" color={postContent.length > 480 ? "orange.500" : "gray.500"}>
                  {postContent.length}/500 characters
                </Text>
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
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Attachments:
                  </Text>
                  {hasMixedAttachments && (
                    <Badge colorScheme="purple" px={2} py={1} borderRadius="full" fontSize="xs">
                      Mixed Content
                    </Badge>
                  )}
                </Flex>

                {/* Mixed content counter */}
                {hasMixedAttachments && (
                  <Flex mb={3} gap={3} justify="flex-start">
                    {attachments.images.length > 0 && (
                      <Flex align="center" gap={1}>
                        <Icon as={FiImage} color="green.500" />
                        <Text fontSize="xs">{attachments.images.length} image{attachments.images.length !== 1 ? 's' : ''}</Text>
                      </Flex>
                    )}
                    {attachments.videos.length > 0 && (
                      <Flex align="center" gap={1}>
                        <Icon as={FiVideo} color="red.500" />
                        <Text fontSize="xs">{attachments.videos.length} video{attachments.videos.length !== 1 ? 's' : ''}</Text>
                      </Flex>
                    )}
                    {attachments.documents.length > 0 && (
                      <Flex align="center" gap={1}>
                        <Icon as={FiFileText} color="blue.500" />
                        <Text fontSize="xs">{attachments.documents.length} document{attachments.documents.length !== 1 ? 's' : ''}</Text>
                      </Flex>
                    )}
                  </Flex>
                )}

                {/* Unified Social Media Grid for All Attachment Types */}
                {(attachments.images.length > 0 || attachments.videos.length > 0 || attachments.documents.length > 0) && (
                  <Box mb={3}>
                    {hasMixedAttachments && (
                      <Flex align="center" mb={2}>
                        {attachments.images.length > 0 && <Icon as={FiImage} color="green.500" mr={1} />}
                        {attachments.videos.length > 0 && <Icon as={FiVideo} color="red.500" ml={attachments.images.length > 0 ? 2 : 0} mr={1} />}
                        {attachments.documents.length > 0 && <Icon as={FiFileText} color="blue.500" ml={attachments.images.length > 0 || attachments.videos.length > 0 ? 2 : 0} mr={1} />}
                        <Text fontSize="sm" fontWeight="medium">Mixed Content</Text>
                      </Flex>
                    )}
                    
                    {/* Combined social media style grid for all attachment types */}
                    {sortAttachmentsByType(attachments).length > 0 && (
                      <Box>
                        {/* For a single item */}
                        {sortAttachmentsByType(attachments).length === 1 ? (
                          // Single item layout
                          <Box position="relative" borderRadius="md" overflow="hidden">
                            {(() => {
                              const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents })[0];
                              if (item.mediaType === 'video') {
                                return (
                                  <AspectRatio ratio={16 / 9}>
                                    <Box
                                      as="video"
                                      src={item.url}
                                      controls
                                      borderRadius="md"
                                    />
                                  </AspectRatio>
                                );
                              } else if (item.mediaType === 'image') {
                                return (
                                  <AspectRatio ratio={4 / 3}>
                                    <Image
                                      src={item.url}
                                      alt={item.name}
                                      borderRadius="md"
                                      objectFit="cover"
                                    />
                                  </AspectRatio>
                                );
                              } else { // document
                                return (
                                  <Flex
                                    p={4}
                                    borderRadius="md"
                                    bg="blackAlpha.50"
                                    align="center"
                                    justify="space-between"
                                    height="100px"
                                  >
                                    <Flex align="center">
                                      <Icon as={FiFileText} boxSize={10} mr={3} color="blue.500" />
                                      <Box>
                                        <Text fontSize="md" fontWeight="medium" noOfLines={1}>
                                          {item.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                          {formatFileSize(item.size)}
                                        </Text>
                                      </Box>
                                    </Flex>
                                  </Flex>
                                );
                              }
                            })()} 
                            <CloseButton
                              position="absolute"
                              top={1}
                              right={1}
                              size="sm"
                              bg="blackAlpha.700"
                              color="white"
                              onClick={() => {
                                const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents })[0];
                                const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : 'documents';
                                removeAttachment(type, item.id);
                              }}
                              _hover={{ bg: "blackAlpha.800" }}
                            />
                          </Box>
                        ) : sortAttachmentsByType(attachments).length === 2 ? (
                          // Two items layout - side by side
                          <SimpleGrid columns={2} spacing={2}>
                            {sortAttachmentsByType(attachments).map((item) => (
                              <Box key={item.id} position="relative" borderRadius="md" overflow="hidden">
                                {item.mediaType === 'video' ? (
                                  <AspectRatio ratio={1}>
                                    <Box
                                      as="video"
                                      src={item.url}
                                      controls
                                      borderRadius="md"
                                    />
                                  </AspectRatio>
                                ) : item.mediaType === 'image' ? (
                                  <AspectRatio ratio={1}>
                                    <Image
                                      src={item.url}
                                      alt={item.name}
                                      borderRadius="md"
                                      objectFit="cover"
                                    />
                                  </AspectRatio>
                                ) : (
                                  // Document card
                                  <AspectRatio ratio={1}>
                                    <Flex
                                      direction="column"
                                      p={3}
                                      bg="blackAlpha.50"
                                      align="center"
                                      justify="center"
                                      borderRadius="md"
                                      height="100%"
                                      width="100%"
                                    >
                                      <Icon as={FiFileText} boxSize={10} mb={2} color="blue.500" />
                                      <Text fontSize="sm" fontWeight="medium" noOfLines={1} textAlign="center">
                                        {item.name}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {formatFileSize(item.size)}
                                      </Text>
                                    </Flex>
                                  </AspectRatio>
                                )}
                                <CloseButton
                                  position="absolute"
                                  top={1}
                                  right={1}
                                  size="sm"
                                  bg="blackAlpha.700"
                                  color="white"
                                  onClick={() => {
                                    const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : 'documents';
                                    removeAttachment(type, item.id);
                                  }}
                                  _hover={{ bg: "blackAlpha.800" }}
                                />
                                {item.mediaType === 'video' && (
                                  <Icon
                                    as={FiVideo}
                                    position="absolute"
                                    bottom={2}
                                    right={2}
                                    color="white"
                                    boxSize={5}
                                    filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                  />
                                )}
                                {item.mediaType === 'document' && (
                                  <Icon
                                    as={FiFileText}
                                    position="absolute"
                                    bottom={2}
                                    right={2}
                                    color="white"
                                    boxSize={5}
                                    filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                  />
                                )}
                              </Box>
                            ))}
                          </SimpleGrid>
                        ) : sortAttachmentsByType(attachments).length === 3 ? (
                          // Three items layout - one large, two small
                          <Flex flexDirection="row" gap={2}>
                            {/* Larger item on the left */}
                            <Box 
                              width="50%" 
                              position="relative" 
                              borderRadius="md" 
                              overflow="hidden"
                            >
                              {(() => {
                                const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos })[0];
                                return item.mediaType === 'video' ? (
                                  <AspectRatio ratio={1}>
                                    <Box
                                      as="video"
                                      src={item.url}
                                      controls
                                      borderRadius="md"
                                    />
                                  </AspectRatio>
                                ) : (
                                  <AspectRatio ratio={1}>
                                    <Image
                                      src={item.url}
                                      alt={item.name}
                                      borderRadius="md"
                                      objectFit="cover"
                                    />
                                  </AspectRatio>
                                );
                              })()}
                              <CloseButton
                                position="absolute"
                                top={1}
                                right={1}
                                size="sm"
                                bg="blackAlpha.700"
                                color="white"
                                onClick={() => {
                                  const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos })[0];
                                  removeAttachment(item.mediaType === 'image' ? 'images' : 'videos', item.id);
                                }}
                                _hover={{ bg: "blackAlpha.800" }}
                              />
                              {sortAttachmentsByType(attachments)[0].mediaType === 'video' && (
                                <Icon
                                  as={FiVideo}
                                  position="absolute"
                                  bottom={2}
                                  right={2}
                                  color="white"
                                  boxSize={5}
                                  filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                />
                              )}
                            </Box>
                            
                            {/* Two smaller items on the right */}
                            <VStack width="50%" spacing={2}>
                              {sortAttachmentsByType(attachments)
                                .slice(1, 3)
                                .map((item) => (
                                  <Box 
                                    key={item.id} 
                                    position="relative" 
                                    borderRadius="md" 
                                    overflow="hidden" 
                                    width="100%"
                                  >
                                    {item.mediaType === 'video' ? (
                                      <AspectRatio ratio={1}>
                                        <Box
                                          as="video"
                                          src={item.url}
                                          controls
                                          borderRadius="md"
                                        />
                                      </AspectRatio>
                                    ) : item.mediaType === 'image' ? (
                                      <AspectRatio ratio={1}>
                                        <Image
                                          src={item.url}
                                          alt={item.name}
                                          borderRadius="md"
                                          objectFit="cover"
                                        />
                                      </AspectRatio>
                                    ) : (
                                      // Document card
                                      <AspectRatio ratio={1}>
                                        <Flex
                                          direction="column"
                                          p={3}
                                          bg="blackAlpha.50"
                                          align="center"
                                          justify="center"
                                          borderRadius="md"
                                          height="100%"
                                          width="100%"
                                        >
                                          <Icon as={FiFileText} boxSize={8} mb={1} color="blue.500" />
                                          <Text fontSize="xs" fontWeight="medium" noOfLines={1} textAlign="center">
                                            {item.name}
                                          </Text>
                                          <Text fontSize="xs" color="gray.500">
                                            {formatFileSize(item.size)}
                                          </Text>
                                        </Flex>
                                      </AspectRatio>
                                    )}
                                    <CloseButton
                                      position="absolute"
                                      top={1}
                                      right={1}
                                      size="sm"
                                      bg="blackAlpha.700"
                                      color="white"
                                      onClick={() => {
                                        const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : 'documents';
                                        removeAttachment(type, item.id);
                                      }}
                                      _hover={{ bg: "blackAlpha.800" }}
                                    />
                                    {item.mediaType === 'video' && (
                                      <Icon
                                        as={FiVideo}
                                        position="absolute"
                                        bottom={2}
                                        right={2}
                                        color="white"
                                        boxSize={5}
                                        filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                      />
                                    )}
                                    {item.mediaType === 'document' && (
                                      <Icon
                                        as={FiFileText}
                                        position="absolute"
                                        bottom={2}
                                        right={2}
                                        color="white"
                                        boxSize={5}
                                        filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                      />
                                    )}
                                  </Box>
                                ))}
                            </VStack>
                          </Flex>
                        ) : (
                          // Four or more items - square grid
                          <SimpleGrid 
                            columns={{ base: 2, md: attachments.images.length + attachments.videos.length + attachments.documents.length >= 4 ? 3 : 2 }} 
                            spacing={2}
                          >
                            {sortAttachmentsByType(attachments)
                              .slice(0, 6) // Limit to 6 visible items
                              .map((item, index) => (
                                <Box 
                                  key={item.id} 
                                  position="relative" 
                                  borderRadius="md" 
                                  overflow="hidden"
                                >
                                  {item.mediaType === 'video' ? (
                                    <AspectRatio ratio={1}>
                                      <Box
                                        as="video"
                                        src={item.url}
                                        controls
                                        borderRadius="md"
                                      />
                                    </AspectRatio>
                                  ) : item.mediaType === 'image' ? (
                                    <AspectRatio ratio={1}>
                                      <Image
                                        src={item.url}
                                        alt={item.name}
                                        borderRadius="md"
                                        objectFit="cover"
                                      />
                                    </AspectRatio>
                                  ) : (
                                    // Document card
                                    <AspectRatio ratio={1}>
                                      <Flex
                                        direction="column"
                                        p={3}
                                        bg="blackAlpha.50"
                                        align="center"
                                        justify="center"
                                        borderRadius="md"
                                        height="100%"
                                        width="100%"
                                      >
                                        <Icon as={FiFileText} boxSize={8} mb={1} color="blue.500" />
                                        <Text fontSize="xs" fontWeight="medium" noOfLines={1} textAlign="center">
                                          {item.name}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {formatFileSize(item.size)}
                                        </Text>
                                      </Flex>
                                    </AspectRatio>
                                  )}
                                  <CloseButton
                                    position="absolute"
                                    top={1}
                                    right={1}
                                    size="sm"
                                    bg="blackAlpha.700"
                                    color="white"
                                    onClick={() => {
                                      const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : 'documents';
                                      removeAttachment(type, item.id);
                                    }}
                                    _hover={{ bg: "blackAlpha.800" }}
                                  />
                                  {item.mediaType === 'video' && (
                                    <Icon
                                      as={FiVideo}
                                      position="absolute"
                                      bottom={2}
                                      right={2}
                                      color="white"
                                      boxSize={5}
                                      filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                    />
                                  )}
                                  {item.mediaType === 'document' && (
                                    <Icon
                                      as={FiFileText}
                                      position="absolute"
                                      bottom={2}
                                      right={2}
                                      color="white"
                                      boxSize={5}
                                      filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
                                    />
                                  )}
                                  {/* Show a +X more overlay on the last visible item if there are more */}
                                  {index === 5 && sortAttachmentsByType(attachments).length > 6 && (
                                    <Box
                                      position="absolute"
                                      top={0}
                                      left={0}
                                      right={0}
                                      bottom={0}
                                      bg="blackAlpha.700"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      borderRadius="md"
                                    >
                                      <Text color="white" fontSize="xl" fontWeight="bold">
                                        +{sortAttachmentsByType(attachments).length - 6}
                                      </Text>
                                    </Box>
                                  )}
                                </Box>
                              ))}
                          </SimpleGrid>
                        )}
                      </Box>
                    )}
                  </Box>
                )}

                {/* Documents are now shown in the unified grid along with images and videos */}
              </Box>
            )}

            <Divider borderColor={borderColor} />

            <Box
              borderTopWidth="1px"
              borderColor={borderColor}
              py={3}
              px={4}
              mt={4}
              bg={useColorModeValue("gray.50", "gray.800")}
              borderBottomRadius="md"
            >
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="medium" color={useColorModeValue("gray.600", "gray.300")}>
                  Add to your post:
                </Text>

                <HStack spacing={1}>
                  <Tooltip label="Add Image" hasArrow placement="top">
                    <IconButton
                      onClick={() => fileInputRef.current.click()}
                      icon={<FiImage size={20} />}
                      size="md"
                      colorScheme="gray"
                      variant="ghost"
                      aria-label="Add Image"
                      color={useColorModeValue("green.500", "green.300")}
                      _hover={{ bg: useColorModeValue("green.50", "rgba(72, 187, 120, 0.2)") }}
                    />
                  </Tooltip>
                  <Input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" hidden />

                  <Tooltip label="Add Video" hasArrow placement="top">
                    <IconButton
                      onClick={() => videoInputRef.current.click()}
                      icon={<FiVideo size={20} />}
                      size="md"
                      colorScheme="gray"
                      variant="ghost"
                      aria-label="Add Video"
                      color={useColorModeValue("red.500", "red.300")}
                      _hover={{ bg: useColorModeValue("red.50", "rgba(245, 101, 101, 0.2)") }}
                    />
                  </Tooltip>
                  <Input type="file" ref={videoInputRef} onChange={handleVideoUpload} accept="video/*" hidden />

                  <Tooltip label="Add Document" hasArrow placement="top">
                    <IconButton
                      onClick={() => documentInputRef.current.click()}
                      icon={<FiFileText size={20} />}
                      size="md"
                      colorScheme="gray"
                      variant="ghost"
                      aria-label="Add Document"
                      color={useColorModeValue("blue.500", "blue.300")}
                      _hover={{ bg: useColorModeValue("blue.50", "rgba(66, 153, 225, 0.2)") }}
                    />
                  </Tooltip>
                  <Input type="file" ref={documentInputRef} onChange={handleDocumentUpload} accept=".pdf,.doc,.docx,.txt" hidden />
                </HStack>
              </Flex>
            </Box>

            <ModalFooter gap={2} px={4} py={3} bg={useColorModeValue("white", "gray.800")} borderTop="1px solid" borderColor={borderColor}>
              <Button
                variant="outline"
                onClick={onClose}
                size="md"
                borderRadius="md"
                fontWeight="medium"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                colorScheme="blue"
                isLoading={isLoading}
                rightIcon={<FiSend />}
                size="md"
                borderRadius="md"
                fontWeight="semibold"
                _hover={{ transform: "translateY(-2px)", boxShadow: "sm" }}
                transition="all 0.2s"
              >
                Post
              </Button>
            </ModalFooter>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;
