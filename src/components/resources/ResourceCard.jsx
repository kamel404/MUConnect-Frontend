import React, { memo, useState } from "react";
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
  Collapse
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
  FiLink
} from "react-icons/fi";
import { motion } from "framer-motion";
import CommentInput from "./CommentInput";

const MotionCard = motion(Card);

/**
 * Resource card component that displays a single resource with social media elements
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
  onFollow,
  cardBg,
  textColor,
  mutedText,
  borderColor
}) => {
  // Local state for additional social interactions
  const [followedAuthors, setFollowedAuthors] = useState({});
  const [showAllComments, setShowAllComments] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  
  // Handle follow/unfollow author
  const handleFollowAuthor = (e, authorId) => {
    e.stopPropagation();
    setFollowedAuthors(prev => ({ ...prev, [authorId]: !prev[authorId] }));
    if (onFollow) onFollow(authorId, !followedAuthors[authorId]);
  };
  // Social metrics
  const viewCount = resource.views || Math.floor(Math.random() * 500) + 50;
  const isTrending = (likeCounts[resource.id] || 0) > 15 || viewCount > 200;
  const engagementScore = ((likeCounts[resource.id] || 0) + (comments[resource.id]?.length || 0) * 2) / 10;
  const recentEngagements = resource.recentEngagements || [
    { id: 1, avatar: "https://i.pravatar.cc/150?img=45" },
    { id: 2, avatar: "https://i.pravatar.cc/150?img=26" },
    { id: 3, avatar: "https://i.pravatar.cc/150?img=33" },
    { id: 4, avatar: "https://i.pravatar.cc/150?img=19" },
  ];
  
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
      _hover={{ cursor: "pointer" }}
    >
      <CardHeader pb={0} px={{ base: 3, md: 6 }} pt={5} position="relative" onClick={() => onCardClick(resource.id)}>
        <Flex align="center" gap={3} justify="space-between">
          <Flex align="center" gap={3}>
            <Avatar 
              size="md" 
              src={resource.author.avatar} 
              name={resource.author.name} 
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
              cursor="pointer"
              onClick={e => { e.stopPropagation(); /* Author profile navigation */ }}
            />
            <Box>
              <Flex align="center" gap={2}>
                <Text fontWeight="bold" fontSize="md" color={textColor}>{resource.author.name}</Text>
                {resource.author.verified && (
                  <Tooltip label="Verified Contributor" placement="top">
                    <Box boxSize={3.5} bg="blue.400" borderRadius="full" /> 
                  </Tooltip>
                )}
              </Flex>
              <Flex align="center" gap={1}>
                <Text fontSize="xs" color={mutedText}>{new Date(resource.dateAdded).toLocaleString()}</Text>
                {isTrending && (
                  <Tooltip label="Trending" placement="top">
                    <Flex align="center">
                      <FiTrendingUp color="#E53E3E" size={12} />
                    </Flex>
                  </Tooltip>
                )}
              </Flex>
            </Box>
          </Flex>
          <Flex>
            <Button
              size="sm"
              variant={followedAuthors[resource.author.id] ? "solid" : "outline"}
              colorScheme={followedAuthors[resource.author.id] ? "blue" : "gray"}
              leftIcon={followedAuthors[resource.author.id] ? <FiCheck size={14} /> : <FiUserPlus size={14} />}
              mr={2}
              onClick={e => handleFollowAuthor(e, resource.author.id)}
            >
              {followedAuthors[resource.author.id] ? "Following" : "Follow"}
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreHorizontal />}
                variant="ghost"
                size="sm"
                onClick={e => e.stopPropagation()}
              />
              <MenuList onClick={e => e.stopPropagation()}>
                <MenuItem icon={<FiBookmark />} onClick={e => onBookmark(resource.id, resource.title)}>
                  {bookmarked[resource.id] ? "Remove Bookmark" : "Bookmark"}
                </MenuItem>
                <MenuItem icon={<FiCopy />}>Copy Resource Link</MenuItem>
                <MenuItem icon={<FiLink />}>Share via Email</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody pt={3} pb={2} px={{ base: 3, md: 6 }} onClick={() => onCardClick(resource.id)}>
        <Box mb={3} h={{ base: "180px", md: "250px" }} overflow="hidden" borderRadius="lg">
          <Skeleton isLoaded={!!resource.imageUrl} borderRadius="lg">
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
        
        {/* Resource Type and Category Tags */}
        <HStack spacing={2} mb={3} flexWrap="wrap">
          {resource.type && (
            <Badge colorScheme={resource.type === "Video" ? "red" : resource.type === "PDF" ? "blue" : "green"} fontSize="xs">
              {resource.type}
            </Badge>
          )}
          {resource.category && (
            <Badge variant="outline" colorScheme="purple" fontSize="xs">
              {resource.category}
            </Badge>
          )}
          {resource.difficulty && (
            <Badge variant="subtle" colorScheme={resource.difficulty === "Beginner" ? "green" : resource.difficulty === "Intermediate" ? "yellow" : "red"} fontSize="xs">
              {resource.difficulty}
            </Badge>
          )}
        </HStack>
        
        {/* Social Engagement Metrics */}
        <Flex justify="space-between" align="center" mb={3}>
          <HStack spacing={4}>
            <Tooltip label="People who liked this" hasArrow>
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
            <Tooltip label="Views" hasArrow>
              <Flex align="center" gap={1.5}>
                <FiEye size={16} />
                <Text fontSize="sm" fontWeight="medium">{viewCount}</Text>
              </Flex>
            </Tooltip>
          </HStack>
          
          <Tooltip label="Recent engagement" hasArrow>
            <AvatarGroup size="xs" max={3}>
              {recentEngagements.map(user => (
                <Avatar key={user.id} src={user.avatar} boxSize="24px" />
              ))}
            </AvatarGroup>
          </Tooltip>
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
            leftIcon={<FiMessageCircle />}
            variant="outline"
            colorScheme="gray"
            size="sm"
            width="1fr"
            flex="1"
            onClick={e => { e.stopPropagation(); onToggle(); }}
          >
            Comment
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
        
        {/* Resource stats */}
        <HStack spacing={4} mb={3} color={mutedText}>
          <Tooltip label="Download count" hasArrow>
            <Flex align="center" gap={1.5}>
              <FiDownload size={14} />
              <Text fontSize="xs">{resource.downloads}</Text>
            </Flex>
          </Tooltip>
          
          {resource.fileSize && (
            <Tooltip label="File size" hasArrow>
              <Text fontSize="xs">{resource.fileSize}</Text>
            </Tooltip>
          )}
          
          {engagementScore > 0 && (
            <Tooltip label="Engagement score" hasArrow>
              <Flex align="center" gap={1}>
                <Text fontSize="xs" fontWeight={engagementScore > 3 ? "bold" : "normal"} color={engagementScore > 3 ? "blue.500" : mutedText}>
                  {engagementScore.toFixed(1)}/5
                </Text>
              </Flex>
            </Tooltip>
          )}
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
