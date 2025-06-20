import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  useColorModeValue,
  Badge,
  Avatar,
  Icon,
  IconButton,
  Image,
  HStack,
  VStack,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Tooltip,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  ModalCloseButton,
  MenuItem,
  ModalBody,
  Grid,
  GridItem,
  ModalOverlay,
  ModalContent,
  SimpleGrid,
  useColorMode,
  Modal
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiBookmark,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFile,
  FiFileText,
  FiHeart,
  FiLink,
  FiList,
  FiMaximize2,
  FiMessageCircle,
  FiMoreHorizontal,
  FiMoreVertical,
  FiSend,
  FiShare2,
  FiStar,
  FiTag,
  FiThumbsUp,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
  FiX,
  FiZoomIn,
  FiZoomOut
} from "react-icons/fi";
import { socialIcons } from "../assets/socialIcons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getResourceById, toggleUpvote, toggleSaveResource } from "../services/resourceService";

const MotionBox = motion(Box);

const ResourceContentPage = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // UI hooks
  const toast = useToast();
  const { isOpen: isCommentsOpen, onToggle: toggleComments, onClose: closeComments, onOpen: openComments } = useDisclosure({ defaultIsOpen: true });
  const commentInputRef = useRef(null);
  const contentRef = useRef(null);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle document downloads
  const downloadFile = async (url, fileName, fileType) => {
    try {
      console.log('Download request for:', { url, fileName, fileType });

      // Extract filename from URL to use with download API endpoint
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];

      // Intelligently determine file type if not explicitly provided
      let type = fileType;

      if (!type) {
        // Check if we can determine type from the URL
        if (url.includes('/images/') || url.includes('image')) {
          type = 'images';
        } else if (url.includes('/videos/') || url.includes('video')) {
          type = 'videos';
        } else {
          // Default to documents for anything else
          type = 'documents';
        }
      }

      console.log('Using file type for download:', type);

      // Use the download API endpoint with file type
      const downloadUrl = `http://127.0.0.1:8000/api/resources/download/${type}/${filename}`;

      // Use fetch to get the file as a blob
      const token = localStorage.getItem('authToken');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Making download request to:', downloadUrl);

      const response = await fetch(downloadUrl, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Download failed' })); // Try to parse error, fallback if not JSON
        throw new Error(errorData.message || `Download failed with status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create object URL from blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a hidden anchor element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || filename || 'download';
      link.style.display = 'none';

      // This is necessary for Firefox
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  // State for interactive elements
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(47);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const [resource, setResource] = useState(null);

  // Simple reading preferences
  const [fontSize, setFontSize] = useState(16);
  const [readingProgress, setReadingProgress] = useState(0);
  // Poll voting state
  const [userVotes, setUserVotes] = useState({}); // { [pollId]: optionId }
  const [votedPolls, setVotedPolls] = useState({}); // { [pollId]: true }

  // Utility function to resolve URLs (handle both relative and absolute URLs)
  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // For relative URLs from the API that start with /storage
    return `${"http://127.0.0.1:8000"}${url}`;
  };

  // Debug function to log image URLs
  const debugImageUrls = () => {
    if (resource?.images?.length) {
      console.log("Image URLs:", resource.images.map(img => ({
        original: img.url,
        resolved: resolveUrl(img.url)
      })));
    }
  };

  // Function to handle bookmarking the resource
  const handleBookmark = async () => {
    try {
      // Toggle saved state optimistically
      setIsSaved(prev => !prev);

      if (resource?.id) {
        // Call API to update resource saved status
        await toggleSaveResource(resource.id);

        // Show success toast
        toast({
          title: isSaved ? "Resource removed from saved items" : "Resource saved successfully",
          status: "success",
          duration: 2000,
          isClosable: true
        });
      }
    } catch (error) {
      // Revert optimistic update if there's an error
      setIsSaved(prev => !prev);

      toast({
        title: "Error",
        description: "Could not update saved status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });

      console.error("Error updating bookmark status:", error);
    }
  };

  // Fetch resource data from backend
  useEffect(() => {
    const fetchResource = async () => {
      setIsLoading(true);
      try {
        const data = await getResourceById(id);
        console.log("Resource data:", data);

        // Transform API response to match UI expectations
        const formatted = {
          id: data.id,
          type: data.attachments?.[0]?.file_type?.toUpperCase() || "Resource",
          title: data.title,
          difficulty: "",
          fileSize: "",
          dateAdded: data.created_at,
          lastUpdated: data.updated_at,
          readTime: "",
          author: {
            id: data.user?.id,
            name: `${data.user?.first_name || ""} ${data.user?.last_name || ""}`.trim() || data.user?.username || "Unknown",
            // title: data.user?.primary_role || "",
            avatar: data.user?.avatar_url,
            verified: !!data.user?.is_verified,
            resources: null,
          },
          likes: data.upvote_count ?? 0,
          shares: 0,
          comments: data.comments || [],
          images: (data.attachments || []).filter(att => att.file_type === "image"),
          videos: (data.attachments || []).filter(att => att.file_type === "video"),
          documents: (data.attachments || []).filter(att => att.file_type === "document"),
          content: data.description,
          related: [],
          // Normalize polls similar to ResourceCard
          polls: (() => {
            if (!data.polls) return [];
            const pollsArray = Array.isArray(data.polls) ? data.polls : [data.polls];
            return pollsArray.map((poll) => ({
              id: poll.id,
              question: poll.question,
              options: (poll.options || []).map((opt) => ({
                id: opt.id,
                text: opt.option_text ?? opt.text ?? '',
                votes: opt.vote_count ?? opt.votes ?? 0,
              })),
            }));
          })(),
        };

        setResource(formatted);

        // Initialize saved state from API data - explicitly check for is_saved property
        console.log("Resource saved status:", data.is_saved);
        setIsSaved(data.is_saved === true);

        setIsLiked(!!data.is_upvoted);
        setLikes(data.upvote_count ?? 0);
        setComments((formatted.comments || []).sort((a, b) => b.likes - a.likes));

        // Debug image URLs after setting resource
        setTimeout(() => {
          console.log('Resource images:', formatted.images);
          if (formatted.images?.length) {
            formatted.images.forEach(img => {
              console.log('Image URL:', img.url);
              console.log('Resolved URL:', resolveUrl(img.url));
            });
          }
        }, 100);
      } catch (err) {
        console.error("Failed to fetch resource", err);
        toast({
          title: "Failed to load resource",
          description: err.message || "An unexpected error occurred",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  // Track scroll position for progress bar
  useEffect(() => {
    const trackScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', trackScroll);
      return () => contentElement.removeEventListener('scroll', trackScroll);
    }
  }, []);

  // Enhanced handler functions
  const handleLike = async () => {
    const previousLiked = isLiked;
    const previousLikes = likes;
    setIsLiked(!previousLiked);
    setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);
    try {
      await toggleUpvote(id);
      toast({
        title: previousLiked ? "Upvote removed" : "Resource upvoted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      // Revert state on error
      setIsLiked(previousLiked);
      setLikes(previousLikes);
      toast({
        title: "Unable to update upvote",
        description: err.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle comment upvote
  const handleCommentUpvote = (commentId) => {
    setComments(prevComments => prevComments.map(comment => {
      if (comment.id === commentId) {
        // Check if already upvoted (in a real app, would track this in state)
        const isUpvoted = comment.isUpvoted || false;
        return {
          ...comment,
          likes: isUpvoted ? comment.likes - 1 : comment.likes + 1,
          isUpvoted: !isUpvoted
        };
      }
      return comment;
    }).sort((a, b) => b.likes - a.likes)); // Sort by likes count after update

    toast({
      title: "Comment upvote updated",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from collection" : "Saved to collection",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShare = (method) => {
    const resourceUrl = window.location.href;
    let shareUrl = '';

    switch (method) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(resourceUrl)}&text=${encodeURIComponent(resource.title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(resourceUrl)}&title=${encodeURIComponent(resource.title)}&summary=${encodeURIComponent(resource.description)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resourceUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(resourceUrl).then(() => {
          toast({
            title: "Link copied!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        });
        return; // Exit after copying
      default:
        // A general share action could be implemented here if needed
        navigator.clipboard.writeText(resourceUrl).then(() => {
          toast({
            title: "Link copied!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        });
        return;
    }

    // Open the share URL in a new window
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://i.pravatar.cc/150?img=12",
        verified: false
      },
      text: commentText,
      date: new Date().toISOString(),
      likes: 0,
      isUpvoted: false
    };

    // Add new comment and sort by upvotes
    setComments(prev => [...prev, newComment].sort((a, b) => b.likes - a.likes));
    setCommentText("");
    // Open comments section if closed
    if (!isCommentsOpen) {
      openComments();
    }

    toast({
      title: "Comment added",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const focusCommentInput = () => {
    toggleComments();
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return formatDate(dateString);
    } else if (diffDay > 0) {
      return `${diffDay}d ago`;
    } else if (diffHour > 0) {
      return `${diffHour}h ago`;
    } else if (diffMin > 0) {
      return `${diffMin}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isLoading && !resource) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
        <Text fontSize="lg">Resource not found.</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">

      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        {/* Simple Top Navigation */}
        <Flex
          w="full"
          align="center"
          justify="space-between"
          mb={4}
          p={3}
          bg={cardBg}
          borderRadius="md"
          boxShadow="sm"
          position="sticky"
          top="2"
          zIndex="sticky"
        >
          <Button
            leftIcon={<FiArrowLeft />}
            as={Link}
            to="/resources"
            variant="ghost"
            size="md"
          >
            Back to Resources
          </Button>

          <HStack spacing={3}>
            <IconButton
              icon={<FiBookmark />}
              variant={isSaved ? "solid" : "outline"}
              colorScheme={isSaved ? "blue" : "gray"}
              size="sm"
              onClick={handleBookmark}
              aria-label="Bookmark"
            />

            <IconButton
              icon={<FiShare2 />}
              aria-label="Share resource"
              variant="outline"
              size="sm"
              onClick={handleShare}
            />
          </HStack>
        </Flex>

        {/* Main content area with 2-column layout */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Main Content Column */}
          <GridItem>
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              {isLoading ? (
                <CardBody>
                  <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="10" mb={6} />
                  <SkeletonText mt="4" noOfLines={4} spacing="4" mb={6} />
                  <Skeleton height="300px" mb={6} />
                  <SkeletonText mt="4" noOfLines={8} spacing="4" />
                </CardBody>
              ) : (
                <>
                  {/* Post Header */}
                  <CardHeader pb={3}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <HStack spacing={3}>
                        <Avatar src={resource.author.avatar} name={resource.author.name} size="md" />
                        <Box>
                          <HStack>
                            <Text fontWeight="medium">{resource.author.name}</Text>
                            {resource.author.verified && <Icon as={FiCheck} color="blue.500" boxSize={3.5} />}
                          </HStack>
                          <Text fontSize="sm" color={mutedText}>
                            {formatTimeAgo(resource.dateAdded)}
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  </CardHeader>

                  {/* Post Content */}
                  <CardBody pt={2}>
                    <Box mb={4}>
                      <Text fontSize="xl" lineHeight="1.6" whiteSpace="pre-wrap">
                        {resource.content}
                      </Text>
                    </Box>
                  </CardBody>
                </>
              )}
            </Card>

            {/* Media Attachments */}
            {(resource?.images?.length || 0) > 0 && (
              <VStack spacing={4} mb={4}>
                <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
                  <ModalOverlay />
                  <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton color="white" />
                    <ModalBody p={0}>
                      <Image src={selectedImage} alt="Preview" borderRadius="md" />
                    </ModalBody>
                  </ModalContent>
                </Modal>

                {resource.images.map((img) => (
                  <Box
                    key={img.id || img.url}
                    w="full"
                    h={{ base: '200px', md: '350px' }}
                    overflow="hidden"
                    borderRadius="md"
                    position="relative"
                    cursor="pointer"
                    _hover={{ '& img': { transform: 'scale(1.03)' } }}
                    onClick={() => {
                      setSelectedImage(resolveUrl(img.url));
                      onOpen();
                    }}

                  >
                    <Image
                      src={resolveUrl(img.url)}
                      alt={img.original_name || resource.title}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      transition="transform 0.3s ease"
                      onError={(e) => {
                        console.error(`Failed to load image: ${img.url}`, e);
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                      }}
                      fallback={
                        <Box w="100%" h="100%" bg="gray.200" display="flex" alignItems="center" justifyContent="center">
                          <Text>Loading image...</Text>
                        </Box>
                      }
                    />
                    <IconButton
                      icon={<FiDownload />}
                      size="sm"
                      position="absolute"
                      top="4"
                      right="4"
                      colorScheme="blue"
                      bg="whiteAlpha.800"
                      _hover={{ bg: 'blackAlpha.800' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileName = img.original_name || `Image-${resource.title}`;
                        downloadFile(img.url, fileName, 'images');
                        toast({
                          title: 'Downloading image',
                          description: `${fileName} is being downloaded`,
                          status: 'info',
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                      aria-label="Download image"
                    />
                  </Box>
                ))}
              </VStack>
            )}

            {(resource?.videos?.length || 0) > 0 && (
              <VStack spacing={4} mb={4}>
                {resource.videos.map((vid) => (
                  <Box key={vid.id || vid.url} position="relative">
                    <video src={resolveUrl(vid.url)} style={{ width: '100%', borderRadius: '8px' }} controls />
                    <IconButton
                      icon={<FiDownload />}
                      size="sm"
                      position="absolute"
                      top="4"
                      right="4"
                      colorScheme="blue"
                      bg="whiteAlpha.800"
                      _hover={{ bg: 'blackAlpha.800' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileName = vid.original_name || `Video-${resource.title}`;
                        downloadFile(vid.url, fileName, 'videos');
                        toast({
                          title: 'Downloading video',
                          description: `${fileName} is being downloaded`,
                          status: 'info',
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                      aria-label="Download video"
                    />
                  </Box>
                ))}
              </VStack>
            )}

            {/* Document Attachments */}
            {resource?.documents?.length > 0 && (
              <Box mb={4}>
                <Heading size="md" mb={2}>Attachments</Heading>
                <VStack spacing={2} align="stretch">
                  {resource.documents.map((doc, idx) => (
                    <Flex
                      key={doc.id || idx}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      alignItems="center"
                      justifyContent="space-between"
                      bg={cardBg}
                      _hover={{ bg: hoverBg }}
                      cursor="pointer"
                    >
                      <HStack spacing={3}>
                        <Icon as={FiFile} boxSize={5} color={accentColor} />
                        <Text fontWeight="medium">{doc.original_name || `Document ${idx + 1}`}</Text>
                      </HStack>
                      <HStack>
                        <IconButton
                          icon={<FiExternalLink />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(resolveUrl(doc.url), '_blank');
                          }}
                          aria-label="Preview document"
                        />
                        <IconButton
                          icon={<FiDownload />}
                          size="sm"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            const fileName = doc.original_name || `Document-${idx + 1}`;
                            downloadFile(doc.url, fileName, 'documents');
                            toast({
                              title: 'Downloading document',
                              description: `${fileName} is being downloaded`,
                              status: 'info',
                              duration: 2000,
                              isClosable: true,
                            });
                          }}
                          aria-label="Download document"
                        />
                      </HStack>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Polls */}
            {(resource?.polls?.length || 0) > 0 && (
              <Box mb={4}>
                {resource.polls.slice(0, 1).map((poll, index) => {
                  const pollId = poll.id || `poll-${index}`;
                  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                  const hasVoted = votedPolls[pollId];
                  const selectedOption = userVotes[pollId];

                  const handleVote = (optionId) => {
                    setUserVotes(prev => ({
                      ...prev,
                      [pollId]: optionId,
                    }));
                    if (!hasVoted) {
                      setVotedPolls(prev => ({
                        ...prev,
                        [pollId]: true,
                      }));
                      toast({ title: "Vote recorded", status: "success", duration: 2000, isClosable: true });
                    }
                  };

                  return (
                    <Box key={pollId} bg={useColorModeValue("gray.50", "gray.700")} p={4} borderRadius="xl">
                      <Text fontWeight="semibold" mb={3}>{poll.question}</Text>
                      <VStack spacing={2} align="stretch">
                        {poll.options.map((option, optIdx) => {
                          const optionId = option.id || `option-${optIdx}`;
                          const isSelected = selectedOption === optionId;
                          const optionVotes = option.votes || 0;
                          const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                          return (
                            <Box key={optionId} position="relative" p={3} borderRadius="lg" cursor="pointer" onClick={() => handleVote(optionId)} bg={useColorModeValue("white", "gray.800")} border="2px solid" borderColor={isSelected ? "blue.400" : "transparent"} _hover={{ borderColor: isSelected ? "blue.500" : useColorModeValue("gray.200", "gray.600") }}>
                              {hasVoted && (
                                <Box position="absolute" left={0} top={0} bottom={0} width={`${percentage}%`} bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")} opacity={0.3} borderRadius="lg" />
                              )}
                              <Flex justify="space-between" align="center" position="relative">
                                <Text>{option.text}</Text>
                                {hasVoted && <Text fontWeight="bold" color={isSelected ? "blue.500" : mutedText}>{percentage}%</Text>}
                              </Flex>
                            </Box>
                          );
                        })}
                      </VStack>
                      {hasVoted && (
                        <Text fontSize="sm" color={mutedText} mt={2} textAlign="center">{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Post Actions */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Flex px={2} justify="space-between" align="center" mb={2}>
                    <HStack spacing={2}>
                      <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                      <Text fontSize="sm" color={mutedText}>{likes} upvotes</Text>
                    </HStack>
                    <Text fontSize="sm" color={mutedText}>{comments.length} comments</Text>
                  </Flex>

                  <Divider mb={2} />

                  <Flex w="full" justify="space-between" px={2}>
                    <Button
                      flex="1"
                      leftIcon={<Icon as={FiTrendingUp} color={isLiked ? "green.500" : undefined} boxSize={5} />}
                      onClick={handleLike}
                      variant="ghost"
                      colorScheme="gray"
                      size="md"
                      fontWeight={isLiked ? "bold" : "normal"}
                      color={isLiked ? "green.500" : undefined}
                    >
                      {isLiked ? "Upvoted" : "Upvote"}
                    </Button>
                    <Menu placement="top" isLazy>
                      <MenuButton
                        as={Button}
                        flex="1"
                        variant="ghost"
                        colorScheme="gray"
                        size="md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HStack justify="center" spacing={1}>
                          <Icon as={FiShare2} boxSize={5} />
                          <Text>Share</Text>
                        </HStack>
                      </MenuButton>
                      <Portal>
                        <MenuList zIndex={2000} shadow="lg" borderRadius="xl" p={4} onClick={(e) => e.stopPropagation()}>
                        <Text fontWeight="semibold" mb={3}>Share this post</Text>
                        <SimpleGrid columns={2} spacing={3}>
                          <VStack
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              toast({ title: "Link copied!", status: "success", duration: 2000 });
                            }}
                            cursor="pointer"
                            p={2}
                            borderRadius="lg"
                            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                          >
                            <Box dangerouslySetInnerHTML={{ __html: socialIcons.copy }} />
                            <Text fontSize="xs">Copy Link</Text>
                          </VStack>
                          <VStack
                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out: ${resource.title} ${window.location.href}`)}`, '_blank')}
                            cursor="pointer"
                            p={2}
                            borderRadius="lg"
                            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                          >
                            <Box dangerouslySetInnerHTML={{ __html: socialIcons.whatsapp }} />
                            <Text fontSize="xs">WhatsApp</Text>
                          </VStack>
                        </SimpleGrid>
                      </MenuList>
                      </Portal>
                    </Menu>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>

            {/* Comments Section */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <CardBody>
                <Box pt={4}>
                  <Divider mb={4} />
                </Box>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Discussion ({comments.length})</Heading>
                  <Button
                    rightIcon={isCommentsOpen ? <FiChevronUp /> : <FiChevronDown />}
                    variant="ghost"
                    size="sm"
                    onClick={toggleComments}
                  >
                    {isCommentsOpen ? "Hide" : "Show"}
                  </Button>
                </Flex>

                {isCommentsOpen && (
                  <VStack align="stretch" spacing={6}>
                    <Box p={4} borderWidth="1px" borderRadius="lg" bg={cardBg}>
                      <HStack align="start" spacing={3}>
                        <Avatar size="sm" src="https://i.pravatar.cc/150?img=12" />
                        <Textarea
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add to the discussion..."
                          variant="unstyled"
                          rows={2}
                          resize="none"
                        />
                        <IconButton
                          icon={<FiSend />}
                          aria-label="Send comment"
                          onClick={handleAddComment}
                          colorScheme="blue"
                          isRound
                        />
                      </HStack>
                    </Box>

                    {comments.map((comment) => (
                      <MotionBox
                        key={comment.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg={cardBg}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <HStack align="start" spacing={3}>
                          <Avatar size="sm" src={comment.user.avatar} name={comment.user.name} />
                          <Box flex="1">
                            <HStack justify="space-between">
                              <Box>
                                <Text fontWeight="600">{comment.user.name}</Text>
                                <Text fontSize="sm" color={mutedText}>
                                  {formatTimeAgo(comment.date)}
                                </Text>
                              </Box>
                              <HStack spacing={2}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  leftIcon={<Icon as={FiTrendingUp} color={comment.isUpvoted ? "green.500" : undefined} />}
                                  color={comment.isUpvoted ? "green.500" : undefined}
                                  fontWeight={comment.isUpvoted ? "bold" : "normal"}
                                  onClick={() => handleCommentUpvote(comment.id)}
                                >
                                  {comment.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Reply
                                </Button>
                              </HStack>
                            </HStack>
                            <Text mt={2}>{comment.text}</Text>
                          </Box>
                        </HStack>
                      </MotionBox>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>


          {/* Right Sidebar - Study Tools */}
          <GridItem>
            <Box position="sticky" top="24">
              {/* Resource Quick Info */}
              <Card mb={6} bg={cardBg}>
                <CardHeader pb={2}>
                  <Heading size="md">Quick Info</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">

                    <Box>
                      <Text fontSize="sm" color={mutedText} mb={1}>Last Updated</Text>
                      <HStack>
                        <Text fontWeight="medium">{resource?.lastUpdated ? formatDate(resource.lastUpdated) : "-"}</Text>
                      </HStack>
                    </Box>

                    <Divider />
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}

export default ResourceContentPage;