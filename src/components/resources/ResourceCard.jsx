import React, { memo, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  GridItem,
  Circle,
  Center,
  Wrap,
  WrapItem,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Icon,
  useToken
} from "@chakra-ui/react";
import { socialIcons } from "../../assets/socialIcons";
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
  FiExternalLink,
  FiDelete,
  FiTrash,
  FiFileText,
  FiEdit3,
  FiVideo,
  FiImage,
  FiPlay,
  FiStar,
  FiClock,
  FiFile,
  FiBookOpen,
  FiBarChart2
} from "react-icons/fi";
import { motion } from "framer-motion";
import CommentInput from "./CommentInput";

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionImage = motion(Image);
const MotionBadge = motion(Badge);
const MotionAvatar = motion(Avatar);

const formatAttachmentsForGrid = (resource) => {
  const videos = [];
  const images = [];
  const documents = [];
  const links = [];
  const polls = [];

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

  if (resource.links && Array.isArray(resource.links)) {
    links.push(...resource.links.map(link => ({
      ...link,
      mediaType: 'link'
    })));
  }

  if (resource.polls && Array.isArray(resource.polls)) {
    polls.push(...resource.polls.map(poll => ({
      ...poll,
      mediaType: 'poll'
    })));
  } else if (resource.hasPoll) {
    polls.push({
      id: 'main-poll',
      question: resource.pollQuestion || 'Poll',
      options: resource.pollOptions || [],
      mediaType: 'poll'
    });
  }

  return {
    videos,
    images,
    documents,
    links,
    polls,
    all: [...videos, ...images, ...documents, ...links, ...polls]
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
  const toast = useToast();
  const [votedPolls, setVotedPolls] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const navigate = useNavigate();
  const [showAllComments, setShowAllComments] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const { videos, images, documents, links, polls, all } = useMemo(() => {
    return formatAttachmentsForGrid(resource);
  }, [resource]);

  // Calculate total attachments for display
  const totalAttachmentsCount = videos.length + images.length + documents.length + links.length + polls.length;
  
  // For debugging
  console.log('Attachment counts:', {
    videos: videos.length,
    images: images.length,
    documents: documents.length,
    links: links.length, 
    polls: polls.length,
    total: totalAttachmentsCount
  });

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const resourceTypeData = useMemo(() => {
    const type = (resource.type || '').toLowerCase();
    if (type.includes('poll') || polls.length > 0) {
      return { icon: FiBarChart2, color: 'teal.500', scheme: 'teal' };
    } else if (type.includes('video') || (resource.mediaType === 'video')) {
      return { icon: FiVideo, color: 'red.500', scheme: 'red' };
    } else if (type.includes('pdf') || type.includes('document')) {
      return { icon: FiFileText, color: 'blue.500', scheme: 'blue' };
    } else if (type.includes('course')) {
      return { icon: FiBookOpen, color: 'purple.500', scheme: 'purple' };
    } else if (type.includes('image')) {
      return { icon: FiImage, color: 'green.500', scheme: 'green' };
    } else if (type.includes('link') || links.length > 0) {
      return { icon: FiLink, color: 'purple.500', scheme: 'purple' };
    } else {
      return { icon: FiFile, color: 'gray.500', scheme: 'gray' };
    }
  }, [resource.type, resource.mediaType, polls.length, links.length]);

  const timeAgo = (date) => {
    if (!date) return "Just now";
    
    const now = new Date();
    const postDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(postDate.getTime())) return "Just now";
    
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Format time for display
    const timeStr = postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Less than a minute
    if (diffInSeconds < 60) return "Just now";
    
    // Less than an hour
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    
    // Less than a day
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    
    // Yesterday
    if (diffInDays === 1) return `Yesterday at ${timeStr}`;
    
    // Less than a week
    if (diffInDays < 7) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[postDate.getDay()]} at ${timeStr}`;
    }
    
    // This year
    const currentYear = now.getFullYear();
    const postYear = postDate.getFullYear();
    if (currentYear === postYear) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[postDate.getMonth()]} ${postDate.getDate()} at ${timeStr}`;
    }
    
    // Older
    return `${postDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} at ${timeStr}`;
  };

  return (
    <MotionCard
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="2xl"
      borderWidth="1px"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      overflow="hidden"
      width="100%"
      boxShadow="sm"
      _hover={{
        boxShadow: "md",
        borderColor: useColorModeValue("gray.300", "gray.600")
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Social Media Style */}
      <CardHeader p={4} pb={0}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Avatar 
              size="md" 
              src={resource.author?.avatar || "https://i.pravatar.cc/150?img=1"} 
              name={resource.author?.name || "Anonymous"}
            />
            <Box>
              <Flex align="center" gap={2} mb={1}>
                <Text fontWeight="bold" fontSize="md">
                  {resource.author?.name || "Anonymous"}
                </Text>
                {resource.author?.verified && (
                  <Circle size="16px" bg="blue.500" color="white">
                    <FiCheck size="10px" />
                  </Circle>
                )}
                <Badge 
                  colorScheme={resourceTypeData.scheme} 
                  variant="subtle" 
                  fontSize="xs"
                  borderRadius="full"
                >
                  {resource.type || "Resource"}
                </Badge>
              </Flex>
              <Flex align="center" gap={2} fontSize="sm" color={mutedText}>
                <Text>{timeAgo(resource.dateAdded)}</Text>
                {resource.subject && (
                  <>
                    <Text>•</Text>
                    <Text>{resource.subject}</Text>
                  </>
                )}
                {resource.level && (
                  <>
                    <Text>•</Text>
                    <Text>{resource.level}</Text>
                  </>
                )}
              </Flex>
            </Box>
          </Flex>
          
          <Menu placement="bottom-end" onClick={(e) => e.stopPropagation()}>
            <MenuButton
              as={IconButton}
              icon={<FiMoreHorizontal />}
              variant="ghost"
              size="sm"
              borderRadius="full"
            />
            <MenuList shadow="lg" borderRadius="xl">
              <MenuItem icon={<FiBookmark />}>
                {bookmarked[resource.id] ? "Remove bookmark" : "Save post"}
              </MenuItem>
              <MenuItem icon={<FiShare2 />}>Share post</MenuItem>
              <MenuItem icon={<FiDownload />}>Download</MenuItem>
              <MenuItem icon={<FiFileText />}>View details</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>

      {/* Content */}
      <CardBody p={4} pt={3}>
        {/* Post Text */}
        <Box 
          mb={3}
          lineHeight="1.5"
        >
          <Heading 
            as="h3" 
            fontSize="lg" 
            fontWeight="semibold" 
            mb={2}
            color={useColorModeValue("blue.700", "blue.300")}
            cursor="pointer"
            onClick={() => onCardClick(resource.id)}
            _hover={{ textDecoration: "underline" }}
          >
            {resource.title}
          </Heading>
          <Text 
            fontSize="md" 
            cursor="pointer"
            onClick={() => onCardClick(resource.id)}
          >
            {resource.description}
          </Text>
        </Box>

        {/* Tags */}
        {(resource.subject || resource.category || resource.level) && (
          <Flex wrap="wrap" gap={1.5} mb={3}>
            {resource.subject && (
              <Tag size="sm" colorScheme="blue" variant="subtle" borderRadius="full">
                #{resource.subject.toLowerCase().replace(' ', '')}
              </Tag>
            )}
            {resource.category && (
              <Tag size="sm" colorScheme="green" variant="subtle" borderRadius="full">
                #{resource.category.toLowerCase().replace(' ', '')}
              </Tag>
            )}
            {resource.level && (
              <Tag size="sm" colorScheme="purple" variant="subtle" borderRadius="full">
                #{resource.level.toLowerCase()}
              </Tag>
            )}
          </Flex>
        )}

        {/* Media Content */}
        {totalAttachmentsCount > 0 && (
          <Box mb={4} borderRadius="xl" overflow="hidden">
            {/* Images/Videos */}
            {(videos.length > 0 || images.length > 0) && (
              <Box mb={3}>
                {videos.length + images.length === 1 ? (
                  <AspectRatio ratio={16/9} maxH="400px">
                    {videos.length === 1 ? (
                      <Box
                        as="video"
                        src={videos[0].url}
                        controls
                        borderRadius="xl"
                        bg="black"
                      />
                    ) : (
                      <Image
                        src={images[0].url}
                        alt={resource.title}
                        objectFit="cover"
                        borderRadius="xl"
                        cursor="pointer"
                        onClick={() => onCardClick(resource.id)}
                      />
                    )}
                  </AspectRatio>
                ) : videos.length + images.length === 2 ? (
                  <SimpleGrid columns={2} spacing={2}>
                    {[...videos, ...images].slice(0, 2).map((item, index) => (
                      <AspectRatio key={item.id || index} ratio={1}>
                        {item.mediaType === 'video' ? (
                          <Box
                            as="video"
                            src={item.url}
                            controls
                            borderRadius="lg"
                            bg="black"
                          />
                        ) : (
                          <Image
                            src={item.url}
                            alt={`Media ${index + 1}`}
                            objectFit="cover"
                            borderRadius="lg"
                            cursor="pointer"
                            onClick={() => onCardClick(resource.id)}
                          />
                        )}
                      </AspectRatio>
                    ))}
                  </SimpleGrid>
                ) : (
                  // Display for 3 or more media items
                  <Grid
                    templateColumns="2fr 1fr"
                    templateRows="1fr 1fr"
                    gap={2}
                    h="300px"
                  >
                    <GridItem rowSpan={2}>
                      <Box h="100%" position="relative" borderRadius="lg" overflow="hidden">
                        {[...videos, ...images][0].mediaType === 'video' ? (
                          <Box
                            as="video"
                            src={[...videos, ...images][0].url}
                            controls
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                        ) : (
                          <Image
                            src={[...videos, ...images][0].url}
                            alt="Main media"
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => onCardClick(resource.id)}
                          />
                        )}
                      </Box>
                    </GridItem>
                    {[...videos, ...images].slice(1, 3).map((item, index) => (
                      <GridItem key={item.id || `grid-${index}`}>
                        <Box h="100%" position="relative" borderRadius="lg" overflow="hidden">
                          {item.mediaType === 'video' ? (
                            <Box
                              as="video"
                              src={item.url}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          ) : (
                            <Image
                              src={item.url}
                              alt={`Media ${index + 2}`}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              cursor="pointer"
                              onClick={() => onCardClick(resource.id)}
                            />
                          )}
                          {/* Always show overlay on the last visible thumbnail when there are more attachments */}
                          <Flex
                            position="absolute"
                            top="0"
                            left="0"
                            w="100%"
                            h="100%"
                            align="center"
                            justify="center"
                            bg="blackAlpha.800"
                            color="white"
                            fontSize="lg"
                            fontWeight="bold"
                            borderRadius="lg"
                            backdropFilter="blur(2px)"
                            boxShadow="inset 0 0 0 1px rgba(255,255,255,0.3)"
                            transition="all 0.2s"
                            _hover={{
                              bg: "blackAlpha.900",
                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)"
                            }}
                            cursor="pointer"
                            onClick={() => onCardClick(resource.id)}
                          >
                            {videos.length + images.length > 3 ? 
                              `+${videos.length + images.length - 3} more` : 
                              `+${totalAttachmentsCount - (videos.length + images.length) + 1} more`}
                          </Flex>
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <VStack spacing={2} mb={3} align="stretch">
                {documents.slice(0, 2).map((doc, index) => (
                  <Flex
                    key={doc.id || `doc-${index}`}
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="lg"
                    align="center"
                    cursor="pointer"
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                  >
                    <Circle size="40px" bg="blue.100" color="blue.600" mr={3}>
                      <FiFileText size={20} />
                    </Circle>
                    <Box flex="1">
                      <Text fontWeight="medium" fontSize="sm">
                        {doc.name || `Document ${index + 1}`}
                      </Text>
                      <Text fontSize="xs" color={mutedText}>
                        {formatFileSize(doc.size)}
                      </Text>
                    </Box>
                    <IconButton
                      icon={<FiDownload />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </Flex>
                ))}
                {documents.length > 2 && (
                  <Text fontSize="sm" color={mutedText} textAlign="center">
                    +{documents.length - 2} more
                  </Text>
                )}
              </VStack>
            )}

            {/* Links */}
            {links.length > 0 && (
              <VStack spacing={2} mb={3} align="stretch">
                {links.slice(0, 2).map((link, index) => (
                  <Flex
                    key={link.id || `link-${index}`}
                    p={3}
                    bg={useColorModeValue("gray.50", "gray.700")}
                    borderRadius="lg"
                    align="center"
                    cursor="pointer"
                    onClick={() => window.open(link.url, "_blank")}
                    _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                  >
                    <Circle size="40px" bg="purple.100" color="purple.600" mr={3}>
                      <FiExternalLink size={20} />
                    </Circle>
                    <Box flex="1">
                      <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                        {link.title || "External Link"}
                      </Text>
                      <Text fontSize="xs" color={mutedText} noOfLines={1}>
                        {link.url}
                      </Text>
                    </Box>
                    <IconButton
                      icon={<FiExternalLink />}
                      size="sm"
                      variant="ghost"
                      colorScheme="purple"
                    />
                  </Flex>
                ))}
              </VStack>
            )}

            {/* Polls */}
            {polls.length > 0 && (
              <Box>
                {polls.slice(0, 1).map((poll, index) => {
                  const pollId = poll.id || `poll-${index}`;
                  const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
                  const hasVoted = votedPolls[pollId];
                  const selectedOption = userVotes[pollId];
                  
                  const handleVote = useCallback((optionId) => {
                    setUserVotes(prev => ({
                      ...prev,
                      [pollId]: optionId
                    }));
                    
                    if (!hasVoted) {
                      setVotedPolls(prev => ({
                        ...prev,
                        [pollId]: true
                      }));
                      
                      toast({
                        title: "Vote recorded",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                      });
                    }
                  }, [pollId, hasVoted, toast]);
                  
                  return (
                    <Box
                      key={pollId}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      p={4}
                      borderRadius="xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Text fontWeight="semibold" mb={3}>
                        {poll.question}
                      </Text>
                      <VStack spacing={2} align="stretch">
                        {poll.options?.map((option, optIndex) => {
                          const optionId = option.id || `option-${optIndex}`;
                          const isSelected = selectedOption === optionId;
                          const optionVotes = option.votes || 0;
                          const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                          
                          return (
                            <Box 
                              key={optionId}
                              position="relative"
                              p={3}
                              borderRadius="lg"
                              cursor="pointer"
                              onClick={() => handleVote(optionId)}
                              bg={useColorModeValue("white", "gray.800")}
                              border="2px solid"
                              borderColor={isSelected ? "blue.400" : "transparent"}
                              _hover={{ 
                                borderColor: isSelected ? "blue.500" : useColorModeValue("gray.200", "gray.600")
                              }}
                            >
                              {hasVoted && (
                                <Box
                                  position="absolute"
                                  left={0}
                                  top={0}
                                  bottom={0}
                                  width={`${percentage}%`}
                                  bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")}
                                  opacity={0.3}
                                  borderRadius="lg"
                                />
                              )}
                              <Flex justify="space-between" align="center" position="relative">
                                <Text>{option.text}</Text>
                                {hasVoted && (
                                  <Text fontWeight="bold" color={isSelected ? "blue.500" : mutedText}>
                                    {percentage}%
                                  </Text>
                                )}
                              </Flex>
                            </Box>
                          );
                        })}
                      </VStack>
                      {hasVoted && (
                        <Text fontSize="sm" color={mutedText} mt={2} textAlign="center">
                          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </CardBody>

      {/* Footer - Engagement */}
      <CardFooter p={4} pt={0}>
        {/* Instagram-style Action Bar */}
        <VStack width="100%" spacing={2} align="stretch">
          {/* Action Icons with Counts */}
          <Flex justify="space-between" align="center" width="100%">
            <HStack spacing={4}>
              {/* Like Button */}
              <HStack spacing={1.5} align="center">
                <Icon 
                  as={FiHeart} 
                  boxSize={5} 
                  color={liked[resource.id] ? "red.500" : "inherit"} 
                  fill={liked[resource.id] ? "currentColor" : "none"}
                  cursor="pointer"
                  onClick={(e) => { e.stopPropagation(); onLike(resource.id); }}
                />
                <Text fontSize="sm" fontWeight="medium">{likeCounts[resource.id] || 0}</Text>
              </HStack>

              {/* Comment Button */}
              <HStack spacing={1.5} align="center">
                <Icon 
                  as={FiMessageCircle} 
                  boxSize={5} 
                  cursor="pointer"
                  onClick={(e) => { e.stopPropagation(); onToggle(); }}
                />
                <Text fontSize="sm" fontWeight="medium">{comments[resource.id]?.length || 0}</Text>
              </HStack>

              {/* Share Button */}
              <Menu placement="top" isLazy>
                <MenuButton
                  as={IconButton}
                  icon={<FiShare2 />}
                  variant="ghost"
                  size="sm"
                  p={0}
                  minW="auto"
                  aria-label="Share options"
                  onClick={(e) => e.stopPropagation()}
                />
                <MenuList shadow="lg" borderRadius="xl" p={4}>
                  <Text fontWeight="semibold" mb={3}>Share this post</Text>
                  <SimpleGrid columns={2} spacing={3}>
                    <VStack
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/resources/${resource.id}`);
                        toast({ title: "Link copied!", status: "success", duration: 2000 });
                      }}
                      cursor="pointer"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    >
                      <Box dangerouslySetInnerHTML={{ __html: socialIcons.copy }} />
                      <Text fontSize="xs">Copy Link</Text>
                    </VStack>
                    <VStack
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out: ${resource.title} ${window.location.origin}/resources/${resource.id}`)}`, '_blank')}
                      cursor="pointer"
                      p={2}
                      borderRadius="lg"
                      _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                    >
                      <Box dangerouslySetInnerHTML={{ __html: socialIcons.whatsapp }} />
                      <Text fontSize="xs">WhatsApp</Text>
                    </VStack>
                  </SimpleGrid>
                </MenuList>
              </Menu>
            </HStack>

            {/* Bookmark Button */}
            <IconButton
              icon={<FiBookmark fill={bookmarked[resource.id] ? "currentColor" : "none"} />}
              variant="ghost"
              size="sm"
              p={0}
              minW="auto"
              color={bookmarked[resource.id] ? "blue.500" : mutedText}
              onClick={(e) => { e.stopPropagation(); onBookmark(resource.id, resource.title); }}
              aria-label="Bookmark"
            />
          </Flex>

          {/* View Count (if available) */}
          {resource.viewCount && (
            <Text fontSize="sm" color={mutedText}>
              {resource.viewCount} views
            </Text>
          )}

        </VStack>
      </CardFooter>
    </MotionCard>
  );
});

export default ResourceCard;