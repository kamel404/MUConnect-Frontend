import React, { memo } from "react";
import { VStack, Box, Text, SimpleGrid, Center, Spinner, Fade } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ResourceCard from "./ResourceCard";

/**
 * Component for displaying a list of filtered resources in a social media feed format
 */
const ResourceList = ({
  filteredResources,
  bookmarked,
  liked,
  likeCounts,
  comments,
  onBookmark,
  onLike,
  onShare,
  onAddComment,
  onFollow,
  onCardClick,
  cardBg,
  textColor,
  mutedText,
  borderColor,
  isLoading,
  feedType
}) => {
  if (isLoading) {
    // Show skeleton loaders for better UX
    return (
      <VStack spacing={6} align="stretch" w="full">
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            bg={cardBg}
            boxShadow="md"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={borderColor}
            p={0}
            w="full"
            opacity={1 - (i * 0.15)} // Fade out slightly for each consecutive card
          >
            <Box p={4} mb={2}>
              <Spinner size="sm" mr={3} />
              <Text color={mutedText}>Loading resources...</Text>
            </Box>
          </Box>
        ))}
      </VStack>
    );
  }
  
  // Create staggered animation for resource cards
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const displayLayout = feedType === 'grid' 
    ? (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} as={motion.div} variants={container} initial="hidden" animate="show">
        {filteredResources.map((resource, index) => (
          <Box as={motion.div} key={resource.id} variants={item} mb={3}>
            <ResourceCard
              resource={resource}
              bookmarked={bookmarked}
              liked={liked}
              likeCounts={likeCounts}
              comments={comments}
              onBookmark={onBookmark}
              onLike={onLike}
              onShare={onShare}
              onAddComment={onAddComment}
              onFollow={onFollow}
              onCardClick={onCardClick}
              cardBg={cardBg}
              textColor={textColor}
              mutedText={mutedText}
              borderColor={borderColor}
            />
          </Box>
        ))}
      </SimpleGrid>
    ) : (
      <VStack spacing={6} align="stretch" w="full" as={motion.div} variants={container} initial="hidden" animate="show">
        {filteredResources.map((resource, index) => (
          <Box as={motion.div} key={resource.id} variants={item}>
            <ResourceCard
              resource={resource}
              bookmarked={bookmarked}
              liked={liked}
              likeCounts={likeCounts}
              comments={comments}
              onBookmark={onBookmark}
              onLike={onLike}
              onShare={onShare}
              onAddComment={onAddComment}
              onFollow={onFollow}
              onCardClick={onCardClick}
              cardBg={cardBg}
              textColor={textColor}
              mutedText={mutedText}
              borderColor={borderColor}
            />
          </Box>
        ))}
      </VStack>
    );
    
  return (
    <Box w="full">
      {filteredResources.length > 0 ? (
        displayLayout
      ) : (
        <Box
          p={12}
          textAlign="center"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={borderColor}
          borderRadius="lg"
        >
          <Text color={mutedText}>No resources found matching your filters</Text>
        </Box>
      )}
    </Box>
  );
};

export default ResourceList;
