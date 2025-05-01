import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
  WrapItem,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Checkbox,
  Tab
} from "@chakra-ui/react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBookmark,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiCheckSquare,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFile,
  FiFileText,
  FiFilter,
  FiFolder,
  FiGrid,
  FiHeart,
  FiInfo,
  FiList,
  FiMessageSquare,
  FiPaperclip,
  FiPlay,
  FiPlus,
  FiSearch,
  FiShare2,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiVideo,
  FiMessageCircle,
  FiX
} from "react-icons/fi";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Modal, ModalBody, ModalContent, ButtonGroup,InputRightElement, Avatar, ModalHeader, ModalOverlay, ModalCloseButton } from "@chakra-ui/react";

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionFlex = motion(Flex);

const ResourcesPage = () => {
  // Theme and color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const accentBg = useColorModeValue("blue.50", "blue.900");
  const headerBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.600", "blue.400");
  const tagBg = useColorModeValue("gray.100", "gray.700");
  const highlightColor = useColorModeValue("yellow.400", "yellow.300");
  const pdfColor = useColorModeValue("red.500", "red.400");
  const videoColor = useColorModeValue("purple.500", "purple.400");
  const docColor = useColorModeValue("blue.500", "blue.400");
  const webColor = useColorModeValue("green.500", "green.400");

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: true, lg: false });
  const resourceDetailDisclosure = useDisclosure();

  // Refs
  const scrollRef = useRef(null);

  // State
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [bookmarked, setBookmarked] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Data
  const filterCategories = ["All", "Recent", "Bookmarked", "Recommended", "Popular"];
  const resourceTypes = ["All Types", "PDF", "Video", "Article", "Practice Test", "Presentation", "Dataset"];
  const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Business", "Psychology", "Literature"];
  const resources = [
    {
      id: 1,
      title: "Academic Writing Guide for Research Papers",
      type: "PDF Document",
      category: "Study Skills",
      description: "Comprehensive guide for academic writing and research papers with templates, examples, and step-by-step instructions for different citation styles.",
      preview: "This guide covers everything from structuring your paper to advanced citation techniques...",
      fileSize: "2.4 MB",
      dateAdded: "2025-04-25T14:30:00",
      author: {
        name: "Prof. Sarah Ahmed",
        avatar: "https://i.pravatar.cc/150?img=32",
        department: "English Department"
      },
      likes: 47,
      comments: 12,
      shares: 8,
      saved: false,
      liked: false,
      tags: ["writing", "research", "academic", "citation"],
      imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Statistical Analysis Tools for Research Projects",
      type: "Web Resource",
      category: "Research",
      description: "Online tools and resources for statistical analysis in research with practical examples using R and Python for data visualization and hypothesis testing.",
      preview: "Learn to apply statistical methods to your research data with these powerful tools...",
      views: 256,
      externalLink: true,
      dateAdded: "2025-04-24T09:15:00",
      author: {
        name: "Dr. Ahmed Hassan",
        avatar: "https://i.pravatar.cc/150?img=11",
        department: "Statistics & Data Science"
      },
      likes: 89,
      comments: 23,
      shares: 34,
      saved: true,
      liked: true,
      tags: ["statistics", "data analysis", "research methods", "R", "Python"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Career Development Workshop: Networking Strategies",
      type: "Video",
      category: "Career",
      description: "Recorded workshop on career development strategies for students with a focus on networking, personal branding, and interview techniques.",
      preview: "Watch this workshop to master the art of professional networking...",
      views: 195,
      duration: "45 minutes",
      fileSize: "350 MB",
      dateAdded: "2025-04-20T16:45:00",
      author: {
        name: "Layla Mahmoud",
        avatar: "https://i.pravatar.cc/150?img=23",
        department: "Career Services"
      },
      likes: 124,
      comments: 38,
      shares: 56,
      saved: false,
      liked: true,
      tags: ["career", "networking", "professional development", "job search"],
      imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "Study Group Formation Guide: Collaborative Learning Techniques",
      type: "PDF Document",
      category: "Study Skills",
      description: "Best practices for forming and managing effective study groups with collaborative learning techniques and conflict resolution strategies.",
      preview: "Discover how to maximize learning outcomes through effective study groups...",
      fileSize: "1.2 MB",
      dateAdded: "2025-04-18T11:20:00",
      author: {
        name: "Omar Khalid",
        avatar: "https://i.pravatar.cc/150?img=15",
        department: "Education Psychology"
      },
      likes: 56,
      comments: 7,
      shares: 12,
      saved: false,
      liked: false,
      tags: ["study groups", "collaboration", "learning techniques", "peer learning"],
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Research Database Access: Finding Quality Sources",
      type: "Web Resource",
      category: "Research",
      description: "Guide to accessing the university's research databases and journals with tips for finding high-quality sources and evaluating academic papers.",
      preview: "Learn how to navigate through databases to find the most relevant research...",
      views: 189,
      externalLink: true,
      dateAdded: "2025-04-15T13:30:00",
      author: {
        name: "Nour Ibrahim",
        avatar: "https://i.pravatar.cc/150?img=29",
        department: "Library Sciences"
      },
      likes: 32,
      comments: 5,
      shares: 19,
      saved: true,
      liked: false,
      tags: ["research", "databases", "academic sources", "library"],
      imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Critical Thinking Skills Workshop",
      type: "PDF Document",
      category: "Study Skills",
      description: "Develop effective critical thinking skills for academic and professional success with practical exercises and analytical frameworks.",
      preview: "Enhance your ability to analyze and evaluate information critically...",
      fileSize: "3.1 MB",
      dateAdded: "2025-04-10T10:15:00",
      author: {
        name: "Dr. Farida Saleh",
        avatar: "https://i.pravatar.cc/150?img=25",
        department: "Philosophy"
      },
      likes: 112,
      comments: 19,
      shares: 28,
      saved: false,
      liked: true,
      tags: ["critical thinking", "logic", "analysis", "reasoning"],
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  // Handlers for social interactions
  const handleLike = (id) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const updatedResources = resources.map(resource => {
        if (resource.id === id) {
          const newLiked = !resource.liked;
          return { 
            ...resource, 
            liked: newLiked,
            likes: newLiked ? resource.likes + 1 : resource.likes - 1 
          };
        }
        return resource;
      });
      // Update state would go here in a real implementation
      setIsLoading(false);
      toast({
        title: "Resource liked",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom-right",
      });
    }, 300);
  };

  const handleBookmark = (id) => {
    setBookmarked(prev => {
      if (prev.includes(id)) {
        toast({
          title: "Removed from bookmarks",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
        return prev.filter(itemId => itemId !== id);
      } else {
        toast({
          title: "Added to bookmarks",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return [...prev, id];
      }
    });
  };

  // New comment functionality
  const [comment, setComment] = useState("");
  const handleCommentSubmit = (resourceId) => {
    if (comment.trim()) {
      toast({
        title: "Comment posted!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setComment("");
    }
  };

  const handleSave = (id) => {
    // Similar implementation as handleLike
    toast({
      title: "Resource saved to your collection",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleShare = (id) => {
    toast({
      title: "Share options opened",
      description: "You can share this resource via email or social media",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

    // The categories are already defined at the top of the component (filterCategories)

  // Format date to relative time (e.g., "2 hours ago", "3 days ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHr > 0) {
      return `${diffHr} ${diffHr === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  // LinkedIn-style resource post component
  const ResourceCard = ({ resource }) => {
    const [isLiked, setIsLiked] = useState(resource.liked || false);
    const [isSaved, setIsSaved] = useState(false);
    
    // Get appropriate icon for resource type
    const getTypeIcon = (type) => {
      switch(type.toLowerCase()) {
        case 'pdf':
        case 'pdf document': return FiFileText;
        case 'video': return FiVideo;
        case 'article': return FiFile;
        case 'presentation': return FiPlay;
        case 'practice test': return FiCheckSquare;
        default: return FiFile;
      }
    };
    
    const TypeIcon = getTypeIcon(resource.type);
    
    // Action handlers
    const handleLike = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    };
    
    const handleSave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Removed from collection" : "Saved to collection",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    };
    
    const handleDownload = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toast({
        title: "Download started",
        description: `Downloading ${resource.title}...`,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    };

    return (
      <MotionCard
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        mb={4}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        as={Link}
        to={`/resources/${resource.id}`}
        textDecoration="none"
        _hover={{ borderColor: "blue.300", shadow: "md" }}
      >
        {/* Author Header */}
        <Flex p={4} pb={2} align="center">
          <Avatar 
            src={resource.author.avatar} 
            name={resource.author.name} 
            size="sm" 
            mr={3}
          />
          <Box>
            <Heading size="sm">{resource.author.name}</Heading>
            <HStack spacing={1} fontSize="xs" color={mutedText}>
              <Text>{resource.author.department}</Text>
              <Text>•</Text>
              <Text>{formatRelativeTime(resource.dateAdded)}</Text>
            </HStack>
          </Box>
        </Flex>

        {/* Resource Content */}
        <Box px={4} pt={1} pb={2}>
          <Text fontSize="md" fontWeight="medium" mb={2}>
            {resource.title}
          </Text>
          
          <Text fontSize="sm" color={textColor} mb={3} noOfLines={2}>
            {resource.description}
          </Text>
          
          {/* Resource Type */}
          <HStack mb={3}>
            <Tag size="sm" colorScheme="blue" variant="subtle">
              <Icon as={TypeIcon} mr={1} />
              <Text>{resource.type}</Text>
            </Tag>
          </HStack>
        </Box>

        {/* Resource Image (if available) */}
        {resource.imageUrl && (
          <Box width="100%" height="200px" position="relative">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        )}
        

        {/* Action Buttons */}
        <Divider />
        <Flex p={2} justify="space-between">
          <Button
            leftIcon={<Icon as={FiHeart} color={isLiked ? "red.500" : undefined} />}
            variant="ghost"
            size="sm"
            onClick={handleLike}
            color={isLiked ? "red.500" : undefined}
            flex={1}
            display="flex"
            alignItems="center"
          >
            {isLiked ? "Liked" : "Like"}
            <Text ml={1} fontWeight="medium" as="span">
              {resource.likes || 0}
            </Text>
          </Button>

          <Button
            leftIcon={<Icon as={FiMessageCircle} />}
            variant="ghost"
            size="sm"
            // onClick={handleComment} // Add handler if you want to open a comment modal
            flex={1}
            display="flex"
            alignItems="center"
          >
            Comment
            <Text ml={1} fontWeight="medium" as="span">
              {resource.comments || 0}
            </Text>
          </Button>
          
          <Button
            leftIcon={<Icon as={FiBookmark} color={isSaved ? "yellow.500" : undefined} />}
            variant="ghost"
            size="sm"
            onClick={handleSave}
            color={isSaved ? "yellow.500" : undefined}
            flex={1}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
          
          <Button
            leftIcon={<FiDownload />}
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            flex={1}
          >
            Download
          </Button>
        </Flex>
      </MotionCard>
    );
  };

  // List view resource item component
  const ResourceListItem = ({ resource }) => {
    const getTypeProps = (type) => {
      switch(type.toLowerCase()) {
        case 'pdf':
        case 'pdf document': 
          return { icon: FiFileText, color: "red.500", bgGradient: "linear(to-br, red.400, pink.600)" };
        case 'video': 
          return { icon: FiVideo, color: "purple.500", bgGradient: "linear(to-br, purple.400, blue.600)" };
        case 'article': 
          return { icon: FiFile, color: "blue.500", bgGradient: "linear(to-br, blue.400, cyan.600)" };
        case 'presentation': 
          return { icon: FiPlay, color: "green.500", bgGradient: "linear(to-br, green.400, teal.600)" };
        case 'practice test': 
          return { icon: FiCheckSquare, color: "yellow.500", bgGradient: "linear(to-br, yellow.400, orange.600)" };
        default: 
          return { icon: FiFile, color: "gray.500", bgGradient: "linear(to-br, gray.400, gray.600)" };
      }
    };
    
    const { icon: TypeIcon, color: typeColor, bgGradient } = getTypeProps(resource.type);
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(resource.liked || false);
    const [isSaved, setIsSaved] = useState(false);

    return (
      <MotionCard
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        cursor="pointer"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ x: 5, boxShadow: "md" }}
        as={Link}
        to={`/resources/${resource.id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Flex p={4} align="center">
          {/* Left: Resource Thumbnail */}
          <Box 
            mr={4} 
            borderRadius="lg" 
            overflow="hidden"
            position="relative"
            flexShrink={0}
            width="100px"
            height="100px"
          >
            {resource.imageUrl ? (
              <Image
                src={resource.imageUrl}
                alt={resource.title}
                objectFit="cover"
                w="100%"
                h="100%"
                transition="transform 0.3s ease"
                transform={isHovered ? "scale(1.05)" : "scale(1)"}
              />
            ) : (
              <Flex
                w="100%"
                h="100%"
                bgGradient={bgGradient}
                justify="center"
                align="center"
              >
                <Icon as={TypeIcon} boxSize={8} color="white" />
              </Flex>
            )}
            
            {/* Type Indicator */}
            <Badge
              position="absolute"
              top={2}
              right={2}
              bg="blackAlpha.700"
              color="white"
              fontSize="xs"
              borderRadius="full"
              px={2}
              py={1}
            >
              {resource.type}
            </Badge>
          </Box>
          
          {/* Middle: Content */}
          <Box flex="1">
            <Heading size="md" mb={1} noOfLines={1}>
              {resource.title}
            </Heading>
            
            <Text fontSize="sm" color={mutedText} noOfLines={2} mb={3}>
              {resource.description}
            </Text>
            
            <Flex justify="space-between" align="center">
              {/* Author */}
              <HStack spacing={2}>
                <Avatar size="xs" src={resource.author.avatar} name={resource.author.name} />
                <Text fontSize="xs" fontWeight="medium">
                  {resource.author.name}
                </Text>
                <Text fontSize="xs" color={mutedText}>
                  {formatRelativeTime(resource.dateAdded)}
                </Text>
              </HStack>
              
              {/* Meta */}
              <HStack spacing={4} fontSize="xs" color={mutedText}>
                {resource.downloads && (
                  <Flex align="center">
                    <Icon as={FiDownload} mr={1} />
                    <Text>{resource.downloads}</Text>
                  </Flex>
                )}
                
                {resource.views && (
                  <Flex align="center">
                    <Icon as={FiEye} mr={1} />
                    <Text>{resource.views}</Text>
                  </Flex>
                )}
              </HStack>
            </Flex>
          </Box>
          
          {/* Right: Action Buttons - Only show on hover */}
          <HStack 
            spacing={2} 
            ml={4} 
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.2s ease"
          >
            <IconButton
              icon={<FiHeart fill={isLiked ? "#E53E3E" : "none"} />}
              aria-label="Like resource"
              size="sm"
              colorScheme={isLiked ? "red" : "gray"}
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            />
            <IconButton
              icon={<FiBookmark fill={isSaved ? "#ECC94B" : "none"} />}
              aria-label="Save resource"
              size="sm"
              colorScheme={isSaved ? "yellow" : "gray"}
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
            />
            <IconButton
              icon={<FiDownload />}
              aria-label="Download resource"
              size="sm"
              colorScheme="gray"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Download logic
              }}
            />
          </HStack>
        </Flex>
      </MotionCard>
    );
  };
  
  // Resource detail component
  const ResourceDetail = ({ resource }) => {
    return (
      <Box>
        {/* Resource Hero */}
        <Box position="relative">
          {resource.imageUrl ? (
            <Image 
              src={resource.imageUrl} 
              alt={resource.title} 
              w="100%"
              h="200px"
              objectFit="cover"
            />
          ) : (
            <Flex 
              h="200px" 
              bg={useColorModeValue("blue.50", "blue.900")} 
              justify="center" 
              align="center"
            >
              <Icon as={FiFile} boxSize={12} color={accentColor} opacity={0.8} />
            </Flex>
          )}
        </Box>
        
        <Box p={6}>
          {/* Title and meta */}
          <Heading size="lg" mb={2}>{resource.title}</Heading>
          <Flex align="center" mb={4}>
            <Tag size="sm" colorScheme="blue" mr={3}>
              {resource.type}
            </Tag>
            <Text fontSize="sm" color={mutedText}>
              Added {formatRelativeTime(resource.dateAdded)}
            </Text>
          </Flex>
          
          {/* Author info */}
          <Flex 
            p={3} 
            bg={useColorModeValue("gray.50", "gray.700")} 
            borderRadius="md" 
            mb={6}
            align="center"
          >
            <Image 
              src={resource.author.avatar} 
              alt={resource.author.name} 
              boxSize="40px" 
              borderRadius="full" 
              mr={3} 
              border="2px solid"
              borderColor={borderColor}
            />
            <Box>
              <Text fontWeight="medium">{resource.author.name}</Text>
              <Text fontSize="sm" color={mutedText}>{resource.author.department}</Text>
            </Box>
          </Flex>
          
          {/* Description */}
          <Text fontSize="md" mb={6}>
            {resource.description}
          </Text>
          
          {/* Resource stats */}
          <SimpleGrid columns={3} spacing={4} mb={6}>
            <Stat icon={FiEye} label="Views" value={resource.views || 0} />
            <Stat icon={FiDownload} label="Downloads" value={resource.downloads || 0} />
            <Stat icon={FiStar} label="Rating" value={resource.rating || "-"} />
          </SimpleGrid>
          
          {/* Action buttons */}
          <HStack spacing={4} mt={6}>
            <Button colorScheme="blue" leftIcon={<FiDownload />} flex={1}>
              Download
            </Button>
            <IconButton icon={<FiBookmark />} aria-label="Bookmark" variant="outline" />
            <IconButton icon={<FiShare2 />} aria-label="Share" variant="outline" />
          </HStack>
        </Box>
      </Box>
    );
  };
  
  // Scrollable category tabs for mobile
  const ScrollableCategoryTabs = ({ categories: categoryItems, filter, setFilter, ...props }) => {
    return (
      <Box overflowX="auto" pb={2} {...props} css={{ scrollbarWidth: 'none' }}>
        <Tabs variant="soft-rounded" colorScheme="blue" size="sm">
          <TabList display="flex" flexWrap="nowrap" width="max-content">
            {categoryItems.map((category) => (
              <Tab 
                key={category}
                onClick={() => setFilter(category.toLowerCase())}
                isSelected={filter === category.toLowerCase()}
                px={4}
                py={1}
                mr={2}
                whiteSpace="nowrap"
              >
                {category}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Box>
    );
  };
  
  // Stat component for resource details
  const Stat = ({ icon, label, value }) => (
    <Box textAlign="center" p={3} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
      <Icon as={icon} color={accentColor} boxSize={5} mb={1} />
      <Text fontSize="xs" color={mutedText}>{label}</Text>
      <Text fontWeight="bold">{value}</Text>
    </Box>
  );

  return (
    <Box 
      minH="100vh" 
      bg={bgColor} 
      pb={8}
    >


      {/* Main Content with Sidebar Layout */}
      <Flex 
        maxW="1200px" 
        mx="auto" 
        pt={6} 
        px={{ base: 3, md: 6 }}
        gap={{ base: 4, md: 6 }}
        direction={{ base: "column", md: "row" }}
      >

        
        {/* Main Feed */}
        <Box flex="1">
          {/* Feed Content */}
          <Box>
            {/* Section Header */}
            <Flex justify="space-between" align="center" mb={3}>
              <Heading size="md">
                {filter === "all" ? "Resources Feed" : 
                 filter === "bookmarked" ? "Saved Resources" :
                 filter === "recommended" ? "Recommended For You" :
                 filter === "recent" ? "Recently Added" :
                 filter === "popular" ? "Popular Resources" : "Resources"}
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="sm"
                  rightIcon={<FiFilter />}
                >
                  Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setSortBy("newest")}>Newest First</MenuItem>
                  <MenuItem onClick={() => setSortBy("popular")}>Most Popular</MenuItem>
                  <MenuItem onClick={() => setSortBy("downloads")}>Most Downloads</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            
            {/* Resources Feed */}
            <VStack spacing={4} align="stretch">
              <AnimatePresence>
                {resources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                  />
                ))}
              </AnimatePresence>
            </VStack>
          </Box>
        </Box>
      </Flex>
      
      {/* Mobile Add Button */}
      <Box
        position="fixed"
        bottom="6"
        right="6"
        zIndex="overlay"
        display={{ base: "block", md: "none" }}
      >
        <IconButton
          icon={<FiPlus />}
          aria-label="Add resource"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          boxShadow="lg"
          onClick={() => navigate("/resources/add")}
        />
      </Box>
    </Box>
  );
};

// Reusable Components
const StatBox = ({ icon, title, value, color }) => (
  <HStack
    w="full"
    p={3}
    borderRadius="lg"
    bg={useColorModeValue("gray.100", "gray.700")}
    spacing={3}
  >
    <Icon as={icon} boxSize={5} color={color} />
    <Box>
      <Text fontSize="xs" color={useColorModeValue("gray.600", "gray.300")}>
        {title}
      </Text>
      <Text fontSize="sm" fontWeight="600">
        {value}
      </Text>
    </Box>
  </HStack>
);

const TrendingTopic = ({ title, progress }) => (
  <Box w="full" p={3} borderRadius="lg" bg={useColorModeValue("gray.50", "gray.700")}>
    <Flex justify="space-between" mb={2}>
      <Text fontSize="sm">{title}</Text>
      <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
        {progress}%
      </Text>
    </Flex>
    <Progress value={progress} size="xs" colorScheme="blue" borderRadius="full"/>
  </Box>
);

export default ResourcesPage;
