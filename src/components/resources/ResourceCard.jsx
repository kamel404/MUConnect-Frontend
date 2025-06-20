import React, { memo, useState, useMemo, useCallback, useRef } from "react";
import { getCurrentUserSync } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  IconButton,
  HStack,
  VStack,
  Avatar,
  useToast,
  Tag,
  TagLabel,
  Flex,
  Heading,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Skeleton,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AspectRatio,
  Image,
  SimpleGrid,
  Grid,
  GridItem,
  Circle,
  Center,
  Wrap,
  WrapItem,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Icon,
  useToken
} from "@chakra-ui/react";
import { socialIcons } from "../../assets/socialIcons";
import {
  FiBookmark,
  FiHeart,
  FiShare2,
  FiMessageCircle,
  FiDownload,
  FiMoreHorizontal,
  FiEye,
  FiTrendingUp,
  FiUserPlus,
  FiCheck,
  FiMessageSquare,
  FiChevronUp,
  FiCopy,
  FiLink,
  FiExternalLink,
  FiDelete,
  FiTrash,
  FiFileText,
  FiEdit3,
  FiVideo,
  FiImage,
  FiEdit2,
  FiClock,
  FiFile,
  FiBookOpen,
  FiBarChart2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { motion } from "framer-motion";
import { updateResourceSimple, deleteResource, toggleCommentUpvote, votePollOption } from "../../services/resourceService";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionImage = motion(Image);
const MotionBadge = motion(Badge);
const MotionAvatar = motion(Avatar);

const formatAttachmentsForGrid = (resource) => {
  const videos = [];
  const images = [];
  const documents = [];
  const polls = [];

  // Handle attachments from API response
  if (resource.attachments && Array.isArray(resource.attachments)) {
    // Process each attachment based on file_type
    resource.attachments.forEach(attachment => {
      // Use the url property from attachment if available, otherwise build it
      const fileUrl = attachment.url 
        ? `${'http://127.0.0.1:8000'}${attachment.url}`
        : `${'http://127.0.0.1:8000'}/api/storage/${attachment.file_path}`;
      
      // Determine the attachment type and add to appropriate array
      switch (attachment.file_type) {
        case 'image':
          images.push({
            id: attachment.id,
            url: fileUrl,
            mediaType: 'image',
            original_name: attachment.original_name || 'Image'
          });
          break;
        case 'video':
          videos.push({
            id: attachment.id,
            url: fileUrl,
            mediaType: 'video',
            original_name: attachment.original_name || 'Video'
          });
          break;
        default: // documents and other files
          documents.push({
            id: attachment.id,
            url: fileUrl,
            name: attachment.original_name || 'Document',
            size: attachment.size || 0,
            mediaType: 'document',
            mime_type: attachment.mime_type
          });
      }
    });
  }

  // Maintain backward compatibility with old data structure
  if (resource.videos && Array.isArray(resource.videos)) {
    videos.push(...resource.videos.map(video => ({
      ...video,
      mediaType: 'video'
    })));
  } else if (resource.media && resource.mediaType === 'video') {
    videos.push({
      id: 'main-video',
      url: resource.media,
      mediaType: 'video'
    });
  }

  if (resource.images && Array.isArray(resource.images)) {
    images.push(...resource.images.map(img => ({
      ...img,
      mediaType: 'image'
    })));
  } else if (resource.imageUrl || (resource.media && resource.mediaType !== 'video')) {
    const imageUrl = resource.imageUrl || resource.media;
    if (imageUrl && !images.some(img => img.url === imageUrl)) { // Avoid duplicates
      images.push({
        id: 'main-image',
        url: imageUrl,
        mediaType: 'image'
      });
    }
  }

  if (resource.documents && Array.isArray(resource.documents)) {
    documents.push(...resource.documents.map(doc => ({
      ...doc,
      mediaType: 'document'
    })));
  } else if (resource.file) {
    documents.push({
      id: 'main-doc',
      url: resource.file,
      name: resource.original_name || 'Document',
      size: resource.fileSize || 0,
      mediaType: 'document'
    });
  }

  // Polls can be returned either as a single object ("polls": { ... })
  // or as an array ("polls": [ { ... }, ... ]). In both cases we want to
  // normalise them to an array and make sure each option has the properties
  // `text` and `votes` that the UI layer expects.
  if (resource.polls) {
    const pollsArray = Array.isArray(resource.polls) ? resource.polls : [resource.polls];

    polls.push(
      ...pollsArray.map((poll) => ({
        id: poll.id,
        question: poll.question,
        // Map option property names coming from the API (option_text / vote_count)
        // to the names used in the UI (text / votes)
        options: (poll.options || []).map((opt) => ({
          id: opt.id,
          text: opt.option_text ?? opt.text ?? '',
          votes: opt.vote_count ?? opt.votes ?? 0,
        })),
        mediaType: 'poll',
      }))
    );
  } else if (resource.hasPoll) {
    // Fallback for legacy data structure that was used when creating a poll
    polls.push({
      id: 'main-poll',
      question: resource.pollQuestion || 'Poll',
      options: (resource.pollOptions || []).map((opt, idx) => ({
        id: opt.id ?? idx,
        text: opt.option_text ?? opt.text ?? String(opt),
        votes: opt.vote_count ?? opt.votes ?? 0,
      })),
      mediaType: 'poll',
    });
  }

  return {
    videos,
    images,
    documents,
    polls,
    all: [...videos, ...images, ...documents, ...polls]
  };
};

// Helper function to download a file using the dedicated API endpoint
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

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{ 
        ...style, 
        display: "block", 
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
        display: "block", 
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

const ResourceCard = memo(({
  resource,
  onCardClick,
  onBookmark,
  onUpvote,
  onEdit,
  onDelete,
  currentUser,
  cardBg,
  textColor,
  mutedText,
  borderColor
}) => {
  const toast = useToast();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isBookmarkHovered, setIsBookmarkHovered] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(resource.is_upvoted || false);
  const [upvoteCount, setUpvoteCount] = useState(resource.upvote_count || 0);
  const [isDeleting, setIsDeleting] = useState(false);
  // Track which polls the user has already voted in and their selected options
  const [userVotes, setUserVotes] = useState({}); // { [pollId]: optionId }
  const [votedPolls, setVotedPolls] = useState({}); // { [pollId]: true }
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Poll data state (normalized to array)
  const [pollData, setPollData] = useState([]);

  // Helper to convert backend poll object to local structure
  const normalizePoll = (pollObj) => ({
    id: pollObj.id,
    question: pollObj.question,
    options: (pollObj.options || []).map((opt) => ({
      id: opt.id,
      text: opt.option_text ?? opt.text ?? '',
      votes: opt.vote_count ?? opt.votes ?? 0,
      is_selected: opt.is_selected ?? false,
    })),
    user_option_id: pollObj.user_option_id ?? null,
  });

  // Initialize pollData and user vote state when resource prop changes
  useEffect(() => {
    if (!resource) return;
    let pollsArr = [];
    if (Array.isArray(resource.polls)) {
      pollsArr = resource.polls.map(normalizePoll);
    } else if (resource.polls) {
      pollsArr = [normalizePoll(resource.polls)];
    }
    setPollData(pollsArr);

    // derive userVotes/votedPolls from data
    const votesInit = {};
    const votedInit = {};
    pollsArr.forEach((p) => {
      const selectedId = p.user_option_id || p.options.find((o) => o.is_selected)?.id;
      if (selectedId) {
        votesInit[p.id] = selectedId;
        votedInit[p.id] = true;
      }
    });
    setUserVotes(votesInit);
    setVotedPolls(votedInit);
  }, [resource]);
  const [isResourceOwner, setIsResourceOwner] = useState(false);
  
  // Check if current user is the owner of this resource or has admin privileges
  useEffect(() => {
    // Get current user data directly from storage instead of props
    const currentUserData = getCurrentUserSync();
    
    console.log('ResourceCard ownership check:', {
      currentUser: currentUserData,
      resourceUser: resource.user,
      currentUserId: currentUserData?.id,
      resourceUserId: resource.user?.id,
      userRole: currentUserData?.role
    });
    
    // Check if user can edit this resource (either owner or admin/moderator)
    const isOwner = currentUserData && resource.user && currentUserData.id && 
                    String(currentUserData.id) === String(resource.user.id);
                    
    const hasAdminRights = currentUserData && ['admin', 'moderator'].includes(currentUserData.role);
    
    // User can edit/delete if they're the owner OR they have admin/moderator role
    setIsResourceOwner(isOwner || hasAdminRights);
    
  }, [resource]);
  const [editFormData, setEditFormData] = useState(null);
  const cancelRef = useRef();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const handleDelete = async () => {
    if (!resource.id) return;
    
    setIsDeleting(true);
    try {
      await deleteResource(resource.id);
      
      // Close dialog
      setShowDeleteConfirm(false);
      
      // Show success toast
      toast({
        title: "Resource deleted",
        description: "The resource has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      
      // Notify parent component
      if (onDelete) onDelete(resource.id);
      
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Failed to delete the resource. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const { videos, images, documents, polls, all } = useMemo(() => {
    return formatAttachmentsForGrid(resource);
  }, [resource]);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: videos.length + images.length > 1,
    prevArrow: videos.length + images.length > 1 ? <CustomPrevArrow /> : null,
    nextArrow: videos.length + images.length > 1 ? <CustomNextArrow /> : null,
  };

  // Calculate total attachments for display
  const totalAttachmentsCount = videos.length + images.length + documents.length + polls.length;
  


  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const timeAgo = (date) => {
    if (!date) return "Just now";
    
    const now = new Date();
    const postDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) return "Just now";
    
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Format time for display
    const timeStr = postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Less than a minute
    if (diffInSeconds < 60) return "Just now";
    
    // Less than an hour
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    // Less than a day
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    
    // Yesterday
    if (diffInDays === 1) return `Yesterday at ${timeStr}`;
    
    // Less than a week
    if (diffInDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[postDate.getDay()]} at ${timeStr}`;
    }
    
    // This year
    const currentYear = now.getFullYear();
    const postYear = postDate.getFullYear();
    if (currentYear === postYear) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[postDate.getMonth()]} ${postDate.getDate()} at ${timeStr}`;
    }
    
    // Older
    return `${postDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} at ${timeStr}`;
  };

  return (
    <MotionCard
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      overflow="hidden"
      width="100%"
      boxShadow="sm"
      _hover={{
        boxShadow: "md",
        borderColor: useColorModeValue("gray.300", "gray.600")
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Social Media Style */}
      <CardHeader p={4} pb={0}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Avatar 
              size="md" 
              src={resource.user?.avatar_url || "https://i.pravatar.cc/150?img=1"} 
              name={resource.user ? `${resource.user.first_name} ${resource.user.last_name}` : "Anonymous"}
            />
            <Box>
              <Flex align="center" gap={2} mb={1}>
                <Text fontWeight="bold" fontSize="md">
                  {resource.user ? `${resource.user.first_name} ${resource.user.last_name}` : "Anonymous"}
                </Text>
                {resource.user?.is_verified === 1 && (
                  <Circle size="16px" bg="blue.500" color="white">
                    <FiCheck size="10px" />
                  </Circle>
                )}
              </Flex>
              <Flex align="center" gap={2} fontSize="sm" color={mutedText}>
                <Text>{timeAgo(resource.created_at || resource.dateAdded)}</Text>
              </Flex>
            </Box>
          </Flex>
          
          {/* Only show menu if user is the resource owner */}
          {isResourceOwner && (
            <Menu placement="bottom-end" onClick={(e) => e.stopPropagation()}>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                size="sm"
                borderRadius="full"
              />
              <MenuList shadow="lg" borderRadius="xl">
                {/* Edit and Delete options are now guaranteed because the Menu itself is conditional */}
                <MenuItem 
                  icon={<FiEdit3 />}
                  onClick={(e) => {
                    // Prevent card click when clicking menu item
                    e.stopPropagation();
                    
                    // Make sure we have the complete resource data including attachments
                    console.log('Editing resource with attachments:', resource.attachments);
                    
                    // Prepare complete form data including attachments
                    setEditFormData({
                      title: resource.title,
                      description: resource.description,
                      // Pass all original attachments to be handled in the edit modal
                      attachments: resource.attachments || []
                    });
                    
                    // Make sure we pass the complete resource object with all attachments
                    // to the parent's onEdit handler
                    if (onEdit) {
                      // Ensure attachments are included and properly formatted
                      const completeResource = {
                        ...resource,
                        attachments: resource.attachments || []
                      };
                      onEdit(completeResource);
                    }
                  }}
                >
                  Edit resource
                </MenuItem>
                
                <MenuItem 
                  icon={<FiTrash />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete resource
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>

      {/* Content */}
      <CardBody p={4} pt={3}>
        {/* Post Text */}
        <Box 
          mb={3}
          lineHeight="1.5"
        >
          <Heading 
            as="h3" 
            fontSize="lg" 
            fontWeight="semibold" 
            mb={2}
            color={useColorModeValue("blue.700", "blue.300")}
            cursor="pointer"
            onClick={() => onCardClick(resource.id)}
            _hover={{ textDecoration: "underline" }}
          >
            {resource.title}
          </Heading>
          <Text 
            fontSize="md" 
            cursor="pointer"
            onClick={() => onCardClick(resource.id)}
          >
            {resource.description}
          </Text>
        </Box>

        {/* Tags */}
        {(resource.subject || resource.category || resource.level) && (
          <Flex wrap="wrap" gap={1.5} mb={3}>
            {resource.subject && (
              <Tag size="sm" colorScheme="blue" variant="subtle" borderRadius="full">
                #{resource.subject.toLowerCase().replace(' ', '')}
              </Tag>
            )}
            {resource.category && (
              <Tag size="sm" colorScheme="green" variant="subtle" borderRadius="full">
                #{resource.category.toLowerCase().replace(' ', '')}
              </Tag>
            )}
            {resource.level && (
              <Tag size="sm" colorScheme="purple" variant="subtle" borderRadius="full">
                #{resource.level.toLowerCase()}
              </Tag>
            )}
          </Flex>
        )}

        {/* Media Content */}
        {totalAttachmentsCount > 0 && (
          <Box mb={4} borderRadius="xl" overflow="hidden">
            {/* Images/Videos */}
            {(videos.length > 0 || images.length > 0) && (
              <Box mb={3}>
                <Slider {...sliderSettings} style={{ position: "relative", zIndex: 0 }}>
                  {[...videos, ...images].map((item, index) => (
                    <Box key={item.id || index} position="relative">
                      {item.mediaType === 'video' ? (
                        <AspectRatio ratio={16/9}>
                          <video
                            src={item.url}
                            controls
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </AspectRatio>
                      ) : (
                        <AspectRatio ratio={16/9}>
                          <Image
                            src={item.url}
                            alt={item.original_name || `Image ${index+1}`}
                            objectFit="cover"
                          />
                        </AspectRatio>
                      )}
                      <IconButton
                        icon={<FiDownload />}
                        size="sm"
                        position="absolute"
                        top="4"
                        right="4"
                        colorScheme="blue"
                        bg="whiteAlpha.800"
                        _hover={{ bg: "whiteAlpha.900" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const fileName = item.name || (item.mediaType === 'video' ? `Video-${resource.id}-${index}` : `Image-${resource.id}-${index}`);
                          downloadFile(item.url, fileName);
                          toast({
                            title: `Downloading ${item.mediaType}`,
                            description: `${fileName} is being downloaded`,
                            status: "info",
                            duration: 2000,
                            isClosable: true
                          });
                        }}
                        aria-label={`Download ${item.mediaType}`}
                      />
                    </Box>
                  ))}
                </Slider>
              </Box>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <VStack spacing={2} mb={3} align="stretch">
                {documents.slice(0, 2).map((doc, index) => (
                  <Flex
                    key={doc.id || `doc-${index}`}
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="lg"
                    align="center"
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                  >
                    <Circle size="40px" bg="blue.100" color="blue.600" mr={3}>
                      <FiFileText size={20} />
                    </Circle>
                    <Box flex="1">
                      <Text fontWeight="medium" fontSize="sm">
                        {doc.name || `Document ${index + 1}`}
                      </Text>
                      <Text fontSize="xs" color={mutedText}>
                        {formatFileSize(doc.size)}
                      </Text>
                    </Box>
                    <IconButton
                      icon={<FiDownload />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        const fileName = doc.name || `Document-${index + 1}`;
                        downloadFile(doc.url, fileName, 'documents');
                        toast({
                          title: "Downloading file",
                          description: `${fileName} is being downloaded`,
                          status: "info",
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                      aria-label="Download file"
                    />
                  </Flex>
                ))}
                {documents.length > 2 && (
                  <Text fontSize="sm" color={mutedText} textAlign="center">
                    +{documents.length - 2} more
                  </Text>
                )}
              </VStack>
            )}

            {/* Polls */}
            {pollData.length > 0 && (
              <Box>
                {pollData.slice(0, 1).map((poll, index) => {
                  const pollId = poll.id || `poll-${index}`;
                  const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
                  const hasVoted = votedPolls[pollId];
                  const selectedOption = userVotes[pollId];
                   const handleVote = async (optionId) => {
                    try {
                      const { message, poll } = await votePollOption(optionId);

                      // Normalise option structure similar to formatAttachmentsForGrid
                      const updatedPoll = {
                        id: poll.id,
                        question: poll.question,
                        options: (poll.options || []).map((opt) => ({
                          id: opt.id,
                          text: opt.option_text ?? opt.text ?? '',
                          votes: opt.vote_count ?? opt.votes ?? 0,
                        })),
                      };

                      // Update local poll list with new counts
                      setPollData((prev) => prev.map((p) => (p.id === updatedPoll.id ? updatedPoll : p)));

                      // Manage highlight logic based on message
                      if (message.startsWith('Vote removed')) {
                        setUserVotes((prev) => ({ ...prev, [poll.id]: null }));
                        setVotedPolls((prev) => ({ ...prev, [poll.id]: false }));
                      } else {
                        setUserVotes((prev) => ({ ...prev, [poll.id]: optionId }));
                        setVotedPolls((prev) => ({ ...prev, [poll.id]: true }));
                      }

                      toast({ title: message, status: 'success', duration: 2000, isClosable: true });
                    } catch (err) {
                      console.error('Vote error', err);
                      toast({ title: 'Failed to record vote', description: err.message || 'Try again later', status: 'error', duration: 3000, isClosable: true });
                    }
                  };

                  return (
                    <Box
                      key={pollId}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      p={4}
                      borderRadius="xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Text fontWeight="semibold" mb={3}>
                        {poll.question}
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {poll.options?.map((option, optIndex) => {
                          const optionId = option.id || `option-${optIndex}`;
                          const isSelected = selectedOption === optionId;
                          const optionVotes = option.votes || 0;
                          const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                          
                          return (
                            <Box 
                              key={optionId}
                              position="relative"
                              p={3}
                              borderRadius="lg"
                              cursor="pointer"
                              onClick={() => handleVote(optionId)}
                              bg={useColorModeValue("white", "gray.800")}
                              border="2px solid"
                              borderColor={isSelected ? "blue.400" : "transparent"}
                              _hover={{ 
                                borderColor: isSelected ? "blue.500" : useColorModeValue("gray.200", "gray.600")
                              }}
                            >
                              <Box
                                position="absolute"
                                left={0}
                                top={0}
                                bottom={0}
                                width={`${percentage}%`}
                                bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")}
                                opacity={0.3}
                                borderRadius="lg"
                              />
                              <Flex justify="space-between" align="center" position="relative">
                                <Text>{option.text}</Text>
                                <Text fontWeight="bold" color={isSelected ? "blue.500" : mutedText}>
                                  {percentage}%
                                </Text>
                              </Flex>
                            </Box>
                          );
                        })}
                      </VStack>
                      <Text fontSize="sm" color={mutedText} mt={2} textAlign="center">
                        {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </CardBody>

      {/* Footer - Engagement */}
      <CardFooter p={4} pt={0}>
        {/* Instagram-style Action Bar */}
        <VStack width="100%" spacing={2} align="stretch">
          {/* Action Icons with Counts */}
          <Flex justify="space-between" align="center" width="100%">
            <HStack spacing={4}>
              {/* Upvote Button */}
              <HStack spacing={1.5} align="center">
                <Icon 
                  as={FiTrendingUp} 
                  boxSize={5} 
                  color={resource.is_upvoted ? "red.500" : "inherit"} 
                  fill={resource.is_upvoted ? "currentColor" : "none"}
                  cursor="pointer"
                  onClick={(e) => { e.stopPropagation(); onUpvote(resource.id); }}
                />
                <Text fontSize="sm" fontWeight="medium">{resource.upvote_count || 0}</Text>
              </HStack>
              
              {/* Comments Count */}
              <HStack spacing={1.5} align="center">
                <Icon 
                  as={FiMessageSquare} 
                  boxSize={5}
                />
                <Text fontSize="sm" fontWeight="medium">{resource.comment_count || 0}</Text>
              </HStack>

              {/* Share Button */}
              <Menu placement="top" isLazy>
                <MenuButton
                  as={IconButton}
                  icon={<FiShare2 />}
                  variant="ghost"
                  size="sm"
                  p={0}
                  minW="auto"
                  aria-label="Share options"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList shadow="lg" borderRadius="xl" p={4}>
                  <Text fontWeight="semibold" mb={3}>Share this post</Text>
                  <SimpleGrid columns={2} spacing={3}>
                    <VStack
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/resources/${resource.id}`);
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
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out: ${resource.title} ${window.location.origin}/resources/${resource.id}`)}`, '_blank')}
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
              </Menu>
            </HStack>

            {/* Bookmark Button */}
            <IconButton
              icon={<FiBookmark fill={resource.is_saved ? "currentColor" : "none"} />}
              variant="ghost"
              size="lg"
              p={0}
              minW="auto"
              color={resource.is_saved ? "blue.500" : mutedText}
              onClick={(e) => { e.stopPropagation(); onBookmark(resource.id, resource.title); }}
              aria-label="Bookmark"
            />
          </Flex>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            isOpen={showDeleteConfirm}
            leastDestructiveRef={cancelRef}
            onClose={() => setShowDeleteConfirm(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Resource
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this resource? This action cannot be undone.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button 
                    colorScheme="red" 
                    onClick={handleDelete} 
                    ml={3}
                    isLoading={isDeleting}
                    loadingText="Deleting"
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          {/* View Count (if available) */}
          {resource.viewCount && (
            <Text fontSize="sm" color={mutedText}>
              {resource.viewCount} views
            </Text>
          )}
        </VStack>
      </CardFooter>
    </MotionCard>
  );
});

export default ResourceCard;