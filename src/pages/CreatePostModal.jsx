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
  VStack,
  HStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { FiSend, FiLink, FiExternalLink, FiBarChart2, FiPlus, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect, useMemo } from "react";

// Import component files
import AttachmentControls from "../components/post/AttachmentControls";
import TypeSpecificFields from "../components/post/TypeSpecificFields";
import AttachmentPreview from "../components/post/AttachmentPreview";
import { fileToBase64 } from "../components/post/FileUploadHelpers";

const CreatePostModal = ({ isOpen, onClose, addNewPost, user }) => {
  // Theme variables
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("blue.500", "blue.200");
  const toast = useToast();

  // Form state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("");
  const [course, setCourse] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [studyDate, setStudyDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Poll state
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [hasPoll, setHasPoll] = useState(false);

  // Attachment state
  const [attachments, setAttachments] = useState({
    images: [],
    videos: [],
    documents: [],
    links: [],
    polls: [],
  });

  // Link input state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState({ url: "", title: "" });

  // Check if we have mixed attachment types
  const hasMixedAttachments = useMemo(() => {
    const types = [
      attachments.images.length > 0,
      attachments.videos.length > 0,
      attachments.documents.length > 0,
      attachments.links.length > 0,
      attachments.polls.length > 0,
    ];
    return types.filter(Boolean).length > 1;
  }, [attachments]);

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // Reset form state
  const resetForm = () => {
    setPostTitle("");
    setPostContent("");
    setPostType("");
    setCourse("");
    setEventDate("");
    setLocation("");
    setStudyDate("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasPoll(false);
    setAttachments({
      images: [],
      videos: [],
      documents: [],
      links: [],
      polls: [],
    });
  };

  // Handle form submission
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

    // Create post data object
    const postData = {};
    postData.content = postContent;
    postData.title = postTitle;
    postData.type = postType || "Default";

    // Process attachments
    if (!postType && hasMixedAttachments) {
      postData.type = "Mixed Content";
    }

    // Process image attachments
    if (attachments.images.length > 0) {
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
      if (!postType && !hasMixedAttachments) {
        postData.type = "Course Material";
      }
      postData.documents = JSON.parse(JSON.stringify(attachments.documents));
      postData.file = attachments.documents[0].url;
      postData.fileName = attachments.documents[0].name;
      postData.fileType = attachments.documents[0].type || "application/pdf";
    }

    // Process link attachments
    if (attachments.links.length > 0) {
      if (!postType && !hasMixedAttachments) {
        postData.type = "Link";
      }
      postData.links = JSON.parse(JSON.stringify(attachments.links));
      if (!postData.link) {
        postData.link = attachments.links[0].url;
        postData.linkTitle = attachments.links[0].title;
      }
    }
    
    // Process poll attachments
    if (attachments.polls.length > 0) {
      if (!postType && !hasMixedAttachments) {
        postData.type = "Poll";
      }
      postData.polls = JSON.parse(JSON.stringify(attachments.polls));
      postData.hasPoll = true;
    }

    // Add course if selected
    if (course) {
      postData.course = course;
    }

    // Add post and reset form
    addNewPost(postContent, postData.type, postData);
    resetForm();
    onClose();
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
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
        const willHaveMixedAttachments = prev.videos.length > 0 || prev.documents.length > 0 || prev.links.length > 0;
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

  // Handle video upload
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
          const willHaveMixedAttachments = prev.images.length > 0 || prev.documents.length > 0 || prev.links.length > 0;
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

  // Handle poll creation
  const handlePollAdd = () => {
    setIsPollModalOpen(true);
  };

  // Add a poll option
  const addPollOption = () => {
    if (pollOptions.length < 6) { // Limit to 6 options
      setPollOptions([...pollOptions, ""]);
    } else {
      toast({
        title: "Maximum poll options reached",
        description: "You can add up to 6 options",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Remove a poll option
  const removePollOption = (index) => {
    if (pollOptions.length > 2) { // Keep at least 2 options
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    } else {
      toast({
        title: "Minimum poll options required",
        description: "You need at least 2 options for a poll",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Save poll to attachments
  const savePoll = () => {
    // Validate poll data
    if (!pollQuestion.trim()) {
      toast({
        title: "Poll question is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Filter out empty options and check if we have at least 2
    const validOptions = pollOptions.filter(option => option.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "At least 2 poll options are required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Create poll object
    const pollId = `poll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPoll = {
      id: pollId,
      question: pollQuestion,
      options: validOptions.map((option, index) => ({
        id: `option-${index}-${pollId}`,
        text: option,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      voters: []
    };

    // Clear existing polls (only one poll per post)
    setAttachments(prev => {
      const willHaveMixedAttachments = 
        prev.images.length > 0 || 
        prev.videos.length > 0 || 
        prev.documents.length > 0 || 
        prev.links.length > 0;

      if (willHaveMixedAttachments && !postType) {
        setPostType("Mixed Content");
      } else if (!willHaveMixedAttachments && !postType) {
        setPostType("Poll");
      }

      return {
        ...prev,
        polls: [newPoll]
      };
    });

    setHasPoll(true);
    setIsPollModalOpen(false);
    
    toast({
      title: "Poll added successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle document upload
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
          const willHaveMixedAttachments = prev.images.length > 0 || prev.videos.length > 0 || prev.links.length > 0;
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

  // Remove an attachment
  const removeAttachment = (type, id) => {
    setAttachments((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };


  return (
    <>
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
            {/* Title input */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1} ml={1} color={useColorModeValue("gray.700", "gray.300")}>
                Title
              </FormLabel>
              <Input
                placeholder="Enter a title for your post..."
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                size="md"
                borderRadius="md"
                borderWidth="2px"
                bg={useColorModeValue("white", "gray.700")}
                p={3}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
            </FormControl>
            
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
            <TypeSpecificFields
              postType={postType}
              course={course}
              setCourse={setCourse}
              eventDate={eventDate}
              setEventDate={setEventDate}
              location={location}
              setLocation={setLocation}
              studyDate={studyDate}
              setStudyDate={setStudyDate}
            />

            {/* Attachments preview */}
            <AttachmentPreview 
              attachments={attachments} 
              removeAttachment={removeAttachment} 
            />
            
            {/* Attachment controls */}
            <AttachmentControls
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              handleDocumentUpload={handleDocumentUpload}
              handleLinkAdd={() => setIsLinkModalOpen(true)}
              handlePollAdd={handlePollAdd}
            />
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="end" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiSend />} 
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>

      {/* Link Add Modal */}
      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader>Add Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>URL</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiExternalLink} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="https://example.com"
                  value={linkInput.url}
                  onChange={(e) => setLinkInput({...linkInput, url: e.target.value})}
                  autoFocus
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Title (Optional)</FormLabel>
              <Input 
                placeholder="Link Title"
                value={linkInput.title}
                onChange={(e) => setLinkInput({...linkInput, title: e.target.value})}
              />
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={() => {
              if (linkInput.url.trim()) {
                // Validate URL has a protocol
                let url = linkInput.url.trim();
                if (!/^https?:\/\//i.test(url)) {
                  url = 'https://' + url;
                }

                // Create new link object
                const newLink = {
                  id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  url: url,
                  title: linkInput.title.trim() || url,
                  type: 'link'
                };

                // Add to attachments
                setAttachments(prev => {
                  const willHaveMixedAttachments = 
                    prev.images.length > 0 || 
                    prev.videos.length > 0 || 
                    prev.documents.length > 0 || 
                    prev.links.length > 0;
                
                  if (willHaveMixedAttachments && !postType) {
                    setPostType("Mixed Content");
                  } else if (!willHaveMixedAttachments && !postType) {
                    setPostType("Link");
                  }
                
                  return {
                    ...prev,
                    links: [...prev.links, newLink]
                  };
                });

                // Reset and close modal
                setLinkInput({ url: "", title: "" });
                setIsLinkModalOpen(false);

                toast({
                  title: "Link added",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              } else {
                toast({
                  title: "URL is required",
                  status: "error",
                  duration: 2000,
                  isClosable: true,
                });
              }
            }}
          >
            Add Link
          </Button>
          <Button onClick={() => {
            setLinkInput({ url: "", title: "" });
            setIsLinkModalOpen(false);
          }}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>

      {/* Poll Modal */}
      <Modal isOpen={isPollModalOpen} onClose={() => setIsPollModalOpen(false)} size="md">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Create Poll</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Poll Question</FormLabel>
                <Input 
                  placeholder="Enter your question" 
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  autoFocus
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Poll Options</FormLabel>
                <VStack spacing={2} align="stretch">
                  {pollOptions.map((option, index) => (
                    <Flex key={index} alignItems="center">
                      <Input 
                        placeholder={`Option ${index + 1}`} 
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions];
                          newOptions[index] = e.target.value;
                          setPollOptions(newOptions);
                        }}
                        mr={2}
                      />
                      {pollOptions.length > 2 && (
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="ghost"
                          onClick={() => removePollOption(index)}
                        >
                          <Icon as={FiTrash2} />
                        </Button>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </FormControl>
              
              <Button 
                leftIcon={<Icon as={FiPlus} />} 
                variant="outline" 
                colorScheme="blue" 
                size="sm"
                onClick={addPollOption}
                isDisabled={pollOptions.length >= 6}
              >
                Add Option
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3}
              leftIcon={<Icon as={FiBarChart2} />}
              onClick={savePoll}
            >
              Create Poll
            </Button>
            <Button onClick={() => {
              setPollQuestion("");
              setPollOptions(["", ""]);
              setIsPollModalOpen(false);
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePostModal;