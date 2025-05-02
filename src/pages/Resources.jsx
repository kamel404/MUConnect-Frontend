import {
  Flex,
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Badge,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
  useColorModeValue,
  useToast,
  useDisclosure,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Container,
  Progress,
  Grid,
  GridItem,
  Textarea
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceList from '../components/resources/ResourceList';
import {filterResources} from '../components/resources/ResourceUtils';
import { FiPlus, FiSearch, FiFilter, FiTrendingUp, FiClock, FiBookmark, FiUsers, FiGrid, FiList, FiUpload, FiActivity, FiHeart, FiFileText, FiVideo, FiImage, FiPaperclip, FiSend, FiEdit } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";




// Featured/Story component for the top of the feed
const StoryCircle = ({ user, active, ...rest }) => {
  const borderColor = useColorModeValue("red.400", "red.300");
  const defaultColor = useColorModeValue("gray.200", "gray.600");
  
  return (
    <VStack spacing={1} {...rest}>
      <Tooltip label={user.name} placement="top">
        <Avatar 
          size="lg" 
          src={user.avatar} 
          name={user.name}
          borderWidth={active ? "3px" : "2px"}
          borderColor={active ? borderColor : defaultColor}
          p={0.5}
          cursor="pointer"
          _hover={{ transform: "scale(1.05)" }}
          transition="all 0.2s"
        />
      </Tooltip>
      <Text fontSize="xs" fontWeight={active ? "bold" : "normal"} noOfLines={1} maxW="70px" textAlign="center">
        {user.name}
      </Text>
    </VStack>
  );
};

/**
 * Main Resources page component that resembles a social media feed
 */
const ResourcesPage = () => {
  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for feed options
  const [activeTab, setActiveTab] = useState(0);
  const [feedType, setFeedType] = useState('feed'); // 'feed' or 'grid'
  const [isLoading, setIsLoading] = useState(false);
  const [following, setFollowing] = useState({});
  
  // Filtering and search state
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // User interaction states
  const [bookmarked, setBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  
  // Featured contributors/stories
  const featuredUsers = [
    { id: 1, name: "Prof. Johnson", avatar: "https://i.pravatar.cc/150?img=32", active: true, verified: true },
    { id: 2, name: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=45", active: true },
    { id: 3, name: "Alex Rivera", avatar: "https://i.pravatar.cc/150?img=68", active: false },
    { id: 4, name: "Math Department", avatar: "https://i.pravatar.cc/150?img=12", active: true, verified: true },
    { id: 5, name: "CS Club", avatar: "https://i.pravatar.cc/150?img=51", active: false },
    { id: 6, name: "Biology Lab", avatar: "https://i.pravatar.cc/150?img=33", active: false, verified: true },
    { id: 7, name: "Your University", avatar: "https://i.pravatar.cc/150?img=29", active: true, verified: true }
  ];

  // Lazy load resource data
  const [loadedResourceData, setLoadedResourceData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Import resource data dynamically to improve initial load time
    import('../components/resources/ResourceData').then(module => {
      // Simulate progressive loading with better visual feedback
      const total = module.resourceData.length;
      let loaded = 0;
      
      const loadBatch = () => {
        const batchSize = Math.ceil(total / 10);
        const end = Math.min(loaded + batchSize, total);
        
        setLoadedResourceData(prev => [
          ...prev, 
          ...module.resourceData.slice(loaded, end)
        ]);
        
        loaded = end;
        setLoadingProgress((loaded / total) * 100);
        
        if (loaded < total) {
          setTimeout(loadBatch, 50); // Load in small batches for smoother experience
        } else {
          setIsLoading(false);
        }
      };
      
      setIsLoading(true);
      loadBatch();
    });
  }, []);

  // Get filtered resources based on active tab
  const getFilteredResourcesByTab = () => {
    // Use loaded data instead of imported data for better performance
    const baseFiltered = filterResources(loadedResourceData, typeFilter, categoryFilter, searchQuery);
    
    switch(activeTab) {
      case 0: // For You / All
        return baseFiltered;
      case 1: // Trending
        return baseFiltered.filter(r => r.downloads > 30 || (likeCounts[r.id] || 0) > 10);
      case 2: // Following
        return baseFiltered.filter(r => following[r.author.id]);
      case 3: // Bookmarked
        return baseFiltered.filter(r => bookmarked[r.id]);
      default:
        return baseFiltered;
    }
  };
  
  // Memoize filtered resources to prevent unnecessary re-filtering
  const filteredResources = useCallback(getFilteredResourcesByTab, [
    loadedResourceData, activeTab, typeFilter, categoryFilter, searchQuery, following, bookmarked, likeCounts
  ])();

  // Event handlers
  const handleCardClick = useCallback((id) => {
    navigate(`/resources/${id}`);
  }, [navigate]);

  const handleBookmark = useCallback((id, title) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    toast({
      title: `${bookmarked[id] ? "Removed from" : "Added to"} bookmarks: ${title}`,
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  }, [bookmarked, toast]);

  const handleLike = useCallback((id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
    setLikeCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + (liked[id] ? -1 : 1)
    }));
  }, [liked]);

  const handleShare = useCallback((id) => {
    toast({
      title: `Shared resource #${id}`,
      status: "info",
      duration: 1500,
      isClosable: true,
    });
  }, [toast]);

  const handleAddComment = useCallback((resourceId, commentText) => {
    const newComment = {
      id: Date.now(),
      text: commentText,
      user: { name: "You", avatar: "https://i.pravatar.cc/150?img=12" },
      date: new Date()
    };

    setComments(prev => ({
      ...prev,
      [resourceId]: [...(prev[resourceId] || []), newComment]
    }));
  }, []);
  
  const handleFollow = useCallback((authorId, isFollowing) => {
    setFollowing(prev => ({ ...prev, [authorId]: isFollowing }));
    toast({
      title: isFollowing ? "You are now following this contributor" : "You unfollowed this contributor",
      status: "success",
      duration: 1500,
      isClosable: true,
    });
  }, [toast]);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
  };
  
  const handleViewChange = (type) => {
    setFeedType(type);
  };
  
  const handleCreateResource = () => {
    toast({
      title: "Create Resource",
      description: "This would open a form to create a new resource",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box bg={bgColor} minH="calc(100vh - 80px)">
      {/* Progress loader */}
      {isLoading && loadingProgress < 100 && (
        <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Progress size="xs" value={loadingProgress} colorScheme="blue" isAnimated />
        </Box>
      )}
      
      {/* Main layout with separate feed and sidebar */}
      <Flex maxW="1400px" mx="auto" gap={{ base: 2, md: 4, lg: 6 }} px={{ base: 2, md: 4 }}>
          {/* Main content area */}
          <Box flex="1" maxW={{ base: "100%", lg: "calc(100% - 340px)" }} order={{ base: 1, lg: 1 }}>
            <VStack spacing={6} align="stretch">
        {/* Header with organized search and controls */}
        <Box bg={cardBg} borderRadius="xl" mb={4} overflow="hidden">
          <Flex 
            direction={{ base: "column", md: "row" }} 
            align="center" 
            justify="space-between" 
            p={4} 
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Heading 
              size="md" 
              color={textColor} 
              fontWeight="800" 
              letterSpacing="tight"
              textAlign={{ base: "center", md: "left" }}
              mb={{ base: 3, md: 0 }}
            >
              <HStack>
                <Box color="blue.500">
                  <FiGrid size={24} />
                </Box>
                <Text>Resource Hub</Text>
              </HStack>
            </Heading>
            
            <HStack spacing={3} w={{ base: "full", md: "auto" }}>
              <InputGroup size="md" w={{ base: "full", md: "320px" }}>
                <InputLeftElement>
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Search by title, topic, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="full"
                  bg={useColorModeValue("gray.50", "gray.700")}
                />
                {searchQuery && (
                  <InputRightElement>
                    <IconButton 
                      icon={<Text fontSize="xs">✕</Text>} 
                      size="xs" 
                      variant="ghost" 
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
              
              <HStack spacing={2} display={{ base: "none", md: "flex" }}>
                <Button 
                  leftIcon={<FiFilter />}
                  variant={showFilters ? "solid" : "ghost"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  colorScheme={showFilters ? "blue" : "gray"}
                >
                  {showFilters ? "Hide Filters" : "Filters"}
                </Button>
              </HStack>
            </HStack>
          </Flex>
          
          {/* Mobile actions */}
          <Flex 
            justify="space-between" 
            p={3} 
            borderBottomWidth="1px" 
            borderColor={borderColor}
            display={{ base: "flex", md: "none" }}
          >
            <Button 
              leftIcon={<FiFilter />}
              variant={showFilters ? "solid" : "ghost"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              colorScheme={showFilters ? "blue" : "gray"}
              flex={1}
              mr={2}
            >
              {showFilters ? "Hide Filters" : "Filters"}
            </Button>
          </Flex>
        </Box>
        
        {/* LinkedIn-style post creation box */}
        <Box
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
          overflow="hidden"
          mb={4}
        >
          <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center" mb={4}>
              <Avatar size="md" src="https://i.pravatar.cc/150?img=12" mr={3} />
              <Button
                variant="outline"
                borderColor={borderColor}
                borderRadius="full"
                py={6}
                px={4}
                w="full"
                justifyContent="flex-start"
                fontWeight="normal"
                color={mutedText}
                leftIcon={<FiEdit />}
                onClick={handleCreateResource}
              >
                Start a post...
              </Button>
            </Flex>
            <Flex justify="space-between" wrap="wrap">
              <Button leftIcon={<FiImage color="#31A24C" />} variant="ghost" mb={{ base: 2, md: 0 }}>
                Photo
              </Button>
              <Button leftIcon={<FiVideo color="#E7A33E" />} variant="ghost" mb={{ base: 2, md: 0 }}>
                Video
              </Button>
              <Button leftIcon={<FiFileText color="#0073B1" />} variant="ghost" mb={{ base: 2, md: 0 }}>
                Document
              </Button>
              <Button leftIcon={<FiPaperclip color="#7FC15E" />} variant="ghost" mb={{ base: 2, md: 0 }}>
                Attachment
              </Button>
            </Flex>
          </Box>
        </Box>
        
        {/* Filters Component - Conditional */}
        {showFilters && (
          <Box mb={4}>
            <ResourceFilters
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              cardBg={cardBg}
              mutedText={mutedText}
              accentColor={accentColor}
            />
          </Box>
        )}
        
        {/* Tabs for different feed views */}
        <Tabs 
          variant="soft-rounded" 
          colorScheme="blue" 
          mb={6} 
          index={activeTab} 
          onChange={handleTabChange}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            'scrollbarWidth': 'none', 
            '-ms-overflow-style': 'none',
          }}
          w="full"
          size={{ base: "sm", md: "md" }}
        >
          <TabList mb={4} overflowX="auto" flexWrap={{ base: "nowrap", md: "wrap" }}>
            <Tab _selected={{ bg: highlightColor }} fontSize={{ base: "xs", sm: "sm", md: "md" }} py={{ base: 1, md: 2 }}>For You</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiTrendingUp />} fontSize={{ base: "xs", sm: "sm", md: "md" }} py={{ base: 1, md: 2 }} iconSpacing={{ base: 1, md: 2 }}>Trending</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiUsers />} fontSize={{ base: "xs", sm: "sm", md: "md" }} py={{ base: 1, md: 2 }} iconSpacing={{ base: 1, md: 2 }}>Following</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiBookmark />} fontSize={{ base: "xs", sm: "sm", md: "md" }} py={{ base: 1, md: 2 }} iconSpacing={{ base: 1, md: 2 }}>Bookmarked</Tab>
          </TabList>
          
          <TabPanels>
            {[0, 1, 2, 3].map((tabIndex) => (
              <TabPanel p={0} key={tabIndex}>
                {/* Responsive container for feed content */}
                <Box w="full" maxW={{ base: "100%", md: "650px", lg: "100%" }} mx="auto" position="relative">
                  {/* Main Content */}
                  
                  {/* Main Content */}
                  <ResourceList
                    filteredResources={filteredResources}
                    bookmarked={bookmarked}
                    liked={liked}
                    likeCounts={likeCounts}
                    comments={comments}
                    onBookmark={handleBookmark}
                    onLike={handleLike}
                    onShare={handleShare}
                    onAddComment={handleAddComment}
                    onFollow={handleFollow}
                    onCardClick={handleCardClick}
                    cardBg={cardBg}
                    textColor={textColor}
                    mutedText={mutedText}
                    borderColor={borderColor}
                    isLoading={isLoading}
                    feedType={feedType}
                  />
                </Box>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
          </VStack>
          </Box>
          
          {/* Right sidebar with trending topics */}
          <Box 
            display={{ base: "none", lg: "block" }}
            order={{ base: 2, lg: 2 }}
            width="320px"
            flexShrink="0"
          >
            <Box 
              position="sticky" 
              top="20px"
              width="320px"
              maxHeight="calc(100vh - 40px)"
              overflowY="auto"
              paddingRight="2"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                  backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
                  borderRadius: '24px',
                }
              }}
            >
              <VStack spacing={4} align="stretch" width="100%" pb="20px">
                {/* Trending Hashtags - Improved Design */}
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="md"
                  overflow="hidden"
                >
                  <Box 
                    p={4} 
                    borderBottomWidth="1px" 
                    borderColor={borderColor}
                    bg={useColorModeValue("blue.50", "blue.900")}
                  >
                    <Flex align="center" justify="space-between">
                      <HStack>
                        <FiTrendingUp size={18} color={useColorModeValue("#4299E1", "#90CDF4")} />
                        <Heading size="md" fontWeight="600" color={useColorModeValue("blue.600", "blue.200")}>Trending Hashtags</Heading>
                      </HStack>
                      <Box
                        bg={useColorModeValue("blue.100", "blue.700")}
                        color={useColorModeValue("blue.700", "blue.200")}
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        LIVE
                      </Box>
                    </Flex>
                  </Box>
                  
                  <VStack align="start" spacing={0} divider={<Divider />} pb={2}>
                    {[
                      { hashtag: "#MachineLearning", count: 152, trend: "up", change: "+12%" },
                      { hashtag: "#ResearchMethods", count: 98, trend: "up", change: "+8%" },
                      { hashtag: "#CalculusII", count: 76, trend: "down", change: "-3%" },
                      { hashtag: "#ComputerScience", count: 64, trend: "up", change: "+15%" },
                      { hashtag: "#Statistics", count: 57, trend: "neutral", change: "0%" }
                    ].map((item, index) => (
                      <Box 
                        key={index} 
                        py={3} 
                        px={4} 
                        w="full" 
                        _hover={{ bg: useColorModeValue("gray.50", "gray.700") }} 
                        cursor="pointer"
                        transition="all 0.2s"
                        role="group"
                      >
                        <Flex align="center" justify="space-between">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="600" fontSize="md">{item.hashtag}</Text>
                            <Text fontSize="sm" color={mutedText}>{item.count} posts</Text>
                          </VStack>
                          <HStack>
                            <Box 
                              color={item.trend === "up" ? "green.500" : item.trend === "down" ? "red.500" : mutedText}
                              fontWeight="medium"
                              fontSize="sm"
                            >
                              {item.change}
                            </Box>
                            <Box color={item.trend === "up" ? "green.500" : item.trend === "down" ? "red.500" : mutedText}>
                              {item.trend === "up" ? <FiTrendingUp /> : item.trend === "down" ? <FiTrendingUp style={{ transform: 'rotate(180deg)' }} /> : "-"}
                            </Box>
                          </HStack>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                  
                  <Box 
                    p={4} 
                    borderTopWidth="1px" 
                    borderColor={borderColor}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                  >
                    <Text fontSize="sm" color={mutedText}>View all trending topics</Text>
                  </Box>
                </Box>
                
                {/* Resource Contributors */}
                <Box
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="sm"
                  overflow="hidden"
                  mt={4}
                >
                </Box>
              </VStack>
            </Box>
          </Box>
      </Flex>
    </Box>
  );
};

export default ResourcesPage;