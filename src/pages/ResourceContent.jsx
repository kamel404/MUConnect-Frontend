import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Badge,
  Avatar,
  Icon,
  Image,
  HStack,
  VStack,
  useToast
} from "@chakra-ui/react";
import { 
  FiArrowLeft, 
  FiDownload,
  FiHeart,
  FiBookmark,
  FiShare2
} from "react-icons/fi";
  import { Link, useParams, useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";

  const ResourceContentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentColor = useColorModeValue("blue.500", "blue.300");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const hoverBg = useColorModeValue("gray.100", "gray.600");

    // State for interactive elements
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(47);
    const [isSaved, setIsSaved] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Simple resource data
    const resource = {
      id: 1,
      type: "PDF Document",
      title: "Academic Writing Guide for Research Papers",
      category: "Study Skills",
      description: "Guide for academic writing and research papers with templates and citation examples.",
      downloads: 128,
      fileSize: "2.4 MB",
      dateAdded: "2025-04-25T14:30:00",
      author: {
        name: "Prof. Sarah Ahmed",
        avatar: "https://i.pravatar.cc/150?img=32"
      },
      likes: 47,
      comments: [
        {
          id: 1,
          user: {
            name: "Ahmed Hassan",
            avatar: "https://i.pravatar.cc/150?img=11"
          },
          text: "This guide was incredibly helpful for my research paper!",
          date: "2025-04-26T10:15:00"
        }
      ],
      tags: ["writing", "research", "academic", "citation"],
      imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      content: `
        Academic Writing Guide

        Introduction to Academic Writing
        Academic writing is characterized by evidence-based arguments, precise word choice, logical organization, and an impersonal tone.

        Structuring Your Paper
        A well-structured academic paper typically includes:
        - Title page
        - Abstract
        - Introduction
        - Methodology
        - Results
        - Conclusion
        - References
      `,
      related: [
        { 
          id: 4,
          type: "Video", 
          title: "Research Methods Workshop", 
          author: "Dr. Ali Hassan",
          avatar: "https://i.pravatar.cc/150?img=11"
        },
        { 
          id: 2,
          type: "PDF Document", 
          title: "Citation Styles Comparison", 
          author: "Noura Khalid",
          avatar: "https://i.pravatar.cc/150?img=29"
        }
      ]
    };

    // Simplified handler functions
    const handleLike = () => {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      toast({
        title: isLiked ? "Like removed" : "Resource liked",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };
    
    const handleSave = () => {
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Removed from collection" : "Saved to collection",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };
    
    const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    };
    
    // Simple date formatter
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    return (
      <Box bg={useColorModeValue("gray.50", "gray.800")} minH="100vh">
        <Box maxW="container.md" mx="auto" p={4}>
          {/* Back Button */}
          <Button
            leftIcon={<FiArrowLeft />}
            as={Link}
            to="/resources"
            variant="ghost"
            mb={4}
          >
            Back to Resources
          </Button>
          
          {/* Resource Card */}
          <Card mb={6}>
            <CardBody>
              {/* Header */}
              <HStack mb={4}>
                <Avatar src={resource.author.avatar} name={resource.author.name} size="md" />
                <Box>
                  <Heading size="sm">{resource.author.name}</Heading>
                  <Text fontSize="sm" color={mutedText}>{formatDate(resource.dateAdded)}</Text>
                </Box>
              </HStack>
              
              {/* Title and Category */}
              <Heading size="lg" mb={2}>{resource.title}</Heading>
              <HStack mb={4}>
                <Badge colorScheme="blue">{resource.type}</Badge>
                <Badge colorScheme="yellow">{resource.category}</Badge>
              </HStack>
              
              {/* Image */}
              <Image 
                src={resource.imageUrl} 
                alt={resource.title}
                borderRadius="md"
                mb={4}
              />
              
              {/* Description */}
              <Text mb={4}>{resource.description}</Text>
              
              {/* Stats */}
              <HStack mb={4} spacing={4} color={mutedText}>
                <Flex align="center">
                  <Icon as={FiDownload} mr={1} />
                  <Text>{resource.downloads}</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={FiHeart} mr={1} />
                  <Text>{likes}</Text>
                </Flex>
              </HStack>
              
              {/* Action Buttons */}
              <HStack mb={6} spacing={4}>
                <Button
                  leftIcon={<Icon as={FiHeart} color={isLiked ? "red.500" : undefined} />}
                  onClick={handleLike}
                  variant="outline"
                >
                  {isLiked ? "Liked" : "Like"}
                </Button>
                <Button
                  leftIcon={<FiBookmark />}
                  onClick={handleSave}
                  variant="outline"
                >
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button
                  leftIcon={<FiShare2 />}
                  onClick={handleShare}
                  variant="outline"
                >
                  Share
                </Button>
              </HStack>
              
              {/* Content */}
              <Box 
                p={4} 
                bg={useColorModeValue("gray.50", "gray.700")} 
                borderRadius="md"
                whiteSpace="pre-wrap"
                mb={6}
              >
                {resource.content}
              </Box>
              
              <Button
                leftIcon={<FiDownload />}
                colorScheme="blue"
                mb={6}
              >
                Download Resource
              </Button>
              
              {/* Comments */}
              <Heading size="md" mb={4}>Comments ({resource.comments.length})</Heading>
              {resource.comments.map((comment) => (
                <Box key={comment.id} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                  <HStack mb={2}>
                    <Avatar size="sm" src={comment.user.avatar} name={comment.user.name} />
                    <Box>
                      <Text fontWeight="bold">{comment.user.name}</Text>
                      <Text fontSize="sm" color={mutedText}>{formatDate(comment.date)}</Text>
                    </Box>
                  </HStack>
                  <Text>{comment.text}</Text>
                </Box>
              ))}
              
              {/* Related Resources */}
              <Heading size="md" mb={4} mt={8}>Related Resources</Heading>
              <HStack mb={4} overflowX="auto" pb={2} spacing={4}>
                {resource.related.map((item) => (
                  <Box key={item.id} w="200px" borderWidth="1px" borderRadius="md" overflow="hidden" flexShrink={0}>
                    <Box h="100px" bg="gray.100"></Box>
                    <Box p={3}>
                      <Badge mb={2}>{item.type}</Badge>
                      <Heading size="sm" mb={2} noOfLines={2}>{item.title}</Heading>
                      <Text fontSize="sm">{item.author}</Text>
                      <Button
                        as={Link}
                        to={`/resources/${item.id}`}
                        size="sm"
                        mt={2}
                        w="full"
                        variant="outline"
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                ))}
              </HStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
    );
  };
  
  export default ResourceContentPage;