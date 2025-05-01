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
  FiList
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
  const { isOpen: isCommentsOpen, onToggle: toggleComments } = useDisclosure();
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(47);
  const [views, setViews] = useState(215);
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
      setComments(resource.comments || []);
    }, 800);
    
    // Track page view
    setViews(prev => prev + 1);
    
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
    category: "Study Skills",
    difficulty: "Intermediate",
    description: "Complete guide for academic writing and research papers with templates, citation examples, and best practices for scholarly publications. Learn how to structure your paper professionally with proper formatting.",
    downloads: 128,
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
      followers: 248,
      resources: 12
    },
    likes: 47,
    shares: 23,
    views: 215,
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
    tags: ["writing", "research", "academic", "citation", "paper", "thesis"],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    content: "This is the description of the post resource",
    attachments: [
      { name: "academic_writing_template.docx", size: "542 KB", type: "document" },
      { name: "citation_examples.pdf", size: "1.2 MB", type: "pdf" }
    ],
    related: [
      { 
        id: 4,
        type: "Video", 
        title: "Research Methods Workshop", 
        description: "Learn effective research methodologies for academic papers",
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
        description: "A complete guide to APA, MLA, Chicago and Harvard citation styles",
        author: "Noura Khalid",
        avatar: "https://i.pravatar.cc/150?img=29",
        imageUrl: "https://images.unsplash.com/photo-1453906971074-ce568cccbc63?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        likes: 54
      },
      { 
        id: 3,
        type: "Interactive", 
        title: "Thesis Statement Builder", 
        description: "Interactive tool to help craft strong thesis statements",
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
      title: isLiked ? "Like removed" : "Resource liked",
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
  
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing 
        ? `Unfollowed ${resource.author.name}` 
        : `Following ${resource.author.name}`,
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
      likes: 0
    };
    
    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    
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
                    {/* Resource Header - Simplified */}
                    <CardHeader pb={3}>
                      <Heading size="xl" mb={3}>
                        {resource.title}
                      </Heading>
                      
                      <HStack spacing={3} mb={4} flexWrap="wrap">
                        <Badge 
                          colorScheme={resource.type === "Video" ? "red" : resource.type === "PDF" ? "blue" : "green"} 
                          fontSize="sm"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {resource.type}
                        </Badge>
                      </HStack>
                      
                      {/* Author info - simplified and more compact */}
                      <Flex 
                        justify="space-between" 
                        align="center"
                        bg={highlightBg} 
                        p={3} 
                        borderRadius="md"
                        mb={3}
                      >
                        <HStack spacing={3}>
                          <Avatar 
                            src={resource.author.avatar} 
                            name={resource.author.name} 
                            size="sm"
                          />
                          <Box>
                            <HStack>
                              <Text fontWeight="medium">{resource.author.name}</Text>
                              {resource.author.verified && (
                                <Icon as={FiCheck} color="blue.500" boxSize={3.5} />
                              )}
                            </HStack>
                            <Text fontSize="xs" color={mutedText}>
                              {resource.author.title} · {formatTimeAgo(resource.dateAdded)}
                            </Text>
                          </Box>
                        </HStack>
                        
                        <Button
                          size="xs"
                          colorScheme={isFollowing ? "blue" : "gray"}
                          variant={isFollowing ? "solid" : "outline"}
                          leftIcon={isFollowing ? <FiCheck size={12} /> : <FiUserPlus size={12} />}
                          onClick={handleFollow}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                      </Flex>
                    </CardHeader>
  
                  <CardBody pt={2}>
                    {/* Resource Image */}
                    <Box 
                      mb={6} 
                      h={{ base: "200px", md: "400px" }} 
                      overflow="hidden" 
                      borderRadius="xl"
                      position="relative"
                      _hover={{ '& img': { transform: 'scale(1.03)' } }}
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
                      {/* Engagement Section */}
                      <HStack justify="space-between" px={2}>
                        <StatGroup w="full">
                          <Stat>
                            <StatLabel color={mutedText}>Views</StatLabel>
                            <StatNumber fontSize="xl">{views}</StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel color={mutedText}>Likes</StatLabel>
                            <StatNumber fontSize="xl">{likes}</StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel color={mutedText}>Comments</StatLabel>
                            <StatNumber fontSize="xl">{comments.length}</StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel color={mutedText}>Downloads</StatLabel>
                            <StatNumber fontSize="xl">{resource.downloads}</StatNumber>
                          </Stat>
                        </StatGroup>
                      </HStack>
  
                      {/* Action Buttons */}
                      <ButtonGroup w="full" isAttached variant="outline">
                        <Button
                          flex="1"
                          leftIcon={<Icon as={FiHeart} color={isLiked ? "red.500" : undefined} />}
                          onClick={handleLike}
                          colorScheme={isLiked ? "red" : "gray"}
                          variant={isLiked ? "solid" : "outline"}
                          borderRadius="lg"
                          py={6}
                        >
                          {isLiked ? "Liked" : "Like"}
                        </Button>
                        <Button
                          flex="1"
                          leftIcon={<FiMessageCircle />}
                          onClick={focusCommentInput}
                          variant="outline"
                          colorScheme="gray"
                          borderRadius="lg"
                          py={6}
                        >
                          Comment
                        </Button>
                        <Button
                          flex="1"
                          leftIcon={<FiBookmark />}
                          onClick={handleSave}
                          variant={isSaved ? "solid" : "outline"}
                          colorScheme={isSaved ? "blue" : "gray"}
                          borderRadius="lg"
                          py={6}
                        >
                          {isSaved ? "Saved" : "Save"}
                        </Button>
                      </ButtonGroup>
  
                    {/* Content Section - Simplified */}
                    <CardBody pt={2}>
                      {/* Image section */}
                      <Box 
                        mb={6} 
                        h={{ base: "200px", md: "350px" }} 
                        overflow="hidden" 
                        borderRadius="md"
                        position="relative"
                      >
                        <Image 
                          src={resource.imageUrl} 
                          alt={resource.title}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          loading="lazy"
                        />
                      </Box>

                      {/* Content */}
                      <Box 
                        ref={contentRef}
                        p={4} 
                        bg={highlightBg}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        position="relative"
                        maxH="500px"
                        overflow="auto"
                        mb={6}
                      >
                        <Text 
                          fontSize={`${fontSize}px`} 
                          lineHeight="1.7"
                          whiteSpace="pre-wrap"
                          fontFamily="system-ui, sans-serif"
                        >
                          {resource.content || "This is the sample content of the resource. This section would contain the full text of the academic paper, article, or study material. In a real application, this would be dynamically loaded from the database and formatted appropriately.\n\n## Introduction\nAcademic writing is essential for scholarly success. This guide covers key aspects of writing research papers according to academic standards.\n\n## Literature Review\nA thorough literature review demonstrates knowledge of the field and identifies gaps your research addresses.\n\n## Methodology\nClearly explain your research methods to ensure reproducibility and validity.\n\n## Results and Analysis\nPresent your findings with appropriate data visualization and statistical analysis.\n\n## Discussion\nInterpret your results in context of existing literature and highlight contributions.\n\n## Conclusion\nSummarize key findings and suggest directions for future research.\n\n## Citation Guidelines\nProper attribution is critical in academic work. This section provides examples of various citation formats."}
                        </Text>
                      </Box>
  
                      {/* Download Section */}
                      <VStack align="stretch" spacing={4} mb={6}>
                        <Heading size="md">Attachments</Heading>
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
                    </CardBody>
                    
                    {/* Comments Section */}
                    <CardBody pt={0}>
                      <VStack align="stretch" spacing={6}>
                        <Heading size="md">Discussion ({comments.length})</Heading>
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
                                    <Button variant="ghost" size="sm" leftIcon={<FiHeart />}>
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
                      </CardBody>
                    </VStack>
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
                    
                    <Box>
                      <Text fontSize="sm" color={mutedText} mb={1}>Downloads</Text>
                      <HStack>
                        <Text fontWeight="medium">{resource.downloads}</Text>
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
              
              {/* Table of Contents */}
             
              
              {/* Related Resources */}
              <Card bg={cardBg}>
                <CardHeader pb={2}>
                  <Heading size="md">Related Resources</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    {resource.related && resource.related.map((item, index) => (
                      <Box 
                        key={index} 
                        p={3} 
                        borderWidth="1px" 
                        borderRadius="md"
                        _hover={{ borderColor: accentColor, transform: "translateY(-2px)" }}
                        transition="all 0.2s"
                        cursor="pointer"
                        as={Link}
                        to={`/resources/${item.id}`}
                      >
                        <HStack spacing={3}>
                          <Box 
                            boxSize="50px" 
                            borderRadius="md" 
                            overflow="hidden" 
                            bg="gray.100"
                          >
                            <Image src={item.imageUrl} alt={item.title} w="100%" h="100%" objectFit="cover" />
                          </Box>
                          <Box>
                            <Text fontWeight="medium" fontSize="sm" noOfLines={1}>{item.title}</Text>
                            <Text fontSize="xs" color={mutedText}>{item.type}</Text>
                          </Box>
                        </HStack>
                      </Box>
                    ))}
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