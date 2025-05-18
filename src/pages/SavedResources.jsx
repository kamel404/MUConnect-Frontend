import { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Center,
  Icon,
  useColorModeValue,
  Button,
  Tag,
  TagLabel,
  HStack,
  Tabs,
  TabList,
  Tab,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { FiSearch, FiBookmark, FiGrid, FiList, FiFolder, FiClock, FiTrendingUp, FiArrowLeft } from "react-icons/fi";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ResourceCard from "../components/resources/ResourceCard";

// Mock data for saved resources
// Categories for resources
const resourceCategories = [
  { id: "all", name: "All Resources", icon: FiFolder, color: "gray.500" },
  { id: "document", name: "Documents", icon: FiFolder, color: "blue.500" },
  { id: "video", name: "Videos", icon: FiFolder, color: "red.500" },
];

const savedResourcesData = [
  {
    id: "sr1",
    title: "Introduction to Computer Science",
    type: "Document",
    fileType: "PDF",
    fileSize: "3.5 MB",
    downloadCount: 142,
    uploadDate: "2023-03-15",
    description: "A comprehensive introduction to computer science principles",
    tags: ["Computer Science", "Introduction", "Programming"],
    author: {
      name: "Dr. Smith",
      avatar: "https://bit.ly/ryan-florence",
    },
    isSaved: true,
  },
  {
    id: "sr2",
    title: "Advanced Calculus Tutorial",
    type: "Video",
    duration: "45:23",
    views: 2780,
    uploadDate: "2023-02-10",
    description: "Step-by-step walkthrough of advanced calculus problems",
    tags: ["Math", "Calculus", "Tutorial"],
    author: {
      name: "Prof. Johnson",
      avatar: "https://bit.ly/sage-adebayo",
    },
    isSaved: true,
  },
  {
    id: "sr3",
    title: "Literary Analysis Methods",
    type: "Document",
    fileType: "DOCX",
    fileSize: "1.2 MB",
    downloadCount: 89,
    uploadDate: "2023-04-05",
    description: "Methods and approaches for analyzing literature",
    tags: ["Literature", "Analysis", "English"],
    author: {
      name: "Dr. Williams",
      avatar: "https://bit.ly/kent-c-dodds",
    },
    isSaved: true,
  },
];

const SavedResources = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarked, setBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const gradientBg = useColorModeValue(
    "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
    "linear-gradient(135deg, #263238 0%, #37474f 50%, #455a64 100%)"
  );
  const activeTabBg = useColorModeValue("blue.50", "blue.900");
  const categoryHoverBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    // In a real app, you would fetch saved resources from an API
    // For now, we'll use the mock data
    setResources(savedResourcesData);

    // Initialize bookmarked, liked, likeCounts, and comments for each resource
    const initialBookmarked = {};
    const initialLiked = {};
    const initialLikeCounts = {};
    const initialComments = {};

    savedResourcesData.forEach(resource => {
      initialBookmarked[resource.id] = true; // All saved resources are bookmarked
      initialLiked[resource.id] = false;
      initialLikeCounts[resource.id] = Math.floor(Math.random() * 50) + 5; // Random like count
      initialComments[resource.id] = []; // Empty comments array
    });

    setBookmarked(initialBookmarked);
    setLiked(initialLiked);
    setLikeCounts(initialLikeCounts);
    setComments(initialComments);
  }, []);

  // Filter resources based on search query and active category
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "document" && resource.type === "Document") ||
      (activeCategory === "video" && resource.type === "Video");

    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (resourceId) => {
    // Navigate to resource detail page
    console.log(`Navigating to resource ${resourceId}`);
    // In a real app: navigate(`/resources/${resourceId}`);
  };

  const handleBookmark = (resourceId) => {
    setBookmarked(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));
  };

  const handleLike = (resourceId) => {
    setLiked(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));

    setLikeCounts(prev => ({
      ...prev,
      [resourceId]: prev[resourceId] + (liked[resourceId] ? -1 : 1)
    }));
  };

  const handleShare = (resourceId) => {
    console.log(`Sharing resource ${resourceId}`);
  };

  const handleAddComment = (resourceId, comment) => {
    setComments(prev => ({
      ...prev,
      [resourceId]: [...(prev[resourceId] || []), {
        id: Date.now(),
        text: comment,
        user: {
          name: "You",
          avatar: "https://bit.ly/sage-adebayo"
        },
        timestamp: new Date().toISOString()
      }]
    }));
  };

  const MotionGrid = motion(Grid);
  const MotionBox = motion(Box);
  const MotionFlex = motion(Flex);

  // Card animations for staggered entry
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box>
      {/* Back button */}
      <Flex mb={4} align="center">
        <IconButton
          icon={<FiArrowLeft />}
          aria-label="Go back"
          variant="ghost"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          onClick={handleGoBack}
          _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
        />
        <Text ml={2} fontWeight="medium" color={mutedColor}>Go Back</Text>
      </Flex>

      <Flex
        direction="column"
        gap={6}
      >
        {/* View Controls and Filters */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={4}
          wrap="wrap"
        >
          <Flex direction="column" gap={2}>
            <Heading size="lg" color={textColor}>
              Saved Resources
            </Heading>
            <Text color={mutedColor}>
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} available
            </Text>
          </Flex>

          <Flex gap={4} direction={{ base: "column", sm: "row" }} width={{ base: "100%", md: "auto" }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={mutedColor} />
              </InputLeftElement>
              <Input
                placeholder="Search saved resources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor={borderColor}
                bg={bgColor}
              />
            </InputGroup>

            <HStack spacing={1} bg={bgColor} borderRadius="md" p={1} borderWidth="1px" borderColor={borderColor}>
              <Button
                leftIcon={<FiGrid />}
                size="sm"
                variant={viewMode === "grid" ? "solid" : "ghost"}
                colorScheme={viewMode === "grid" ? "blue" : "gray"}
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button
                leftIcon={<FiList />}
                size="sm"
                variant={viewMode === "list" ? "solid" : "ghost"}
                colorScheme={viewMode === "list" ? "blue" : "gray"}
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {/* Categories Navigation */}
        <Tabs variant="soft-rounded" colorScheme="blue" mb={2}>
          <TabList overflowX="auto" py={2} css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            'scrollbarWidth': 'none',
            'msOverflowStyle': 'none',
          }}>
            {resourceCategories.map((category) => (
              <Tab
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                bg={activeCategory === category.id ? activeTabBg : 'transparent'}
                color={activeCategory === category.id ? category.color : textColor}
                fontWeight={activeCategory === category.id ? "bold" : "normal"}
                mr={2}
                mb={2}
                minW="140px"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ bg: categoryHoverBg }}
              >
                <Flex align="center" gap={2}>
                  <Icon as={category.icon} color={category.color} />
                  <Text>{category.name}</Text>
                </Flex>
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <AnimatePresence mode="wait">
          {filteredResources.length > 0 ? (
            viewMode === "grid" ? (
              <MotionGrid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gap={6}
                variants={container}
                initial="hidden"
                animate="show"
                key="grid-view"
              >
                {filteredResources.map((resource, index) => (
                  <MotionBox
                    key={resource.id}
                    variants={item}
                    whileHover={{ y: -5, boxShadow: "lg" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ResourceCard
                      resource={resource}
                      bookmarked={bookmarked[resource.id] || false}
                      liked={liked[resource.id] || false}
                      likeCounts={likeCounts}
                      comments={comments}
                      onBookmark={() => handleBookmark(resource.id)}
                      onLike={() => handleLike(resource.id)}
                      onShare={() => handleShare(resource.id)}
                      onAddComment={handleAddComment}
                      onCardClick={() => handleCardClick(resource.id)}
                      cardBg={cardBg}
                      textColor={textColor}
                      mutedText={mutedColor}
                      borderColor={borderColor}
                    />
                  </MotionBox>
                ))}
              </MotionGrid>
            ) : (
              <MotionFlex
                direction="column"
                gap={4}
                variants={container}
                initial="hidden"
                animate="show"
                key="list-view"
              >
                {filteredResources.map((resource) => (
                  <MotionBox
                    key={resource.id}
                    variants={item}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    bg={cardBg}
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    onClick={() => handleCardClick(resource.id)}
                    cursor="pointer"
                  >
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color={textColor}>{resource.title}</Heading>
                        <Text color={mutedColor} noOfLines={1}>{resource.description}</Text>
                        <HStack mt={2} spacing={2}>
                          {resource.tags.map((tag, idx) => (
                            <Tag key={idx} size="sm" colorScheme={idx % 2 === 0 ? "blue" : "purple"}>
                              <TagLabel>{tag}</TagLabel>
                            </Tag>
                          ))}
                        </HStack>
                      </VStack>
                      <Flex direction="column" align="flex-end" gap={2}>
                        <Text fontWeight="bold" color={mutedColor}>
                          {resource.type === "Document" ?
                            `${resource.fileType} · ${resource.fileSize}` :
                            `${resource.duration} · ${resource.views} views`}
                        </Text>
                        <Text color={mutedColor} fontSize="sm">
                          Saved on {new Date(resource.uploadDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </Flex>
                  </MotionBox>
                ))}
              </MotionFlex>
            )
          ) : (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="empty-state"
            >
              <Center
                py={12}
                px={6}
                borderRadius="xl"
                bg={bgColor}
                flexDirection="column"
                gap={4}
                borderWidth="1px"
                borderColor={borderColor}
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <MotionBox
                  position="absolute"
                  width="150px"
                  height="150px"
                  borderRadius="50%"
                  background="linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(99, 179, 237, 0.1) 100%)"
                  top="-20px"
                  left="-20px"
                  zIndex="0"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4
                  }}
                />
                <MotionBox
                  position="absolute"
                  width="100px"
                  height="100px"
                  borderRadius="50%"
                  background="linear-gradient(135deg, rgba(159, 122, 234, 0.1) 0%, rgba(183, 148, 244, 0.1) 100%)"
                  bottom="-20px"
                  right="-20px"
                  zIndex="0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5
                  }}
                />
                <MotionBox
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  zIndex="1"
                >
                  <Icon as={FiBookmark} fontSize="5xl" color={mutedColor} />
                </MotionBox>
                <MotionBox
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  zIndex="1"
                >
                  <Heading size="lg" color={textColor} mb={2}>
                    No saved resources found
                  </Heading>
                  <Text color={mutedColor} fontSize="lg">
                    {searchQuery
                      ? "Try adjusting your search query or category filter"
                      : "Start saving resources to build your personal knowledge library"}
                  </Text>
                </MotionBox>
                <MotionBox
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  zIndex="1"
                >
                  <Button
                    mt={4}
                    colorScheme="blue"
                    size="lg"
                    onClick={() => window.location.href = "/resources"}
                    shadow="md"
                    _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  >
                    Discover Resources
                  </Button>
                </MotionBox>
              </Center>
            </MotionBox>
          )}
        </AnimatePresence>
      </Flex>
    </Box>
  );
};

export default SavedResources;
