import {
  Flex,
  Box,
  Heading,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import ResourceFilters from '../components/resources/ResourceFilters';
import ResourceList from '../components/resources/ResourceList';
import  {filterResources}  from '../components/resources/ResourceUtils';
import {resourceData}  from '../components/resources/ResourceData';




/**
 * Main Resources page component that uses extracted components
 */
const ResourcesPage = () => {
  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Filtering and search state
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // User interaction states
  const [bookmarked, setBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});

  // Get filtered resources
  const filteredResources = filterResources(
    resourceData, 
    typeFilter, 
    categoryFilter, 
    searchQuery
  );

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

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={8} direction={{ base: "column", md: "row" }} gap={4}>
          <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
            Educational Resources
          </Heading>
        </Flex>

        {/* Filters Component */}
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

        {/* Resource List Component */}
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
          cardBg={cardBg}
          textColor={textColor}
          mutedText={mutedText}
          borderColor={borderColor}
        />
      </Box>
    </Flex>
  );  
};

export default ResourcesPage;