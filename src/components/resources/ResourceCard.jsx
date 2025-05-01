import React, { memo } from "react";
import {
  Box,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Badge,
  IconButton,
  HStack,
  VStack,
  Avatar,
  Tag,
  TagLabel,
  Flex,
  Heading,
  Tooltip,
  useColorModeValue,
  Skeleton
} from "@chakra-ui/react";
import { FiBookmark, FiHeart, FiShare2, FiMessageCircle, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";
import CommentInput from "./CommentInput";

const MotionCard = motion(Card);

/**
 * Resource card component that displays a single resource
 */
const ResourceCard = memo(({ 
  resource, 
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
    <MotionCard
      bg={cardBg}
      boxShadow="md"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={borderColor}
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.18 }}
      p={0}
      w="full"
      maxW="full"
      onClick={() => onCardClick(resource.id)}
    >
      <CardHeader pb={0} px={{ base: 2, md: 6 }} pt={5} position="relative">
        <Flex align="center" gap={3}>
          <Avatar size="md" src={resource.author.avatar} name={resource.author.name} />
          <Box>
            <Text fontWeight="bold" fontSize="md" color={textColor}>{resource.author.name}</Text>
            <Text fontSize="xs" color={mutedText}>{new Date(resource.dateAdded).toLocaleString()}</Text>
          </Box>
        </Flex>
        <IconButton
          icon={<FiBookmark />}
          aria-label="Bookmark"
          size="sm"
          variant={bookmarked[resource.id] ? "solid" : "ghost"}
          colorScheme={bookmarked[resource.id] ? "blue" : undefined}
          position="absolute"
          top={5}
          right={6}
          onClick={e => { e.stopPropagation(); onBookmark(resource.id, resource.title); }}
          transition="all 0.2s"
        />
      </CardHeader>
      <CardBody pt={3} pb={2} px={{ base: 2, md: 6 }}>
        <Box mb={3} h={{ base: "120px", md: "170px" }} overflow="hidden" borderRadius="md">
          <Skeleton isLoaded={!!resource.imageUrl} borderRadius="md">
            <img 
              src={resource.imageUrl} 
              alt={resource.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              loading="lazy"
            />
          </Skeleton>
        </Box>
        <Heading size="md" mb={1} color={textColor} noOfLines={2}>{resource.title}</Heading>
        <Text fontSize="sm" color={mutedText} noOfLines={2} mb={3}>{resource.description}</Text>
        <HStack spacing={2} mb={2} flexWrap="wrap">
        </HStack>
        <HStack spacing={4} mb={2}>
          <Button
            leftIcon={<FiHeart color={liked[resource.id] ? "#E53E3E" : undefined} />}
            variant={liked[resource.id] ? "solid" : "ghost"}
            colorScheme={liked[resource.id] ? "red" : undefined}
            size="sm"
            onClick={e => { e.stopPropagation(); onLike(resource.id); }}
            transition="all 0.15s"
            _active={{ transform: "scale(1.15)" }}
          >
            {likeCounts[resource.id] || 0}
          </Button>
          <Tooltip label="Download count" hasArrow>
            <HStack spacing={1}>
              <FiDownload />
              <Text fontSize="sm">{resource.downloads}</Text>
            </HStack>
          </Tooltip>
          <Button
            leftIcon={<FiShare2 />}
            variant="ghost"
            size="sm"
            onClick={e => { e.stopPropagation(); onShare(resource.id); }}
          >
            Share
          </Button>
          <Button
            leftIcon={<FiMessageCircle />}
            variant="ghost"
            size="sm"
            onClick={e => e.stopPropagation()}
          >
            {comments[resource.id]?.length || 0}
          </Button>
        </HStack>
        {comments[resource.id]?.length > 0 && (
          <VStack align="stretch" spacing={2} mb={2}>
            {comments[resource.id].slice(0, 2).map(comment => (
              <Box key={comment.id} bg={useColorModeValue("gray.50", "gray.700")} p={2} borderRadius="md">
                <HStack align="center" spacing={2}>
                  <Avatar size="xs" src={comment.user.avatar} name={comment.user.name} />
                  <Text fontWeight="bold" fontSize="sm">{comment.user.name}</Text>
                  <Text fontSize="xs" color={mutedText}>{new Date(comment.date).toLocaleDateString()}</Text>
                </HStack>
                <Text fontSize="sm" mt={1}>{comment.text}</Text>
              </Box>
            ))}
            {comments[resource.id].length > 2 && (
              <Text fontSize="xs" color={mutedText} ml={2} mt={1}>
                +{comments[resource.id].length - 2} more comment(s)
              </Text>
            )}
          </VStack>
        )}
        <CommentInput resourceId={resource.id} onAddComment={onAddComment} />
      </CardBody>
    </MotionCard>
  );
});

export default ResourceCard;
