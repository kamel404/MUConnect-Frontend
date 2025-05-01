import React from "react";
import { VStack, Box, Text, SimpleGrid, Center, Spinner } from "@chakra-ui/react";
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
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text ml={4} color={mutedText}>Loading resources...</Text>
      </Center>
    );
  }
  
  const displayLayout = feedType === 'grid' 
    ? (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
        {filteredResources.map(resource => (
          <ResourceCard
            key={resource.id}
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
        ))}
      </SimpleGrid>
    ) : (
      <VStack spacing={6} align="stretch" w="full">
        {filteredResources.map(resource => (
          <ResourceCard
            key={resource.id}
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
