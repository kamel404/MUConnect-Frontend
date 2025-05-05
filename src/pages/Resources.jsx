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
  Textarea,
  color
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceList from '../components/resources/ResourceList';
import { filterResources } from '../components/resources/ResourceUtils';
import { FiPlus, FiSearch, FiFilter, FiFileText, FiTrendingUp, FiVideo, FiImage, FiPaperclip, FiSend, FiEdit, FiBookOpen } from "react-icons/fi";
import CreatePostModal from './CreatePostModal';

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
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: onPostModalClose } = useDisclosure();

  // State for feed options
  const [activeTab, setActiveTab] = useState(0);
  const [feedType, setFeedType] = useState('feed'); // 'feed' or 'grid'
  const [isLoading, setIsLoading] = useState(false);

  // Filtering and search state
  const [typeFilter, setTypeFilter] = useState("All");
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

  // Resource data state
  const [loadedResourceData, setLoadedResourceData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Set loading state
    setIsLoading(true);
    setLoadingProgress(0);

    // Import resource data directly
    import('../components/resources/ResourceData')
      .then(module => {
        // Simulate progressive loading for visual feedback
        const total = module.resourceData.length;
        const simulateProgress = () => {
          setLoadingProgress(prev => {
            // Increment by 10-15% per step
            const increment = Math.floor(Math.random() * 15) + 10;
            const newProgress = Math.min(prev + increment, 95);

            if (newProgress >= 95) {
              // When progress reaches 95%, load all data first, then complete loading
              setTimeout(() => {
                setLoadedResourceData(module.resourceData);
                // Add a small delay to ensure data is processed before removing loading state
                setTimeout(() => {
                  setLoadingProgress(100);
                  setIsLoading(false);
                }, 800);
              }, 300);
            } else {
              // Continue progress simulation
              setTimeout(simulateProgress, 200);
            }

            return newProgress;
          });
        };

        // Start progress simulation
        simulateProgress();
      })
      .catch(error => {
        console.error('Error loading resource data:', error);
        setIsLoading(false);
        setLoadingProgress(0);
        toast({
          title: "Error loading resources",
          description: "There was a problem loading the resource data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  // Get filtered resources based on active tab
  const getFilteredResourcesByTab = () => {
    // Use loaded data instead of imported data for better performance
    const baseFiltered = filterResources(loadedResourceData, typeFilter, searchQuery);

    switch (activeTab) {
      case 0: // For You / All
        return baseFiltered;
      case 1: // Trending
        return baseFiltered.filter(r => r.downloads > 30 || (likeCounts[r.id] || 0) > 10);
      case 3: // Bookmarked
        return baseFiltered.filter(r => bookmarked[r.id]);
      default:
        return baseFiltered;
    }
  };

  // Memoize filtered resources to prevent unnecessary re-filtering
  const filteredResources = useCallback(getFilteredResourcesByTab, [
    loadedResourceData, activeTab, typeFilter, searchQuery, bookmarked, likeCounts
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

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleCreateResource = () => {
    onPostModalOpen();
  };

  const handleAddNewPost = (content, type, postData) => {
    // Create a new resource post with the data from the modal
    const newPost = {
      id: `post-${Date.now()}`,
      description: content,
      type: type || 'Default',
      fileType: postData.fileType || 'text/plain',
      creator: { name: 'You', avatar: 'https://i.pravatar.cc/150?img=12' },
      ...postData,
      downloads: 0
    };

    // Add to resource data
    setLoadedResourceData(prev => [newPost, ...prev]);

    toast({
      title: 'Post created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minH="calc(100vh - 80px)">
      {/* Progress loader */}
      {isLoading && loadingProgress < 100 && (
        <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Progress size="xs" value={loadingProgress} colorScheme="blue" isAnimated />
        </Box>
      )}

      {/* Main layout with separate feed and sidebar */}
      <Flex maxW="1400px" mx="auto" gap={{ base: 2, md: 4, lg: 6 }} px={{ base: 2, md: 4 }}>
        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={onPostModalClose}
          addNewPost={handleAddNewPost}
          user={{ name: 'You', avatar: 'https://i.pravatar.cc/150?img=12' }}
        />
        {/* Main content area */}
        <Box flex="1" maxW={{ base: "100%", lg: "calc(100% - 340px)" }} order={{ base: 1, lg: 1 }}>
          <VStack spacing={6} align="stretch">
            {/* Header with search and filters */}
            <Box bg={cardBg} borderRadius="xl" mb={4} overflow="hidden">
              {/* Search and filter row */}
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                p={4}
                borderBottomWidth="1px"
                borderColor={borderColor}
              >
                <Heading
                  size="lg"
                  color={textColor}
                  fontWeight="bold"
                  letterSpacing="tight"
                  textAlign={{ base: "center", md: "left" }}
                  mb={{ base: 3, md: 0 }}
                >
                  Resources
                </Heading>

                <HStack spacing={3} w={{ base: "full", md: "auto" }}>
                  <InputGroup size="md" w={{ base: "full", md: "260px" }}>
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

                  <Button
                    leftIcon={<FiFilter />}
                    variant={showFilters ? "solid" : "outline"}
                    size="md"
                    onClick={() => setShowFilters(!showFilters)}
                    colorScheme={showFilters ? "blue" : "gray"}
                    display={{ base: "none", md: "flex" }}
                  >
                    {showFilters ? "Hide Filters" : "Filters"}
                  </Button>
                </HStack>
              </Flex>

              {/* Start a post section */}
              <Box
                p={4}
                borderBottomWidth="1px"
                borderColor={borderColor}
              >
                <Flex align="center">
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
              </Box>

              {/* Mobile filter button */}
              <Flex
                p={3}
                borderBottomWidth="1px"
                borderColor={borderColor}
                display={{ base: "flex", md: "none" }}
              >
                <Button
                  leftIcon={<FiFilter />}
                  variant={showFilters ? "solid" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  colorScheme={showFilters ? "blue" : "gray"}
                  w="full"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </Flex>

              {/* Conditionally visible filters section */}
              {showFilters && (
                <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                  <ResourceFilters
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    searchQuery={searchQuery}
                    cardBg={cardBg}
                    mutedText={mutedText}
                    accentColor={accentColor}
                  />
                </Box>
              )}
            </Box>

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
                      <Heading size="md" fontWeight="600" color={useColorModeValue("blue.600", "blue.200")}>Trending Topics</Heading>
                    </HStack>
                  </Flex>
                </Box>

                <VStack align="start" color={"blue.500"} spacing={0} divider={<Divider />} pb={2}>
                  {[
                    { hashtag: "#MachineLearning" },
                    { hashtag: "#ResearchMethods" },
                    { hashtag: "#CalculusII" },
                    { hashtag: "#ComputerScience" },
                    { hashtag: "#Statistics" }
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
                        </VStack>
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