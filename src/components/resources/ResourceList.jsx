import React from "react";
import { VStack, Box, Text } from "@chakra-ui/react";
import ResourceCard from "./ResourceCard";

/**
 * Component for displaying a list of filtered resources
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
  onCardClick,
  cardBg,
  textColor,
  mutedText,
  borderColor
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {filteredResources.length > 0 ? (
        filteredResources.map(resource => (
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
            onCardClick={onCardClick}
            cardBg={cardBg}
            textColor={textColor}
            mutedText={mutedText}
            borderColor={borderColor}
          />
        ))
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
    </VStack>
  );
};

export default ResourceList;
