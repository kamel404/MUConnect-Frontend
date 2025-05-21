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
  useToken
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

  const engagementScore = ((likeCounts[resource.id] || 0) + (comments[resource.id]?.length || 0) * 2) / 10;
  const recentEngagements = resource.recentEngagements || [
    { id: 1, avatar: "https://i.pravatar.cc/150?img=45" },
    { id: 2, avatar: "https://i.pravatar.cc/150?img=26" },
    { id: 3, avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 4, avatar: "https://i.pravatar.cc/150?img=19" },
  ];

  const { videos, images, documents, links, polls, all } = useMemo(() => {
    return formatAttachmentsForGrid(resource);
  }, [resource]);

  const hasMixedContent = useMemo(() => {
    return (videos.length > 0 && (images.length > 0 || documents.length > 0 || polls.length > 0)) || 
           (images.length > 0 && (documents.length > 0 || polls.length > 0)) ||
           (documents.length > 0 && polls.length > 0);
  }, [videos, images, documents, polls]);

  const totalAttachmentsCount = videos.length + images.length + documents.length + links.length + polls.length;

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '';
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const resourceTypeData = useMemo(() => {
    const type = (resource.type || '').toLowerCase();
    if (type.includes('poll') || polls.length > 0) {
      return { icon: FiBarChart2, color: 'teal.400', scheme: 'teal' };
    } else if (type.includes('video') || (resource.mediaType === 'video')) {
      return { icon: FiVideo, color: 'red.400', scheme: 'red' };
    } else if (type.includes('pdf') || type.includes('document')) {
      return { icon: FiFileText, color: 'blue.400', scheme: 'blue' };
    } else if (type.includes('course')) {
      return { icon: FiBookOpen, color: 'purple.400', scheme: 'purple' };
    } else if (type.includes('image')) {
      return { icon: FiImage, color: 'green.400', scheme: 'green' };
    } else if (type.includes('link') || links.length > 0) {
      return { icon: FiLink, color: 'purple.400', scheme: 'purple' };
    } else {
      return { icon: FiFile, color: 'gray.400', scheme: 'gray' };
    }
  }, [resource.type, resource.mediaType]);

  const glassEffect = useColorModeValue(
    'rgba(255, 255, 255, 0.8)',
    'rgba(30, 30, 30, 0.8)'
  );
  
  const cardHighlight = useColorModeValue(
    `${resourceTypeData.color}20`,
    `${resourceTypeData.color}15`
  );

  return (
    <MotionCard
      bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(45, 55, 72, 0.8)")}
      backdropFilter="blur(10px)"
      boxShadow="0 10px 30px -15px rgba(0, 0, 0, 0.15)"
      borderRadius="24px"
      borderWidth="1px"
      borderColor={useColorModeValue("rgba(226, 232, 240, 0.8)", "rgba(74, 85, 104, 0.3)")}
      mb={6}
      w="full"
      onClick={() => onCardClick && onCardClick(resource.id)}
      whileHover={{ 
        y: -4, 
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
        borderColor: resourceTypeData.color 
      }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      p={0}
      overflow="hidden"
      _hover={{ cursor: "pointer" }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        bg: resourceTypeData.color,
        borderTopLeftRadius: 'xl',
        borderBottomLeftRadius: 'xl'
      }}
    >
      <CardHeader pb={1} px={{ base: 4, md: 6 }} pt={4} position="relative" bg={cardHighlight}>
        <Flex align="center" gap={3} justify="space-between">
          <Flex align="center" gap={3}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              borderRadius="full"
              p="2px"
              bg={resourceTypeData.color}
            >
              <Avatar
                size="md"
                src={(resource.author?.avatar || resource.creator?.avatar)}
                name={(resource.author?.name || resource.creator?.name)}
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
                cursor="pointer"
                borderWidth="2px"
                borderColor="white"
                onClick={e => { 
                  e.stopPropagation(); 
                  // Navigate to author profile
                  const authorId = resource.author?.id || resource.creator?.id || 'unknown';
                  navigate(`/user/${authorId}`);
                }}
              />
            </MotionBox>
            
            <Box>
              <MotionFlex 
                align="center" 
                gap={2}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Text 
                  fontWeight="bold" 
                  fontSize="md" 
                  color={textColor}
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={e => { 
                    e.stopPropagation(); 
                    const authorId = resource.author?.id || resource.creator?.id || 'unknown';
                    navigate(`/user/${authorId}`);
                  }}
                >
                  {resource.author?.name || resource.creator?.name}
                </Text>
                {(resource.author?.verified || resource.creator?.verified) && (
                  <Tooltip label="Verified Contributor" placement="top">
                    <Box boxSize={4} bg={resourceTypeData.color} borderRadius="full" p="1px">
                      <Center h="full" w="full">
                        <Box as={FiCheck} size="10px" color="white" />
                      </Center>
                    </Box>
                  </Tooltip>
                )}
              </MotionFlex>
              
              {resource.createdAt && (
                <MotionText 
                  fontSize="xs" 
                  color={mutedText}
                  display="flex"
                  alignItems="center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Box as={FiClock} size="10px" mr="1" />
                  {new Date(resource.createdAt).toLocaleDateString()}
                </MotionText>
              )}
            </Box>
          </Flex>
          
          <Flex>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                size="sm"
                rounded="full"
                onClick={e => e.stopPropagation()}
              />
              <MenuList onClick={e => e.stopPropagation()} shadow="lg">
                <MenuItem icon={<FiEdit3 />}>Edit</MenuItem>
                <MenuItem icon={<FiShare2 />}>Share</MenuItem>
                <MenuItem icon={<FiDownload />}>Download</MenuItem>
                <MenuItem icon={<FiTrash />} color="red.400">Delete</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody pt={4} pb={3} px={{ base: 5, md: 7 }}>
        <MotionText
          as="h3"
          fontSize="xl"
          fontWeight="bold"
          mb={2}
          color={textColor}
          noOfLines={2}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          lineHeight="1.2"
          onClick={() => onCardClick(resource.id)}
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          {resource.title}
        </MotionText>
        
        <MotionText 
          fontSize="md" 
          color={mutedText} 
          mb={3}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          lineHeight="1.5"
          onClick={() => onCardClick(resource.id)}
          cursor="pointer"
          _hover={{ color: textColor }}
        >
          {(resource.imageUrl || resource.media || resource.file ||
            (resource.images && resource.images.length > 0) ||
            (resource.documents && resource.documents.length > 0)) ?
            <Box noOfLines={2}>{resource.description}</Box> :
            <Box noOfLines={3}>{resource.description}</Box>
          }
        </MotionText>

        <Flex wrap="wrap" gap={2} mb={3} alignItems="center">
          {resource.type && (
            <Tag
              size="sm"
              borderRadius="full"
              variant="subtle"
              colorScheme={resourceTypeData.scheme}
              boxShadow="sm"
              px={3}
              py={1}
            >
              <Box as={resourceTypeData.icon} mr={1} />
              <TagLabel fontWeight="medium">{resource.type}</TagLabel>
            </Tag>
          )}
          
          {resource.fileSize && (
            <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="gray">
              <TagLabel>{formatFileSize(resource.fileSize)}</TagLabel>
            </Tag>
          )}
          
          {resource.viewCount && (
            <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="gray">
              <Box as={FiEye} mr={1} size="12px" />
              <TagLabel>{resource.viewCount}</TagLabel>
            </Tag>
          )}
          
          {resource.category && (
            <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="teal">
              <TagLabel>{resource.category}</TagLabel>
            </Tag>
          )}
        </Flex>

        {totalAttachmentsCount > 0 && (
          <MotionBox
            mb={4}
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            w="full"
            boxShadow="md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {hasMixedContent && (
              <Flex 
                px={3} 
                py={2} 
                bg={`${resourceTypeData.color}15`} 
                borderTopRadius="xl"
                borderBottom="1px"
                borderColor={`${resourceTypeData.color}30`}
                gap={3} 
                align="center"
                justify="flex-start"
              >
                {videos.length > 0 && (
                  <Tag size="sm" variant="subtle" colorScheme="red" borderRadius="full">
                    <Box as={FiVideo} mr={1} />
                    <TagLabel fontWeight="medium">{videos.length} Video{videos.length > 1 ? 's' : ''}</TagLabel>
                  </Tag>
                )}
                {images.length > 0 && (
                  <Tag size="sm" variant="subtle" colorScheme="green" borderRadius="full">
                    <Box as={FiImage} mr={1} />
                    <TagLabel fontWeight="medium">{images.length} Image{images.length > 1 ? 's' : ''}</TagLabel>
                  </Tag>
                )}
                {documents.length > 0 && (
                  <Tag size="sm" variant="subtle" colorScheme="blue" borderRadius="full">
                    <Box as={FiFileText} mr={1} />
                    <TagLabel fontWeight="medium">{documents.length} Document{documents.length > 1 ? 's' : ''}</TagLabel>
                  </Tag>
                )}
                {links.length > 0 && (
                  <Tag size="sm" variant="subtle" colorScheme="purple" borderRadius="full">
                    <Box as={FiLink} mr={1} />
                    <TagLabel fontWeight="medium">{links.length} Link{links.length > 1 ? 's' : ''}</TagLabel>
                  </Tag>
                )}
              </Flex>
            )}

            <Box p={3}>
              {(videos.length > 0 || images.length > 0) && (
                <Box w="full" borderRadius="lg" overflow="hidden" boxShadow="sm">
                  {videos.length + images.length === 1 ? (
                    <Box position="relative" borderRadius="lg" overflow="hidden">
                      {videos.length === 1 ? (
                        <Box position="relative">
                          <AspectRatio ratio={16 / 9} maxH={{ base: "220px", md: "280px" }}>
                            <Box
                              as="video"
                              src={videos[0].url}
                              controls
                              borderRadius="lg"
                              bg="black"
                            />
                          </AspectRatio>
                          <Box 
                            position="absolute" 
                            top="2" 
                            right="2" 
                            bg="red.500"
                            color="white"
                            borderRadius="md"
                            px={2}
                            py={1}
                            fontSize="xs"
                            fontWeight="bold"
                            display="flex"
                            alignItems="center"
                            boxShadow="md"
                          >
                            <Box as={FiVideo} mr={1} />
                            Video
                          </Box>
                        </Box>
                      ) : (
                        <Box position="relative">
                          <AspectRatio ratio={4 / 3} maxH={{ base: "220px", md: "280px" }}>
                            <Image
                              src={images[0].url}
                              alt={resource.title}
                              objectFit="cover"
                              w="100%"
                              borderRadius="lg"
                              transition="all 0.4s ease"
                              _hover={{ transform: "scale(1.04)" }}
                            />
                          </AspectRatio>
                        </Box>
                      )}
                    </Box>
                  ) : videos.length + images.length === 2 ? (
                    <SimpleGrid columns={2} spacing={3}>
                      {[...videos, ...images].slice(0, 2).map((item, index) => (
                        <Box 
                          key={item.id || index} 
                          position="relative" 
                          borderRadius="lg" 
                          overflow="hidden"
                          boxShadow="sm"
                          transition="all 0.3s ease"
                          _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                        >
                          {item.mediaType === 'video' ? (
                            <Box position="relative">
                              <AspectRatio ratio={1}>
                                <Box
                                  as="video"
                                  src={item.url}
                                  controls
                                  borderRadius="lg"
                                  bg="black"
                                />
                              </AspectRatio>
                              <Box 
                                position="absolute" 
                                top="2" 
                                right="2"
                                bg="red.500"
                                color="white"
                                borderRadius="full"
                                p={1}
                                boxSize="6"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                boxShadow="md"
                              >
                                <Box as={FiPlay} />
                              </Box>
                            </Box>
                          ) : (
                            <AspectRatio ratio={1}>
                              <Image
                                src={item.url}
                                alt={`${resource.title} - ${index}`}
                                objectFit="cover"
                                w="100%"
                                borderRadius="lg"
                                transition="transform 0.4s ease"
                                _hover={{ transform: "scale(1.05)" }}
                              />
                            </AspectRatio>
                          )}
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <SimpleGrid columns={3} spacing={2}>
                      {[...videos, ...images].slice(0, 3).map((item, index) => (
                        <MotionBox 
                          key={item.id || index} 
                          position="relative" 
                          borderRadius="lg" 
                          overflow="hidden"
                          whileHover={{ scale: 1.03, zIndex: 1 }}
                          boxShadow="sm"
                        >
                          {item.mediaType === 'video' ? (
                            <AspectRatio ratio={1}>
                              <Box position="relative">
                                <Box
                                  as="video"
                                  src={item.url}
                                  controls={false}
                                  borderRadius="lg"
                                  bg="black"
                                />
                                <Flex
                                  position="absolute"
                                  top="0"
                                  left="0"
                                  w="100%"
                                  h="100%"
                                  align="center"
                                  justify="center"
                                  bg="blackAlpha.300"
                                >
                                  <Circle
                                    size="40px"
                                    bg="whiteAlpha.800"
                                    color="red.500"
                                    boxShadow="md"
                                  >
                                    <Box 
                                      transform="translateX(2px)" 
                                      as={FiPlay} 
                                      size="20px" 
                                    />
                                  </Circle>
                                </Flex>
                              </Box>
                            </AspectRatio>
                          ) : (
                            <AspectRatio ratio={1}>
                              <Image
                                src={item.url}
                                alt={`${resource.title} - ${index}`}
                                objectFit="cover"
                                w="100%"
                                borderRadius="lg"
                                transition="all 0.4s ease"
                              />
                            </AspectRatio>
                          )}
                          {index === 2 && videos.length + images.length > 3 && (
                            <Flex
                              position="absolute"
                              top="0"
                              left="0"
                              w="100%"
                              h="100%"
                              align="center"
                              justify="center"
                              bg="blackAlpha.700"
                              color="white"
                              fontSize="xl"
                              fontWeight="bold"
                              borderRadius="lg"
                            >
                              <VStack spacing={0}>
                                <Text fontSize="2xl">+{videos.length + images.length - 3}</Text>
                                <Text fontSize="xs">more</Text>
                              </VStack>
                            </Flex>
                          )}
                        </MotionBox>
                      ))}
                    </SimpleGrid>
                  )}
                </Box>
              )}
              
              {links.length > 0 && (
                <Box mt={4}>
                  {links.slice(0, 3).map((link, index) => (
                    <MotionBox
                      key={link.id || `link-${index}`}
                      mb={2}
                      p={3}
                      borderRadius="lg"
                      bg={useColorModeValue("gray.50", "gray.700")}
                      display="flex"
                      alignItems="center"
                      boxShadow="sm"
                      whileHover={{ y: -2, boxShadow: "md" }}
                      transition={{ duration: 0.2 }}
                      borderLeftWidth="3px"
                      borderLeftColor="purple.400"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(link.url, "_blank");
                      }}
                      cursor="pointer"
                    >
                      <Circle
                        size="40px"
                        bg="purple.50"
                        color="purple.500"
                        mr={3}
                      >
                        <Box as={FiExternalLink} size="20px" />
                      </Circle>
                      <Box flex="1">
                        <Text fontWeight="medium" mb={0.5} noOfLines={1}>
                          {link.title || "Link"}
                        </Text>
                        <Flex alignItems="center" fontSize="xs" color={mutedText}>
                          <Text noOfLines={1}>{link.url}</Text>
                        </Flex>
                      </Box>
                      <IconButton
                        icon={<FiExternalLink />}
                        size="sm"
                        variant="ghost"
                        colorScheme="purple"
                        ml={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(link.url, "_blank");
                        }}
                        aria-label="Open link"
                      />
                    </MotionBox>
                  ))}
                  {links.length > 3 && (
                    <Text fontSize="sm" color={mutedText} mt={1} textAlign="center">
                      +{links.length - 3} more link{links.length - 3 > 1 ? 's' : ''}
                    </Text>
                  )}
                </Box>
              )}
              
              {documents.length > 0 && (
                <Box mt={4}>
                  {documents.slice(0, 3).map((doc, index) => (
                    <MotionBox
                      key={doc.id || `doc-${index}`}
                      mb={2}
                      p={3}
                      borderRadius="lg"
                      bg="blackAlpha.50"
                      borderWidth="1px"
                      borderColor={borderColor}
                      whileHover={{ scale: 1.02 }}
                      cursor="pointer"
                    >
                      <Flex align="center">
                        <Circle size="40px" bg="blue.50" color="blue.500" mr={3}>
                          <FiFileText size={20} />
                        </Circle>
                        <Box flex="1">
                          <Text fontWeight="medium" fontSize="sm" mb={1}>
                            {doc.name || `Document ${index + 1}`}
                          </Text>
                          <Text fontSize="xs" color={mutedText}>
                            {formatFileSize(doc.size)}
                          </Text>
                        </Box>
                        <IconButton
                          icon={<FiDownload size={16} />}
                          variant="ghost"
                          colorScheme="blue"
                          size="sm"
                          aria-label="Download"
                        />
                      </Flex>
                    </MotionBox>
                  ))}
                  {documents.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      width="full"
                      mt={1}
                      leftIcon={<FiFileText />}
                      colorScheme="blue"
                      borderRadius="md"
                    >
                      +{documents.length - 3} more documents
                    </Button>
                  )}
                </Box>
              )}
              
              {polls.length > 0 && (
                <Box mt={4}>
                  {polls.slice(0, 1).map((poll, index) => {
                    const pollId = poll.id || `poll-${index}`;
                    const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
                    const hasVoted = votedPolls[pollId];
                    const selectedOption = userVotes[pollId];
                    
                    const handleVote = useCallback((optionId) => {
                      // Allow changing votes by always updating the selected option
                      setUserVotes(prev => ({
                        ...prev,
                        [pollId]: optionId
                      }));
                      
                      // Only show the success message if this is a new vote
                      if (!hasVoted) {
                        setVotedPolls(prev => ({
                          ...prev,
                          [pollId]: true
                        }));
                        
                        toast({
                          title: "Vote recorded",
                          description: "Your vote has been submitted",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      } else {
                        // Optional: Show a different message when changing a vote
                        toast({
                          title: "Vote updated",
                          description: "Your vote has been changed",
                          status: "info",
                          duration: 1500,
                          isClosable: true,
                        });
                      }
                    }, [pollId, hasVoted]);
                    
                    return (
                      <MotionBox
                        key={pollId}
                        bg={useColorModeValue("white", "gray.800")}
                        p={0}
                        borderRadius="xl"
                        borderWidth="1px"
                        borderColor={hasVoted ? "teal.300" : borderColor}
                        mb={3}
                        whileHover={{ scale: 1.01, boxShadow: "md" }}
                        transition={{ duration: 0.2 }}
                        cursor={hasVoted ? "default" : "pointer"}
                        boxShadow="md"
                        overflow="hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Box 
                          bg={useColorModeValue("white", "gray.800")}
                          p={4}
                          borderBottomWidth="1px"
                          borderColor={useColorModeValue("gray.200", "gray.700")}
                        >
                          <Flex direction="column">
                            <Text 
                              fontWeight="medium" 
                              fontSize="md" 
                              color={useColorModeValue("gray.800", "white")}
                              mb={1}
                            >
                              {poll.question}
                            </Text>
                            <Text fontSize="sm" color={useColorModeValue("gray.500", "gray.400")}>
                              {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                            </Text>
                          </Flex>
                        </Box>
                        
                        <Box p={4}>
                          <VStack spacing={3} align="stretch">
                            <RadioGroup onChange={handleVote} value={selectedOption}>
                            <Stack spacing={3}>
                              {poll.options?.map((option, optIndex) => {
                                const optionId = option.id || `option-${optIndex}`;
                                const isSelected = selectedOption === optionId;
                                const optionVotes = option.votes || 0;
                                const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                                
                                return (
                                  <Box 
                                    key={optionId}
                                    position="relative"
                                    pl={hasVoted ? 3 : 10}
                                    pr={3}
                                    py={2.5}
                                    borderRadius="md"
                                    _hover={{ 
                                      bg: useColorModeValue(isSelected ? "blue.50" : "gray.50", 
                                                         isSelected ? "blue.900" : "gray.700") 
                                    }}
                                    cursor="pointer"
                                    onClick={() => handleVote(optionId)}
                                  >
                                    {hasVoted && (
                                      <Box
                                        position="absolute"
                                        left={0}
                                        top={0}
                                        bottom={0}
                                        width={`${percentage}%`}
                                        bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")}
                                        opacity={0.7}
                                        zIndex={0}
                                      />
                                    )}
                                    <Flex 
                                      position="relative" 
                                      zIndex={1} 
                                      align="center" 
                                      justify="space-between"
                                    >
                                      <Flex align="center" maxW={hasVoted ? "80%" : "100%"}>
                                        <Box
                                          minW="20px"
                                          w="20px"
                                          h="20px"
                                          borderRadius="full"
                                          borderWidth="2px"
                                          borderColor={isSelected ? "blue.500" : useColorModeValue("gray.300", "gray.500")}
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          mr={3}
                                          flexShrink={0}
                                        >
                                          {isSelected && (
                                            <Box w="10px" h="10px" borderRadius="full" bg="blue.500" />
                                          )}
                                        </Box>
                                        <Text 
                                          fontSize="md" 
                                          color={useColorModeValue("gray.800", "white")}
                                          isTruncated
                                        >
                                          {option.text}
                                        </Text>
                                      </Flex>
                                      {hasVoted && (
                                        <Flex align="center" ml={2}>
                                          <Text 
                                            fontSize="sm" 
                                            fontWeight="medium"
                                            color={isSelected ? "blue.500" : useColorModeValue("gray.600", "gray.400")}
                                            minW="40px"
                                            textAlign="right"
                                          >
                                            {percentage}%
                                          </Text>
                                        </Flex>
                                      )}
                                    </Flex>
                                    {hasVoted && (
                                      <Box 
                                        mt={1} 
                                        ml={10}
                                        fontSize="xs" 
                                        color={useColorModeValue("gray.500", "gray.400")}
                                      >
                                        {optionVotes} {optionVotes === 1 ? "vote" : "votes"}
                                      </Box>
                                    )}
                                  </Box>
                                );
                              })}
                            </Stack>
                          </RadioGroup>
                          </VStack>
                        </Box>
                      </MotionBox>
                    );
                  })}
                </Box>
              )}
            </Box>
          </MotionBox>
        )}

        <Flex justify="space-between" align="center" mb={3}>
          <HStack spacing={3} mt={2}>
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