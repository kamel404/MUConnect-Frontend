import React, { memo, useState, useMemo } from "react";
import {
  Box,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  IconButton,
  HStack,
  VStack,
  Avatar,
  AvatarGroup,
  Tag,
  TagLabel,
  Flex,
  Heading,
  Tooltip,
  useColorModeValue,
  Skeleton,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Collapse,
  AspectRatio,
  Image,
  SimpleGrid,
  Grid,
  GridItem
} from "@chakra-ui/react";
import {
  FiBookmark,
  FiHeart,
  FiShare2,
  FiMessageCircle,
  FiDownload,
  FiMoreHorizontal,
  FiEye,
  FiTrendingUp,
  FiUserPlus,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
  FiLink,
  FiDelete,
  FiTrash,
  FiFileText,
  FiEdit3,
  FiVideo,
  FiImage
} from "react-icons/fi";
import { motion } from "framer-motion";
import CommentInput from "./CommentInput";

const MotionCard = motion(Card);

/**
 * Resource card component that displays a single resource with social media elements
 */
// Helper function to organize and format attachments for the grid layout
const formatAttachmentsForGrid = (resource) => {
  const items = [];

  // Process images
  if (resource.images && Array.isArray(resource.images)) {
    items.push(...resource.images.map(img => ({
      ...img,
      mediaType: 'image'
    })));
  } else if (resource.imageUrl || resource.media) {
    items.push({
      id: 'main-image',
      url: resource.imageUrl || resource.media,
      mediaType: 'image'
    });
  }

  // Process videos
  if (resource.videos && Array.isArray(resource.videos)) {
    items.push(...resource.videos.map(video => ({
      ...video,
      mediaType: 'video'
    })));
  } else if (resource.media && resource.mediaType === 'video') {
    items.push({
      id: 'main-video',
      url: resource.media,
      mediaType: 'video'
    });
  }

  // Process documents
  if (resource.documents && Array.isArray(resource.documents)) {
    items.push(...resource.documents.map(doc => ({
      ...doc,
      mediaType: 'document'
    })));
  } else if (resource.file) {
    items.push({
      id: 'main-doc',
      url: resource.file,
      name: resource.fileName || 'Document',
      size: resource.fileSize || 0,
      mediaType: 'document'
    });
  }

  return items;
};

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
  // Local state for additional social interactions
  const [showAllComments, setShowAllComments] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  // Social metrics
  const engagementScore = ((likeCounts[resource.id] || 0) + (comments[resource.id]?.length || 0) * 2) / 10;
  const recentEngagements = resource.recentEngagements || [
    { id: 1, avatar: "https://i.pravatar.cc/150?img=45" },
    { id: 2, avatar: "https://i.pravatar.cc/150?img=26" },
    { id: 3, avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 4, avatar: "https://i.pravatar.cc/150?img=19" },
  ];

  // Format attachments for the grid layout
  const attachments = useMemo(() => formatAttachmentsForGrid(resource), [resource]);

  // Check if we have mixed content
  const hasMixedContent = useMemo(() => {
    const types = new Set(attachments.map(item => item.mediaType));
    return types.size > 1;
  }, [attachments]);

  // Format file size for documents
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <MotionCard
      bg={cardBg}
      boxShadow="md"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={borderColor}
      whileHover={{ y: -3, boxShadow: "0 12px 20px rgba(0,0,0,0.15)" }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      p={0}
      w="full"
      maxW="full"
      overflow="hidden"
      _hover={{ cursor: "pointer" }}
      position="relative"
    >
      <CardHeader pb={0} px={{ base: 3, md: 6 }} pt={5} position="relative" onClick={() => onCardClick(resource.id)}>
        <Flex align="center" gap={3} justify="space-between">
          <Flex align="center" gap={3}>
            {/* Support both author and creator properties */}
            <Avatar
              size="md"
              src={(resource.author?.avatar || resource.creator?.avatar)}
              name={(resource.author?.name || resource.creator?.name)}
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
              cursor="pointer"
              onClick={e => { e.stopPropagation(); /* Author profile navigation */ }}
            />
            <Box>
              <Flex align="center" gap={2}>
                <Text fontWeight="bold" fontSize="md" color={textColor}>
                  {resource.author?.name || resource.creator?.name}
                </Text>
                {(resource.author?.verified || resource.creator?.verified) && (
                  <Tooltip label="Verified Contributor" placement="top">
                    <Box boxSize={3.5} bg="blue.400" borderRadius="full" />
                  </Tooltip>
                )}
              </Flex>
            </Box>
          </Flex>
          <Flex>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                size="sm"
                onClick={e => e.stopPropagation()}
              />
              <MenuList onClick={e => e.stopPropagation()}>
                <MenuItem icon={<FiEdit3 />}>Edit</MenuItem>
                <MenuItem icon={<FiTrash />}>Delete</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody pt={2} pb={1} px={{ base: 3, md: 4 }} onClick={() => onCardClick(resource.id)}>
        {/* Text content - shown first for text-only posts, or before media */}
        <Heading size="md" mb={1} color={textColor} noOfLines={2}>{resource.title}</Heading>
        <Text fontSize="xl" color={mutedText} mb={2}>
          {(resource.imageUrl || resource.media || resource.file ||
            (resource.images && resource.images.length > 0) ||
            (resource.documents && resource.documents.length > 0)) ?
            <Box noOfLines={1}>{resource.description}</Box> :
            resource.description
          }
        </Text>

        {/* Resource Type Tags */}
        <HStack spacing={1} mb={2} flexWrap="wrap">
          {resource.type && (
            <Badge
              colorScheme={
                resource.type === "Video" || (resource.type === "Media" && resource.mediaType === "video") ? "red" :
                  resource.type === "PDF" || resource.type === "Course Material" ? "blue" :
                    "green"
              }
              fontSize="2xs"
              variant="subtle"
            >
              {resource.type}
            </Badge>
          )}
        </HStack>

        {/* Social Media Style Grid for attachments */}
        {attachments.length > 0 && (
          <Box
            mb={3}
            borderRadius="md"
            overflow="hidden"
            position="relative"
            w="full"
          >
            {hasMixedContent && (
              <Flex mb={2} gap={2} align="center">
                {attachments.some(a => a.mediaType === 'image') && (
                  <Flex align="center" gap={1}>
                    <FiImage color="green" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {attachments.filter(a => a.mediaType === 'image').length}
                    </Text>
                  </Flex>
                )}
                {attachments.some(a => a.mediaType === 'video') && (
                  <Flex align="center" gap={1}>
                    <FiVideo color="red" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {attachments.filter(a => a.mediaType === 'video').length}
                    </Text>
                  </Flex>
                )}
                {attachments.some(a => a.mediaType === 'document') && (
                  <Flex align="center" gap={1}>
                    <FiFileText color="blue" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {attachments.filter(a => a.mediaType === 'document').length}
                    </Text>
                  </Flex>
                )}
              </Flex>
            )}

            {/* Grid Layout */}
            <Skeleton isLoaded={!!attachments.length} w="full">
              {attachments.length === 1 ? (
                // Single item display
                <Box position="relative" borderRadius="md" overflow="hidden">
                  {attachments[0].mediaType === 'video' ? (
                    <AspectRatio ratio={16 / 9} maxH={{ base: "200px", md: "240px" }}>
                      <Box
                        as="video"
                        src={attachments[0].url}
                        controls
                        borderRadius="md"
                        bg="black"
                      />
                    </AspectRatio>
                  ) : attachments[0].mediaType === 'image' ? (
                    <AspectRatio ratio={4 / 3} maxH={{ base: "200px", md: "240px" }}>
                      <Image
                        src={attachments[0].url}
                        alt={resource.title}
                        objectFit="cover"
                        w="100%"
                        borderRadius="md"
                        transition="transform 0.3s ease"
                        _hover={{ transform: "scale(1.03)" }}
                      />
                    </AspectRatio>
                  ) : (
                    <Flex
                      p={4}
                      borderRadius="md"
                      bg={useColorModeValue("gray.50", "gray.700")}
                      align="center"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <FiFileText size={20} color={useColorModeValue("blue.500", "blue.300")} />
                      <Box ml={3}>
                        <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                          {attachments[0].name || "Document"}
                        </Text>
                        <Text fontSize="xs" color={mutedText}>
                          {formatFileSize(attachments[0].size)}
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Box>
              ) : attachments.length === 2 ? (
                // Two items grid
                <SimpleGrid columns={2} spacing={2}>
                  {attachments.map((item, index) => (
                    <Box key={item.id || index} position="relative" borderRadius="md" overflow="hidden">
                      {item.mediaType === 'video' ? (
                        <AspectRatio ratio={1}>
                          <Box
                            as="video"
                            src={item.url}
                            controls
                            borderRadius="md"
                          />
                        </AspectRatio>
                      ) : item.mediaType === 'image' ? (
                        <AspectRatio ratio={1}>
                          <Image
                            src={item.url}
                            alt={`${resource.title} image ${index}`}
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </AspectRatio>
                      ) : (
                        <AspectRatio ratio={1}>
                          <Flex
                            direction="column"
                            p={3}
                            bg={useColorModeValue("gray.50", "gray.700")}
                            align="center"
                            justify="center"
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <FiFileText size={24} color={useColorModeValue("blue.500", "blue.300")} mb={2} />
                            <Text fontSize="xs" fontWeight="medium" noOfLines={1} textAlign="center">
                              {item.name}
                            </Text>
                            <Text fontSize="xs" color={mutedText}>
                              {formatFileSize(item.size)}
                            </Text>
                          </Flex>
                        </AspectRatio>
                      )}
                      {item.mediaType === 'video' && (
                        <Box
                          position="absolute"
                          bottom={1}
                          right={1}
                          bg="blackAlpha.600"
                          color="white"
                          p={1}
                          borderRadius="full"
                        >
                          <FiVideo size={12} />
                        </Box>
                      )}
                    </Box>
                  ))}
                </SimpleGrid>
              ) : attachments.length > 2 ? (
                // More than 2 attachments - Show only 2 with +more indicator
                <SimpleGrid columns={2} spacing={2}>
                  {/* First attachment */}
                  <Box position="relative" borderRadius="md" overflow="hidden">
                    {attachments[0].mediaType === 'video' ? (
                      <AspectRatio ratio={1}>
                        <Box
                          as="video"
                          src={attachments[0].url}
                          controls
                          borderRadius="md"
                        />
                      </AspectRatio>
                    ) : attachments[0].mediaType === 'image' ? (
                      <AspectRatio ratio={1}>
                        <Image
                          src={attachments[0].url}
                          alt={`${resource.title} image 1`}
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </AspectRatio>
                    ) : (
                      <AspectRatio ratio={1}>
                        <Flex
                          direction="column"
                          p={3}
                          bg={useColorModeValue("gray.50", "gray.700")}
                          align="center"
                          justify="center"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <FiFileText size={20} color={useColorModeValue("blue.500", "blue.300")} mb={2} />
                          <Text fontSize="xs" fontWeight="medium" noOfLines={1} textAlign="center">
                            {attachments[0].name}
                          </Text>
                          <Text fontSize="xs" color={mutedText}>
                            {formatFileSize(attachments[0].size)}
                          </Text>
                        </Flex>
                      </AspectRatio>
                    )}
                    {attachments[0].mediaType === 'video' && (
                      <Box
                        position="absolute"
                        bottom={1}
                        right={1}
                        bg="blackAlpha.600"
                        color="white"
                        p={1}
                        borderRadius="full"
                      >
                        <FiVideo size={12} />
                      </Box>
                    )}
                  </Box>

                  {/* Second attachment with overlay for more if needed */}
                  <Box position="relative" borderRadius="md" overflow="hidden">
                    {attachments[1].mediaType === 'video' ? (
                      <AspectRatio ratio={1}>
                        <Box
                          as="video"
                          src={attachments[1].url}
                          controls
                          borderRadius="md"
                        />
                      </AspectRatio>
                    ) : attachments[1].mediaType === 'image' ? (
                      <AspectRatio ratio={1}>
                        <Image
                          src={attachments[1].url}
                          alt={`${resource.title} image 2`}
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </AspectRatio>
                    ) : (
                      <AspectRatio ratio={1}>
                        <Flex
                          direction="column"
                          p={3}
                          bg={useColorModeValue("gray.50", "gray.700")}
                          align="center"
                          justify="center"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <FiFileText size={20} color={useColorModeValue("blue.500", "blue.300")} mb={2} />
                          <Text fontSize="xs" fontWeight="medium" noOfLines={1} textAlign="center">
                            {attachments[1].name}
                          </Text>
                          <Text fontSize="xs" color={mutedText}>
                            {formatFileSize(attachments[1].size)}
                          </Text>
                        </Flex>
                      </AspectRatio>
                    )}

                    {/* Show overlay with remaining count if more than 2 attachments */}
                    {attachments.length > 2 && (
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="blackAlpha.700"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Future functionality to view all attachments
                        }}
                        _hover={{ bg: "blackAlpha.800", cursor: "pointer" }}
                        transition="background 0.2s"
                      >
                        <VStack spacing={0}>
                          <Text color="white" fontSize="lg" fontWeight="bold">
                            +{attachments.length - 2}
                          </Text>
                          <Text color="white" fontSize="xs">
                            more
                          </Text>
                        </VStack>
                      </Box>
                    )}

                    {attachments[1].mediaType === 'video' && attachments.length <= 2 && (
                      <Box
                        position="absolute"
                        bottom={1}
                        right={1}
                        bg="blackAlpha.600"
                        color="white"
                        p={1}
                        borderRadius="full"
                      >
                        <FiVideo size={12} />
                      </Box>
                    )}
                  </Box>
                </SimpleGrid>
              ) : null}
            </Skeleton>
          </Box>
        )}



        {/* Social Engagement Metrics */}
        <Flex justify="space-between" align="center" mb={3}>
          <HStack spacing={4}>
            <Tooltip label="Likes" hasArrow>
              <Flex align="center" gap={1.5}>
                <FiHeart color={liked[resource.id] ? "#E53E3E" : undefined} size={16} />
                <Text fontSize="sm" fontWeight="medium">{likeCounts[resource.id] || 0}</Text>
              </Flex>
            </Tooltip>
            <Tooltip label="Comments" hasArrow>
              <Flex align="center" gap={1.5}>
                <FiMessageCircle size={16} />
                <Text fontSize="sm" fontWeight="medium">{comments[resource.id]?.length || 0}</Text>
              </Flex>
            </Tooltip>
          </HStack>
        </Flex>

        <Divider mb={3} />

        {/* Interaction Buttons */}
        <HStack spacing={3} mb={3}>
          <Button
            leftIcon={<FiHeart color={liked[resource.id] ? "#E53E3E" : undefined} />}
            variant={liked[resource.id] ? "solid" : "outline"}
            colorScheme={liked[resource.id] ? "red" : "gray"}
            size="sm"
            width="1fr"
            flex="1"
            onClick={e => { e.stopPropagation(); onLike(resource.id); }}
            transition="all 0.15s"
            _active={{ transform: "scale(1.05)" }}
          >
            {liked[resource.id] ? "Liked" : "Like"}
          </Button>

          <Button
            leftIcon={<FiShare2 />}
            variant="outline"
            colorScheme="gray"
            size="sm"
            width="1fr"
            flex="1"
            onClick={e => { e.stopPropagation(); onShare(resource.id); }}
          >
            Share
          </Button>

          <IconButton
            icon={<FiBookmark />}
            aria-label="Bookmark"
            size="sm"
            variant={bookmarked[resource.id] ? "solid" : "outline"}
            colorScheme={bookmarked[resource.id] ? "blue" : "gray"}
            onClick={e => { e.stopPropagation(); onBookmark(resource.id, resource.title); }}
          />
        </HStack>

        {/* Expandable Comments Section */}
        <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
          <Box
            py={2}
            onClick={e => e.stopPropagation()}
            borderTopWidth="1px"
            borderColor={borderColor}
          >
            {comments[resource.id]?.length > 0 ? (
              <VStack align="stretch" spacing={3} mb={3}>
                {comments[resource.id].slice(0, showAllComments ? undefined : 2).map(comment => (
                  <Box key={comment.id} bg={useColorModeValue("gray.50", "gray.700")} p={3} borderRadius="md">
                    <HStack align="center" spacing={2} mb={1}>
                      <Avatar size="xs" src={comment.user.avatar} name={comment.user.name} />
                      <Text fontWeight="bold" fontSize="sm">{comment.user.name}</Text>
                      <Text fontSize="xs" color={mutedText}>{new Date(comment.date).toLocaleDateString()}</Text>
                    </HStack>
                    <Text fontSize="sm">{comment.text}</Text>
                  </Box>
                ))}

                {comments[resource.id].length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={showAllComments ? <FiChevronUp /> : <FiChevronDown />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllComments(!showAllComments);
                    }}
                  >
                    {showAllComments ? "Show Less" : `View ${comments[resource.id].length - 2} more comments`}
                  </Button>
                )}
              </VStack>
            ) : (
              <Text fontSize="sm" color={mutedText} mb={2}>Be the first to comment</Text>
            )}

            <CommentInput resourceId={resource.id} onAddComment={onAddComment} />
          </Box>
        </Collapse>
      </CardBody>
    </MotionCard>
  );
});

export default ResourceCard;
