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
  // Create separate arrays for each media type
  const videos = [];
  const images = [];
  const documents = [];

  // Process videos (prioritized first)
  if (resource.videos && Array.isArray(resource.videos)) {
    videos.push(...resource.videos.map(video => ({
      ...video,
      mediaType: 'video'
    })));
  } else if (resource.media && resource.mediaType === 'video') {
    videos.push({
      id: 'main-video',
      url: resource.media,
      mediaType: 'video'
    });
  }

  // Process images (secondary priority)
  if (resource.images && Array.isArray(resource.images)) {
    images.push(...resource.images.map(img => ({
      ...img,
      mediaType: 'image'
    })));
  } else if (resource.imageUrl || (resource.media && resource.mediaType !== 'video')) {
    images.push({
      id: 'main-image',
      url: resource.imageUrl || resource.media,
      mediaType: 'image'
    });
  }

  // Process documents (lowest priority)
  if (resource.documents && Array.isArray(resource.documents)) {
    documents.push(...resource.documents.map(doc => ({
      ...doc,
      mediaType: 'document'
    })));
  } else if (resource.file) {
    documents.push({
      id: 'main-doc',
      url: resource.file,
      name: resource.fileName || 'Document',
      size: resource.fileSize || 0,
      mediaType: 'document'
    });
  }

  // Return an object with organized arrays by type for easier handling in UI
  return {
    videos,
    images,
    documents,
    // Also provide a combined array for backwards compatibility
    all: [...videos, ...images, ...documents]
  };
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
  const attachmentGroups = useMemo(() => formatAttachmentsForGrid(resource), [resource]);
  
  // Destructure the organized attachments
  const { videos, images, documents, all: attachments } = attachmentGroups;

  // Check if we have mixed content
  const hasMixedContent = useMemo(() => {
    return (videos.length > 0 && (images.length > 0 || documents.length > 0)) || 
           (images.length > 0 && documents.length > 0);
  }, [videos, images, documents]);
  
  // Total count of all attachments
  const totalAttachmentsCount = videos.length + images.length + documents.length;

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
        {totalAttachmentsCount > 0 && (
          <Box
            mb={3}
            borderRadius="md"
            overflow="hidden"
            position="relative"
            w="full"
          >
            {/* Attachment Type Indicators for mixed content */}
            {hasMixedContent && (
              <Flex mb={2} gap={2} align="center">
                {videos.length > 0 && (
                  <Flex align="center" gap={1}>
                    <FiVideo color="red" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {videos.length}
                    </Text>
                  </Flex>
                )}
                {images.length > 0 && (
                  <Flex align="center" gap={1}>
                    <FiImage color="green" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {images.length}
                    </Text>
                  </Flex>
                )}
                {documents.length > 0 && (
                  <Flex align="center" gap={1}>
                    <FiFileText color="blue" size={14} />
                    <Text fontSize="xs" fontWeight="medium">
                      {documents.length}
                    </Text>
                  </Flex>
                )}
              </Flex>
            )}

            {/* Optimized Hierarchical Layout */}
            <VStack spacing={3} align="stretch" w="full">
              {/* Media Content Section (Videos and Images) */}
              {(videos.length > 0 || images.length > 0) && (
                <Skeleton isLoaded={true} w="full">
                  {/* If we only have one media item */}
                  {videos.length + images.length === 1 ? (
                    <Box position="relative" borderRadius="md" overflow="hidden">
                      {videos.length === 1 ? (
                        /* Single Video */
                        <AspectRatio ratio={16 / 9} maxH={{ base: "200px", md: "240px" }}>
                          <Box
                            as="video"
                            src={videos[0].url}
                            controls
                            borderRadius="md"
                            bg="black"
                          />
                        </AspectRatio>
                      ) : (
                        /* Single Image */
                        <AspectRatio ratio={4 / 3} maxH={{ base: "200px", md: "240px" }}>
                          <Image
                            src={images[0].url}
                            alt={resource.title}
                            objectFit="cover"
                            w="100%"
                            borderRadius="md"
                            transition="transform 0.3s ease"
                            _hover={{ transform: "scale(1.03)" }}
                          />
                        </AspectRatio>
                      )}
                    </Box>
                  ) : videos.length + images.length === 2 ? (
                    /* Two media items side by side */
                    <SimpleGrid columns={2} spacing={2}>
                      {/* Display videos first, then images */}
                      {[...videos, ...images].slice(0, 2).map((item, index) => (
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
                          ) : (
                            <AspectRatio ratio={1}>
                              <Image
                                src={item.url}
                                alt={`${resource.title} image ${index}`}
                                objectFit="cover"
                                borderRadius="md"
                              />
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
                  ) : videos.length + images.length > 2 ? (
                    /* More than 2 media items - show 2 with +more */
                    <SimpleGrid columns={2} spacing={2}>
                      {/* First media item */}
                      {(() => {
                        const firstItem = videos.length > 0 ? videos[0] : images[0];
                        return (
                          <Box position="relative" borderRadius="md" overflow="hidden">
                            {firstItem.mediaType === 'video' ? (
                              <AspectRatio ratio={1}>
                                <Box
                                  as="video"
                                  src={firstItem.url}
                                  controls
                                  borderRadius="md"
                                />
                              </AspectRatio>
                            ) : (
                              <AspectRatio ratio={1}>
                                <Image
                                  src={firstItem.url}
                                  alt={`${resource.title} media 1`}
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              </AspectRatio>
                            )}
                            {firstItem.mediaType === 'video' && (
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
                        );
                      })()}

                      {/* Second media item with +more overlay */}
                      {(() => {
                        // Select second item based on priority (videos first, then images)
                        const mediaItems = [...videos, ...images];
                        const secondItem = mediaItems[1];
                        return (
                          <Box position="relative" borderRadius="md" overflow="hidden">
                            {secondItem.mediaType === 'video' ? (
                              <AspectRatio ratio={1}>
                                <Box
                                  as="video"
                                  src={secondItem.url}
                                  controls
                                  borderRadius="md"
                                />
                              </AspectRatio>
                            ) : (
                              <AspectRatio ratio={1}>
                                <Image
                                  src={secondItem.url}
                                  alt={`${resource.title} media 2`}
                                  objectFit="cover"
                                  borderRadius="md"
                                />
                              </AspectRatio>
                            )}

                            {/* Overlay showing remaining count */}
                            {videos.length + images.length > 2 && (
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
                                    +{videos.length + images.length - 2}
                                  </Text>
                                  <Text color="white" fontSize="xs">
                                    more
                                  </Text>
                                </VStack>
                              </Box>
                            )}

                            {secondItem.mediaType === 'video' && videos.length + images.length <= 2 && (
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
                        );
                      })()}
                    </SimpleGrid>
                  ) : null}
                </Skeleton>
              )}

              {/* Documents Section (Displayed below media) */}
              {documents.length > 0 && (
                <Box w="full">
                  {/* If we have media content already, add a small divider */}
                  {(videos.length > 0 || images.length > 0) && (
                    <Divider my={2} borderColor={borderColor} />
                  )}
                  
                  {/* Document Cards */}
                  <VStack spacing={2} align="stretch" w="full">
                    {documents.slice(0, 2).map((doc, index) => (
                      <Flex
                        key={doc.id || `doc-${index}`}
                        p={3}
                        borderRadius="md"
                        bg={useColorModeValue("gray.50", "gray.700")}
                        align="center"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <FiFileText size={20} color={useColorModeValue("blue.500", "blue.300")} />
                        <Box ml={3} flex={1}>
                          <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                            {doc.name || "Document"}
                          </Text>
                          <Text fontSize="xs" color={mutedText}>
                            {formatFileSize(doc.size)}
                          </Text>
                        </Box>
                        <IconButton
                          icon={<FiDownload size={14} />}
                          size="xs"
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="Download"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Download functionality
                          }}
                        />
                      </Flex>
                    ))}
                    
                    {/* Show more documents link if needed */}
                    {documents.length > 2 && (
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        width="full"
                        leftIcon={<FiFileText />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // View all documents functionality
                        }}
                      >
                        +{documents.length - 2} more document{documents.length - 2 > 1 ? 's' : ''}
                      </Button>
                    )}
                  </VStack>
                </Box>
              )}
            </VStack>
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
