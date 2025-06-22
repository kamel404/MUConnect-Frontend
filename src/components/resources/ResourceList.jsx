import React, { memo, } from "react";
import { VStack, Box, Text, SimpleGrid, Center, Spinner, Fade, Skeleton, HStack, useColorModeValue } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import ResourceCard from "./ResourceCard";

/**
 * Component for displaying a list of filtered resources in a social media feed format
 */
const ResourceList = ({
  resources,
  onBookmark,
  onUpvote,
  currentUser,
  onShare,
  onAddComment,
  onFollow,
  onCardClick,
  onEdit,
  onDelete,
  cardBg,
  textColor,
  mutedText,
  borderColor,
  isLoading,
  feedType
}) => {
  if (isLoading) {
    // Show skeleton loaders with more modern design
    return (
      <VStack spacing={6} align="stretch" w="full">
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: i * 0.1 }
            }}
            bg={useColorModeValue("rgba(255, 255, 255, 0.7)", "rgba(45, 55, 72, 0.7)")}
            backdropFilter="blur(10px)"
            borderRadius="24px"
            borderWidth="1px"
            borderColor={useColorModeValue("brand.navy", "rgba(74, 85, 104, 0.3)")}
            p={6}
            w="full"
            overflow="hidden"
            boxShadow="0 10px 30px -15px rgba(0, 0, 0, 0.1)"
          >
            <HStack mb={4}>
              <Skeleton height="40px" width="40px" borderRadius="full" />
              <VStack align="start" spacing={2} flex={1}>
                <Skeleton height="10px" width="120px" />
                <Skeleton height="8px" width="80px" />
              </VStack>
            </HStack>
            <Skeleton height="16px" width="70%" mb={4} />
            <Skeleton height="12px" width="90%" mb={2} />
            <Skeleton height="12px" width="60%" mb={4} />
            <Skeleton height="200px" width="100%" borderRadius="xl" mb={4} />
            <HStack spacing={4} justify="space-between">
              <HStack>
                <Skeleton height="30px" width="30px" borderRadius="full" />
                <Skeleton height="30px" width="30px" borderRadius="full" />
                <Skeleton height="30px" width="30px" borderRadius="full" />
              </HStack>
              <Skeleton height="10px" width="60px" />
            </HStack>
          </Box>
        ))}
      </VStack>
    );
  }
  
  // Create enhanced staggered animation for resource cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.5
      }
    }
  };
  
  const displayLayout = feedType === 'grid' 
    ? (
      <Box 
        w="full" 
        position="relative"
        as={motion.div} 
        variants={container}
        initial="hidden" 
        animate="show"
      >
        <SimpleGrid 
          columns={{ base: 1, sm: 2, lg: 3 }} 
          spacing="20px"
        >
          {resources && resources.map((resource, index) => (
            <Box 
              as={motion.div} 
              key={resource.id} 
              variants={item}
              gridRow={index % 5 === 0 ? "span 2" : "span 1"}
              gridColumn={index % 7 === 0 ? "span 2" : "span 1"}
              zIndex={100 - index}
              transformOrigin="center"
            >
              <ResourceCard
                resource={resource}
                onBookmark={onBookmark}
                onUpvote={onUpvote}
                currentUser={currentUser}
                onCardClick={onCardClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onShare={onShare}
                onAddComment={onAddComment}
                onFollow={onFollow}
                cardBg={cardBg}
                textColor={textColor}
                mutedText={mutedText}
                borderColor={borderColor}
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    ) : (
      <VStack 
        spacing={8} 
        align="stretch" 
        w="full" 
        as={motion.div} 
        variants={container} 
        initial="hidden" 
        animate="show"
      >
        {resources && resources.map((resource, index) => (
          <Box 
            as={motion.div} 
            key={resource.id} 
            variants={item}
            transformOrigin="center"
          >
            <ResourceCard
              resource={resource}
              onBookmark={onBookmark}
              onUpvote={onUpvote}
              currentUser={currentUser}
              onCardClick={onCardClick}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddComment={onAddComment}
              onFollow={onFollow}
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
      {isLoading ? (
        // Already showing loading skeleton in the component
        <Box></Box>
      ) : resources && resources.length > 0 ? (
        displayLayout
      ) : (
        <Box
          p={12}
          textAlign="center"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor={useColorModeValue("rgba(226, 232, 240, 0.8)", "rgba(74, 85, 104, 0.3)")}
          borderRadius="2xl"
          bg={useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(45, 55, 72, 0.6)")}
          backdropFilter="blur(8px)"
          boxShadow="0px 4px 16px rgba(0, 0, 0, 0.05)"
          as={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4}>
            <Box 
              p={4} 
              borderRadius="full" 
              bg={useColorModeValue("gray.50", "gray.700")}
              boxShadow="inner"
            >
              <FiSearch size={30} color={useColorModeValue("#A0AEC0", "#718096")} />
            </Box>
            <Text color={mutedText} fontSize="lg">No resources found matching your filters</Text>
            <Text color={mutedText} fontSize="sm">Try adjusting your search or filters</Text>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default ResourceList;
