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
  SimpleGrid
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef } from "react";
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceList from '../components/resources/ResourceList';
import {filterResources} from '../components/resources/ResourceUtils';
import {resourceData} from '../components/resources/ResourceData';
import { FiPlus, FiSearch, FiFilter, FiTrendingUp, FiClock, FiBookmark, FiUsers, FiGrid, FiList, FiUpload } from "react-icons/fi";
import { motion } from "framer-motion";




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

  // Simulate loading effect
  useEffect(() => {
    if (activeTab !== 0 || searchQuery !== "") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeTab, searchQuery]);

  // Get filtered resources based on active tab
  const getFilteredResourcesByTab = () => {
    const baseFiltered = filterResources(resourceData, typeFilter, categoryFilter, searchQuery);
    
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
  
  const filteredResources = getFilteredResourcesByTab();

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
    <Flex direction="column" minH="100vh" p={{ base: 2, md: 4 }} bg={bgColor}>
      <Box maxW="container.xl" mx="auto" w="full">
        {/* Header with search and user controls */}
        <Flex justify="space-between" align="center" mb={4} py={2} borderBottomWidth="1px" borderColor={borderColor}>
          <Heading size="lg" color={textColor} fontWeight="800" letterSpacing="tight">
            Campus Connect
          </Heading>
          
          <HStack spacing={3}>
            <InputGroup size="md" w={{ base: "auto", md: "320px" }} display={{ base: "none", md: "flex" }}>
              <InputLeftElement>
                <FiSearch color="gray.400" />
              </InputLeftElement>
              <Input 
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="full"
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
            
            <HStack spacing={2}>
              <Button 
                leftIcon={<FiFilter />}
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                display={{ base: "flex", md: showFilters ? "flex" : "none" }}
              >
                Filters
              </Button>
              
              <IconButton 
                icon={feedType === 'feed' ? <FiGrid /> : <FiList />}
                aria-label="Change view"
                variant="ghost"
                onClick={() => handleViewChange(feedType === 'feed' ? 'grid' : 'feed')}
                display={{ base: "none", md: "flex" }}
              />
              
              <Button 
                leftIcon={<FiPlus />}
                colorScheme="blue"
                size="sm"
                onClick={handleCreateResource}
              >
                Create
              </Button>
            </HStack>
          </HStack>
        </Flex>
        
        {/* Mobile search */}
        <InputGroup size="md" mb={4} display={{ base: "flex", md: "none" }}>
          <InputLeftElement>
            <FiSearch color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="full"
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
        
        {/* Stories/Featured users row */}
        <Box 
          overflowX="auto"
          pb={2} 
          mb={4} 
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            'scrollbarWidth': 'none', 
            '-ms-overflow-style': 'none',
          }}
        >
          <HStack spacing={4} w="max-content" p={1}>
            {featuredUsers.map(user => (
              <StoryCircle key={user.id} user={user} active={user.active} />
            ))}
          </HStack>
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
        >
          <TabList mb={4}>
            <Tab _selected={{ bg: highlightColor }}>For You</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiTrendingUp />}>Trending</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiUsers />}>Following</Tab>
            <Tab _selected={{ bg: highlightColor }} leftIcon={<FiBookmark />}>Bookmarked</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0}>
              {/* Main feed */}
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
            </TabPanel>
            
            <TabPanel p={0}>
              {/* Trending resources */}
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
            </TabPanel>
            
            <TabPanel p={0}>
              {/* Following feed */}
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
            </TabPanel>
            
            <TabPanel p={0}>
              {/* Bookmarked resources */}
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
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ResourcesPage;