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
  MenuItem,
  Progress,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  ButtonGroup,
  SimpleGrid,
  useColorMode,
  Container,
  StatGroup 
} from "@chakra-ui/react";
import { 
  FiArrowLeft, 
  FiDownload,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMessageCircle,
  FiLink,
  FiMoreHorizontal,
  FiSend,
  FiUserPlus,
  FiCheck,
  FiTrendingUp,
  FiClock,
  FiFileText,
  FiExternalLink,
  FiMaximize2,
  FiBookOpen,
  FiZoomIn,
  FiZoomOut,
  FiStar,
  FiList,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

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
  
  // Simple reading preferences
  const [fontSize, setFontSize] = useState(16);
  const [readingProgress, setReadingProgress] = useState(0);
  
  // Simulate loading state
  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Set comments and sort by upvotes (likes) count in descending order
      setComments((resource.comments || []).sort((a, b) => b.likes - a.likes));
    }, 800);
    
    
    return () => clearTimeout(timer);
  }, []);
  
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

  // Enhanced resource data
  const resource = {
    id: 1,
    type: "PDF Document",
    title: "Academic Writing Guide for Research Papers",
    difficulty: "Intermediate",
    fileSize: "2.4 MB",
    dateAdded: "2025-04-25T14:30:00",
    lastUpdated: "2025-04-29T09:15:00",
    readTime: "15 min read",
    author: {
      id: "prof-sarah",
      name: "Prof. Sarah Ahmed",
      title: "PhD, Department of English",
      avatar: "https://i.pravatar.cc/150?img=32",
      verified: true,
      resources: 12
    },
    likes: 47,
    shares: 23,
    comments: [
      {
        id: 1,
        user: {
          name: "Ahmed Hassan",
          avatar: "https://i.pravatar.cc/150?img=11",
          verified: false
        },
        text: "This guide was incredibly helpful for my research paper! The citation examples saved me hours of work.",
        date: "2025-04-26T10:15:00",
        likes: 8
      },
      {
        id: 2,
        user: {
          name: "Layla Mohammed",
          avatar: "https://i.pravatar.cc/150?img=23",
          verified: true
        },
        text: "The templates provided are excellent. I especially appreciated the section on crafting a strong thesis statement.",
        date: "2025-04-27T15:42:00",
        likes: 5
      },
      {
        id: 3,
        user: {
          name: "Omar Khan",
          avatar: "https://i.pravatar.cc/150?img=59",
          verified: false
        },
        text: "Prof. Ahmed always delivers quality content. This is no exception. The methodology section was particularly helpful.",
        date: "2025-04-28T09:13:00",
        likes: 12
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    content: "This is the content of the post resource",
    attachments: [
      { name: "academic_writing_template.docx", size: "542 KB", type: "document" },
      { name: "citation_examples.pdf", size: "1.2 MB", type: "pdf" }
    ],
    related: [
      { 
        id: 4,
        type: "Video", 
        title: "Research Methods Workshop", 
        content: "Learn effective research methodologies for academic papers",
        author: "Dr. Ali Hassan",
        avatar: "https://i.pravatar.cc/150?img=11",
        imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        likes: 32,
        duration: "18 min"
      },
      { 
        id: 2,
        type: "PDF Document", 
        title: "Citation Styles Comparison", 
        content: "A complete guide to APA, MLA, Chicago and Harvard citation styles",
        author: "Noura Khalid",
        avatar: "https://i.pravatar.cc/150?img=29",
        imageUrl: "https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        likes: 54
      },
      { 
        id: 3,
        type: "Interactive", 
        title: "Thesis Statement Builder", 
        content: "Interactive tool to help craft strong thesis statements",
        author: "Academic Writing Center",
        avatar: "https://i.pravatar.cc/150?img=45",
        imageUrl: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        likes: 78
      }
    ]
  };

  // Enhanced handler functions
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    toast({
      title: isLiked ? "Upvote removed" : "Resource upvoted",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  

  
  const handleDownload = (fileName) => {
    toast({
      title: `Downloading ${fileName || 'resource'}...`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
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
              aria-label="Save resource"
              variant={isSaved ? "solid" : "outline"}
              colorScheme={isSaved ? "blue" : "gray"}
              size="sm"
              onClick={handleSave}
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
                    {/* LinkedIn-style Post Header */}
                    <CardHeader pb={3}>
                      {/* Author info in LinkedIn style */}
                      <Flex 
                        justify="space-between" 
                        align="center"
                        mb={4}
                      >
                        <HStack spacing={3}>
                          <Avatar 
                            src={resource.author.avatar} 
                            name={resource.author.name} 
                            size="md"
                          />
                          <Box>
                            <HStack>
                              <Text fontWeight="medium">{resource.author.name}</Text>
                              {resource.author.verified && (
                                <Icon as={FiCheck} color="blue.500" boxSize={3.5} />
                              )}
                            </HStack>
                            <Text fontSize="sm" color={mutedText}>
                              {resource.author.title} · {formatTimeAgo(resource.dateAdded)}
                            </Text>
                          </Box>
                        </HStack>
                        <Badge 
                          colorScheme={resource.type === "Video" ? "red" : resource.type === "PDF" ? "blue" : "green"} 
                          fontSize="xs"
                          px={2}
                          py={1}
                          borderRadius="full"
                        >
                          {resource.type}
                        </Badge>
                      </Flex>
                    </CardHeader>

                  <CardBody pt={2}>
                    {/* LinkedIn-style post content - content */}
                    <Box mb={4}>
                      <Text 
                        fontSize="xl" 
                        lineHeight="1.6"
                        whiteSpace="pre-wrap"
                      >
                        {resource.content}
                      </Text>
                    </Box>
                    
                    {/* Resource Image */}
                    <Box 
                      mb={4} 
                      h={{ base: "200px", md: "350px" }} 
                      overflow="hidden" 
                      borderRadius="md"
                      position="relative"
                      _hover={{ '& img': { transform: 'scale(1.02)' } }}
                    >
                      <Image 
                        src={resource.imageUrl} 
                        alt={resource.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        loading="lazy"
                        transition="transform 0.3s ease"
                      />
                      <Box
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        h="40%"
                        bgGradient="linear(to-t, rgba(0,0,0,0.7), transparent)"
                      />
                    </Box>
                    
                    <VStack spacing={6} align="stretch">
                      {/* LinkedIn-style engagement summary */}
                      <Flex px={2} justify="space-between" align="center" mb={2}>
                        <HStack spacing={2}>
                          <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                          <Text fontSize="sm" color={mutedText}>{likes} upvotes</Text>
                        </HStack>
                        <HStack spacing={4}>
                          <Text fontSize="sm" color={mutedText}>{comments.length} comments</Text>
                        </HStack>
                      </Flex>
                      
                      <Divider mb={2} />
  
                      {/* LinkedIn-style Action Buttons */}
                      <Flex w="full" justify="space-between" px={2}>
                        <Button
                          flex="1"
                          leftIcon={<Icon as={FiTrendingUp} color={isLiked ? "green.500" : undefined} boxSize={5} />}
                          onClick={handleLike}
                          colorScheme="gray"
                          variant="ghost"
                          size="md"
                          fontWeight={isLiked ? "bold" : "normal"}
                          color={isLiked ? "green.500" : undefined}
                        >
                          {isLiked ? "Upvoted" : "Upvote"}
                        </Button>
                        <Button
                          flex="1"
                          leftIcon={<FiMessageCircle boxSize={5} />}
                          onClick={focusCommentInput}
                          variant="ghost"
                          colorScheme="gray"
                          size="md"
                        >
                          Comment
                        </Button>
                        <Button
                          flex="1"
                          leftIcon={<FiBookmark boxSize={5} />}
                          onClick={handleSave}
                          variant="ghost"
                          colorScheme="gray"
                          size="md"
                          fontWeight={isSaved ? "bold" : "normal"}
                          color={isSaved ? "blue.500" : undefined}
                        >
                          {isSaved ? "Saved" : "Save"}
                        </Button>
                        <Button
                          flex="1"
                          leftIcon={<FiShare2 boxSize={5} />}
                          onClick={handleShare}
                          variant="ghost"
                          colorScheme="gray"
                          size="md"
                        >
                          Share
                        </Button>
                      </Flex>
                      </VStack>
  
                    {/* LinkedIn-style expanded content section */}
                    <Box pt={4}>
                      <Divider mb={4} />  
                      {/* LinkedIn-style attachments section */}
                      <VStack align="stretch" spacing={4} mb={6} px={2}>
                        <Heading size="sm">Attachments</Heading>
                        {resource.attachments.map((file, index) => (
                          <Flex 
                            key={index}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            align="center"
                            justify="space-between"
                            _hover={{ bg: hoverBg }}
                            cursor="pointer"
                            onClick={() => handleDownload(file.name)}
                          >
                            <HStack spacing={3}>
                              <Icon as={FiFileText} boxSize={6} color={accentColor} />
                              <Box>
                                <Text fontWeight="500">{file.name}</Text>
                                <Text fontSize="sm" color={mutedText}>{file.size}</Text>
                              </Box>
                            </HStack>
                            <IconButton
                              icon={<FiDownload />}
                              aria-label="Download file"
                              variant="ghost"
                              colorScheme="blue"
                              size="sm"
                            />
                          </Flex>
                        ))}
                      </VStack>
                    </Box>
                    
                    
                    {/* Comments Section */}
                    <CardBody pt={0}>
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
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderRadius="lg"
                          bg={cardBg}
                        >
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
                                    <Button variant="ghost" size="sm">Reply</Button>
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
                  </CardBody>
                </>
              )}
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
                      <Text fontSize="sm" color={mutedText} mb={1}>Resource Type</Text>
                      <HStack>
                        <Icon as={FiFileText} color={accentColor} />
                        <Text fontWeight="medium">{resource.type}</Text>
                      </HStack>
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" color={mutedText} mb={1}>File Size</Text>
                      <HStack>
                        <Text fontWeight="medium">{resource.fileSize}</Text>
                      </HStack>
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" color={mutedText} mb={1}>Last Updated</Text>
                      <HStack>
                        <Text fontWeight="medium">{formatDate(resource.lastUpdated)}</Text>
                      </HStack>
                    </Box>
                    
                    <Divider />
                    
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleDownload(resource.title)}
                      w="full"
                    >
                      Download Resource
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
  };
  
  export default ResourceContentPage;