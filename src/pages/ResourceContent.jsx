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
  Grid ,
  ModalCloseButton,
  MenuItem,
  ModalBody,
  SimpleGrid, // Changed from Grid
  GridItem,
  ModalOverlay,
  ModalContent,
  useColorMode,
  Modal,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton
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
  FiZoomOut,
  FiEdit,
  FiTrash,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { socialIcons } from "../assets/socialIcons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, lazy } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getResourceById, toggleUpvote, toggleSaveResource, votePollOption, toggleCommentUpvote, addComment, updateComment, deleteComment } from "../services/resourceService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ReactPlayer from 'react-player';
import QuickInfoCard from "../components/resources/QuickInfoCard";

const ReactPlayer = lazy(() => import('react-player'));


const MotionBox = motion(Box);

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        left: "10px",
        zIndex: 1,
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClick}
    >
    </Box>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        right: "10px",
        zIndex: 1,
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClick}
    >
    </Box>
  );
};

const ResourceContentPage = () => {
  // Delete confirmation dialog
  const { isOpen: isDeleteOpen, onOpen: openDeleteDialog, onClose: closeDeleteDialog } = useDisclosure();
  const cancelDeleteRef = useRef();
  const [commentToDelete, setCommentToDelete] = useState(null);
  // State for comment editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  // Router hooks
  const { id } = useParams();
  const { user: currentUser } = useAuth();
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
  // local poll data with up-to-date counts
  const [pollData, setPollData] = useState([]);

  // sync poll data whenever resource changes
  useEffect(() => {
    setPollData(resource?.polls || []);
  }, [resource]);

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
          courseName: data.course?.title || data.course_name || "",
          courseCode: data.course?.code || data.course_code || "",
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
        // Map comments from API response to component structure
        const mappedComments = (data.comments || []).map(comment => ({
          id: comment.id,
          text: comment.body,
          date: comment.created_at,
          user: comment.user,
          likes: comment.upvote_count || 0,
          isUpvoted: comment.is_upvoted || false
        }));

        setComments(mappedComments);

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
          isClosable: true
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

  // Handle comment upvotes via API
  const handleCommentUpvote = async (commentId) => {
    try {
      const { message, upvote_count, is_upvoted } = await toggleCommentUpvote(commentId);

      // Update comment upvote state
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isUpvoted: is_upvoted, likes: upvote_count }
          : comment
      ).sort((a, b) => b.likes - a.likes)); // Sort by likes count after update

      toast({
        title: message || (is_upvoted ? "Comment upvoted" : "Upvote removed"),
        status: "success",
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast({
        title: "Error",
        description: "Could not update upvote. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
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

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: resource?.title || 'Resource',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Resource link copied to clipboard",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Share failed', err);
      toast({
        title: 'Unable to share',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };



  // Start editing a comment
  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setNewCommentText("");
    setEditingText("");
  };

  // Submit edited comment
  const submitEditedComment = async () => {
    if (!editingCommentId || !editingText.trim()) return;
    try {
      await updateComment(editingCommentId, editingText.trim());
      toast({ title: "Comment updated", status: "success", duration: 2000, isClosable: true });
      // Refresh resource to get latest comments
      const data = await getResourceById(id);
      const mapped = (data.comments || []).map(c => ({
        id: c.id, text: c.body, date: c.created_at, user: c.user, likes: c.upvote_count || 0, isUpvoted: c.is_upvoted || false
      }));
      setComments(mapped);
      setEditingText("");
      cancelEditing();
    } catch (err) {
      console.error('Update comment error', err);
      toast({ title: 'Failed to update comment', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    openDeleteDialog();
  };

  // Confirm deletion
  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment(commentToDelete);
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      toast({ title: 'Comment deleted', status: 'success', duration: 2000, isClosable: true });
    } catch (err) {
      console.error('Delete comment error', err);
      toast({ title: 'Failed to delete comment', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setCommentToDelete(null);
      closeDeleteDialog();
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      // Call API to add comment
      await addComment(id, commentText.trim());

      // Clear comment input right away for better UX
      setCommentText("");

      // Open comments section if closed
      if (!isCommentsOpen) {
        openComments();
      }

      // Show toast notification
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Fetch updated resource data to get complete comment information
      const data = await getResourceById(id);

      // Map comments from API response with all required fields
      const mappedComments = (data.comments || []).map(comment => ({
        id: comment.id,
        text: comment.body,
        date: comment.created_at,
        user: comment.user,
        likes: comment.upvote_count || 0,
        isUpvoted: comment.is_upvoted || false
      }));

      // Update comments state with fresh data
      setComments(mappedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
                            {/* if user is resource author, show name as You */}
                            <Text fontWeight="medium">{resource.author.id === currentUser?.id ? "You" : resource.author.name}</Text>
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



            {/* Attachments */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <Tabs variant="enclosed" isLazy colorScheme="blue">
                <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap" px={{ base: 2, md: 4 }} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                  {(resource?.images?.length || resource?.videos?.length) > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Media</Tab>}
                  {resource?.documents?.length > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Documents</Tab>}
                  {pollData.length > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Polls</Tab>}
                </TabList>

                <TabPanels>
                  {/* MEDIA ---------------------------------------------------- */}
                  {(resource?.images?.length || resource?.videos?.length) > 0 && (
                    <TabPanel px={0}>
                      {resource?.images?.length > 0 && (
                        <Card mb={4} width="full" maxW="container.md" mx="auto" bg={cardBg} borderColor={borderColor} borderWidth="1px" boxShadow="sm">
                          <CardBody p={0}>
                            {resource.images.length > 1 ? (
                              <Box position="relative" width="full">
                                <Slider
                                  dots={true}
                                  infinite={false}
                                  speed={500}
                                  slidesToShow={1}
                                  slidesToScroll={1}
                                  adaptiveHeight={true}
                                  arrows={resource.images.length > 1}
                                  prevArrow={resource.images.length > 1 ? <CustomPrevArrow /> : null}
                                  nextArrow={resource.images.length > 1 ? <CustomNextArrow /> : null}
                                  css={{
                                    '.slick-slide': {
                                      padding: '0 4px'
                                    },
                                    '.slick-list': {
                                      margin: '0 -4px'
                                    }
                                  }}
                                >
                                  {resource.images.map((img) => (
                                    <Box
                                      key={img.id || img.url}
                                      width="full"
                                      height={{ base: '200px', md: '350px' }}
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
                                        }}
                                        aria-label="Download image"
                                      />
                                    </Box>
                                  ))}
                                </Slider>
                              </Box>
                            ) : (
                              <Box
                                key={resource.images[0].id || resource.images[0].url}
                                width="full"
                                height={{ base: '200px', md: '350px' }}
                                overflow="hidden"
                                borderRadius="md"
                                position="relative"
                                cursor="pointer"
                                _hover={{ '& img': { transform: 'scale(1.03)' } }}
                                onClick={() => {
                                  setSelectedImage(resolveUrl(resource.images[0].url));
                                  onOpen();
                                }}
                              >
                                <Image
                                  src={resolveUrl(resource.images[0].url)}
                                  alt={resource.images[0].original_name || resource.title}
                                  width="100%"
                                  height="100%"
                                  objectFit="cover"
                                  transition="transform 0.3s ease"
                                  onError={(e) => {
                                    console.error(`Failed to load image: ${resource.images[0].url}`, e);
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
                                    const fileName = resource.images[0].original_name || `Image-${resource.title}`;
                                    downloadFile(resource.images[0].url, fileName, 'images');
                                  }}
                                  aria-label="Download image"
                                />
                              </Box>
                            )}
                          </CardBody>
                        </Card>
                      )}
                      {resource?.videos?.length > 0 && (
                        <VStack spacing={4} mb={4}>

                          {resource.videos.map((vid) => (
                            <Box key={vid.id || vid.url} position="relative">
                              <ReactPlayer
                                url={resolveUrl(vid.url)}
                                width="100%"
                                height="100%"
                                controls
                                playing={false}
                                onError={(e) => console.error(`Failed to load video: ${vid.url}`, e)}
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
                    </TabPanel>
                  )}

                  {/* DOCUMENTS ------------------------------------------------ */}
                  {resource?.documents?.length > 0 && (
                    <TabPanel px={0}>
                      <Box mb={4}>
                      <SimpleGrid spacing={3}>
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
                        </SimpleGrid>
                      </Box>
                    </TabPanel>
                  )}

                  {/* POLLS ---------------------------------------------------- */}
                  {pollData.length > 0 && (
                    <TabPanel px={0}>
                      <Box mb={4}>
                        {pollData.slice(0, 1).map((poll, index) => {
                          const pollId = poll.id || `poll-${index}`;
                          const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                          const hasVoted = votedPolls[pollId];
                          const selectedOption = userVotes[pollId];

                          const handleVote = async (optionId) => {
                            try {
                              const { message, poll: updated } = await votePollOption(optionId);
                              const updatedPoll = {
                                id: updated.id,
                                question: updated.question,
                                options: (updated.options || []).map((opt) => ({
                                  id: opt.id,
                                  text: opt.option_text ?? opt.text ?? '',
                                  votes: opt.vote_count ?? opt.votes ?? 0,
                                })),
                              };
                              setPollData(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p));

                              if (message.startsWith('Vote removed')) {
                                setUserVotes(prev => ({ ...prev, [poll.id]: null }));
                                setVotedPolls(prev => ({ ...prev, [poll.id]: false }));
                              } else {
                                setUserVotes(prev => ({ ...prev, [poll.id]: optionId }));
                                setVotedPolls(prev => ({ ...prev, [poll.id]: true }));
                              }
                              toast({ title: message, status: 'success', duration: 2000, isClosable: true });
                            } catch (err) {
                              console.error('Vote error', err);
                              toast({ title: 'Failed to record vote', description: err.message || 'Try again later', status: 'error', duration: 3000, isClosable: true });
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
                                      <Box position="absolute" left={0} top={0} bottom={0} width={`${percentage}%`} bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")} opacity={0.3} borderRadius="lg" />
                                      <Flex justify="space-between" align="center" position="relative">
                                        <Text>{option.text}</Text>
                                        <Text fontWeight="bold" color={isSelected ? "blue.500" : mutedText}>{percentage}%</Text>
                                      </Flex>
                                    </Box>
                                  );
                                })}
                              </VStack>
                              <Text fontSize="sm" color={mutedText} mt={2} textAlign="center">{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</Text>
                            </Box>
                          );
                        })}
                      </Box>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Card>






            {/* Comments Section */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <CardBody>
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
                          aria-label={editingCommentId ? "Save edited comment" : "Send comment"}
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
                          <Avatar size="sm" src={comment.user.avatar_url} name={comment.user.id === currentUser?.id ? "You" : `${comment.user.first_name} ${comment.user.last_name}`} />
                          <Box flex="1">
                            <HStack justify="space-between">
                              <Box>
                                <Text fontWeight="600">{comment.user.id === currentUser?.id ? "You" : `${comment.user.first_name} ${comment.user.last_name}`}</Text>
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
                                  {comment.likes || 0}
                                </Button>
                                {comment.user.id === currentUser?.id && (
                                  <HStack spacing={1}>
                                    <IconButton aria-label="Edit" variant="ghost" size="sm" icon={<FiEdit />} onClick={() => startEditingComment(comment)} />
                                    <IconButton aria-label="Delete" variant="ghost" size="sm" icon={<FiTrash />} onClick={() => openDeleteConfirm(comment.id)} />
                                  </HStack>
                                )}
                              </HStack>
                            </HStack>
                            {editingCommentId === comment.id ? (
                              <Box mt={2}>
                                <Textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  rows={2}
                                  resize="vertical"
                                />
                                <HStack mt={2} spacing={2}>
                                  <Button size="sm" colorScheme="blue" onClick={submitEditedComment}>Save</Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEditing}>Cancel</Button>
                                </HStack>
                              </Box>
                            ) : (
                              <Text mt={2}>{comment.text}</Text>
                            )}
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
              <QuickInfoCard
                 courseName={resource?.courseName}
                 courseCode={resource?.courseCode}
                lastUpdated={resource?.lastUpdated}
                likes={likes}
                commentsCount={comments?.length}
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Floating Action Bar */}
        <Box
          position="fixed"
          bottom={{ base: 4, md: 8 }}
          right={{ base: 4, md: 8 }}
          zIndex="tooltip"
        >
          <VStack spacing={3}>
            <IconButton
              icon={<FiTrendingUp />}
              variant={isLiked ? 'solid' : 'outline'}
              colorScheme={isLiked ? 'blue' : 'gray'}
              size="lg"
              aria-label="Upvote"
              onClick={handleLike}
            />
            <IconButton
              icon={<FiBookmark />}
              variant={isSaved ? 'solid' : 'outline'}
              colorScheme={isSaved ? 'blue' : 'gray'}
              size="lg"
              aria-label="Save"
              onClick={handleBookmark}
            />
            <IconButton
              icon={<FiShare2 />}
              variant="outline"
              colorScheme="gray"
              size="lg"
              aria-label="Share"
              onClick={handleShare}
            />
          </VStack>
        </Box>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={closeDeleteDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Comment
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelDeleteRef} onClick={closeDeleteDialog}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteComment} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
          <ModalOverlay />
          <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh" m="auto">
            <ModalCloseButton color="white" />
            <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
              <Image src={selectedImage} alt="Preview" borderRadius="md" maxW="90vw" maxH="90vh" objectFit="contain" />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default ResourceContentPage;