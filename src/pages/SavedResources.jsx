import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedItems } from "../services/resourceService";
import { toggleSaveResource } from "../services/resourceService";
import { toggleSaveEvent } from "../services/eventsService"; // Assuming a similar function exists for events or can be adapted
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
  Tabs,
  TabList,
  Tab,
  VStack,
  IconButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { FiSearch, FiArrowLeft, FiGrid, FiList, FiFolder, FiFileText, FiBookmark, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ResourceCard from "../components/resources/ResourceCard";
import EventCard from "../components/events/EventCard"; // Import the new EventCard
import { getCurrentUser } from "../services/authService";

const itemCategories = [
  { id: "all", name: "All Items", icon: FiFolder, color: "gray.500" },
  { id: "Resource", name: "Resources", icon: FiFileText, color: "blue.500" },
  { id: "Event", name: "Events", icon: FiCalendar, color: "purple.500" },
];

const SavedResources = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [currentUser, setCurrentUser] = useState(null);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const activeTabBg = useColorModeValue("blue.50", "blue.900");
  const categoryHoverBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        const itemsData = await getSavedItems();
        // Mark items as saved for the UI
        const itemsWithSaveState = itemsData.data.map(item => ({
          ...item,
          isSaved: true,
          data: item.type === 'Resource' ? { ...item.data, is_saved: true } : item.data,
        }));
        setSavedItems(itemsWithSaveState);
      } catch (err) {
        setError("Failed to fetch saved items. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleBookmark = async (itemId, itemType) => {
    const originalItems = [...savedItems];
    const updatedItems = savedItems.filter(item => item.data?.id !== itemId);
    setSavedItems(updatedItems);

    try {
      if (itemType === 'Resource') {
        await toggleSaveResource(itemId);
      } else if (itemType === 'Event') {
        await toggleSaveEvent(itemId);
      }
    } catch (err) {
      console.error("Failed to update bookmark status:", err);
      // Revert if API call fails
      setSavedItems(originalItems);
    }
  };

  const handleCardClick = (itemId, itemType) => {
    if (itemType === 'Resource') {
      navigate(`/resources/${itemId}`);
    } else if (itemType === 'Event') {
      navigate(`/events`);
    }
  };

  const filteredItems = savedItems.filter((item) => {
    if (!item.data) {
        // Keep items that are no longer available so user can see them
        if (activeCategory === 'all' && searchQuery === '') return true;
        return false;
    }
    const matchesSearch =
      item.data.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || item.type === activeCategory;

    return matchesSearch && matchesCategory;}).sort((a,b)=> new Date(b.saved_at||0)-new Date(a.saved_at||0));

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleGoBack = () => {
    window.history.back();
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Center w="full" py={12}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }} gap={6} w="full">
            {[...Array(6)].map((_, i) => (
              <Box key={i} borderWidth="1px" borderRadius="lg" p={4} bg={cardBg} borderColor={borderColor}>
                <Skeleton height="150px" mb={4} />
                <SkeletonText noOfLines={3} spacing="4" />
              </Box>
            ))}
          </Grid>
        </Center>
      );
      return (
        <Center h="300px">
          <Spinner size="xl" color="blue.500" />
        </Center>
      );
    }

    if (error) {
      return (
        <Center h="300px">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle>An Error Occurred!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </Center>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <Center h="300px">
          <VStack>
            <Icon as={FiBookmark} boxSize="50px" color={mutedColor} />
            <Heading size="md" color={textColor}>No Saved Items Found</Heading>
            <Text color={mutedColor}>
              {searchQuery || activeCategory !== 'all'
                ? "Try adjusting your search or filter."
                : "You haven't saved any items yet."}
            </Text>
          </VStack>
        </Center>
      );
    }

    const gridTemplate = {
      base: "1fr",
      md: "repeat(2, 1fr)",
      lg: "repeat(3, 1fr)",
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          variants={container}
          initial="hidden"
          animate="show"
        >
          {viewMode === "grid" ? (
            <Grid templateColumns={gridTemplate} gap={6}>
              {paginatedItems.map((item) => (
                <motion.div key={`${item.type}-${item.data?.id || item.saved_at}`} variants={itemVariant}>
                  {item.type === 'Resource' ? (
                    <ResourceCard
                      resource={item.data}
                      onBookmark={() => handleBookmark(item.data.id, 'Resource')}
                      onCardClick={() => handleCardClick(item.data.id, 'Resource')}
                      currentUser={currentUser}
                      cardBg={cardBg}
                      textColor={textColor}
                      mutedText={mutedColor}
                      borderColor={borderColor}
                    />
                  ) : (
                    <EventCard
                      event={item}
                      onBookmark={() => handleBookmark(item.data.id, 'Event')}
                      onCardClick={() => handleCardClick(item.data.id, 'Event')}
                    />
                  )}
                </motion.div>
              ))}
            </Grid>
          ) : (
            <VStack spacing={4} align="stretch">
              {paginatedItems.map((item) => (
                <motion.div key={`${item.type}-${item.data?.id || item.saved_at}`} variants={itemVariant}>
                   {item.type === 'Resource' ? (
                    <ResourceCard
                      resource={item.data}
                      onBookmark={() => handleBookmark(item.data.id, 'Resource')}
                      onCardClick={() => handleCardClick(item.data.id, 'Resource')}
                      currentUser={currentUser}
                      cardBg={cardBg}
                      textColor={textColor}
                      mutedText={mutedColor}
                      borderColor={borderColor}
                    />
                  ) : (
                    <EventCard
                      event={item}
                      onBookmark={() => handleBookmark(item.data.id, 'Event')}
                      onCardClick={() => handleCardClick(item.data.id, 'Event')}
                    />
                  )}
                </motion.div>
              ))}
            </VStack>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <Flex mb={4} align="center">
        <IconButton
          icon={<FiArrowLeft />}
          aria-label="Go back"
          variant="ghost"
          onClick={handleGoBack}
        />
        <Text ml={2} fontWeight="medium" color={mutedColor}>Go Back</Text>
      </Flex>

      <VStack spacing={6} align="stretch">
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={4}
        >
          <Box>
            <Heading size="lg" color={textColor}>
              My Saved Items
            </Heading>
            <Text color={mutedColor}>
              {loading ? 'Loading...' : `${filteredItems.length} items found`}
            </Text>
          </Box>

          <Flex gap={2} direction={{ base: "column", sm: "row" }} w={{ base: "100%", md: "auto" }}>
            <InputGroup w={{ base: "100%", sm: "250px" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={mutedColor} />
              </InputLeftElement>
              <Input
                placeholder="Search saved items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={cardBg}
              />
            </InputGroup>
            <HStack spacing={1} bg={cardBg} borderRadius="md" p={1} borderWidth="1px" borderColor={borderColor}>
              <Button size="sm" variant={viewMode === 'grid' ? 'solid' : 'ghost'} onClick={() => setViewMode('grid')} leftIcon={<FiGrid/>}>Grid</Button>
              <Button size="sm" variant={viewMode === 'list' ? 'solid' : 'ghost'} onClick={() => setViewMode('list')} leftIcon={<FiList/>}>List</Button>
            </HStack>
          </Flex>
        </Flex>

        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList overflowX="auto" py={2}>
            {itemCategories.map((category) => (
              <Tab
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                bg={activeCategory === category.id ? activeTabBg : 'transparent'}
                _hover={{ bg: categoryHoverBg }}
              >
                <Icon as={category.icon} mr={2} color={category.color} />
                {category.name}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        <>
          {renderContent()}
          {totalPages > 1 && (
            <HStack justify="center" spacing={4} mt={4}>
              <Button onClick={() => setCurrentPage((p) => p - 1)} isDisabled={currentPage === 1}>Previous</Button>
              <Text>Page {currentPage} of {totalPages}</Text>
              <Button onClick={() => setCurrentPage((p) => p + 1)} isDisabled={currentPage === totalPages}>Next</Button>
            </HStack>
          )}
        </>
      </VStack>
    </Box>
  );
};

export default SavedResources;