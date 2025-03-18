import {
    Flex,
    Grid,
    Box,
    Heading,
    Text,
    Avatar,
    Input,
    Button,
    IconButton,
    Card,
    CardBody,
    Stack,
    Tag,
    useColorModeValue,
    useBreakpointValue,
    Icon,
    InputGroup,
    InputLeftElement,
    HStack,
    AvatarGroup,
    Progress,
    Divider
  } from "@chakra-ui/react";
  import { FiSearch, FiTrendingUp, FiHash, FiPlus } from "react-icons/fi";
  import { motion } from "framer-motion";
  import { useNavigate } from "react-router-dom";
  import { useState } from "react";

  const MotionCard = motion(Card);
  
  const HashtagsPage = () => {
    const navigate = useNavigate();
    const bgColor = useColorModeValue("gray.50", "gray.800");
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const hoverBg = useColorModeValue("gray.100", "gray.600");
    const isMobile = useBreakpointValue({ base: true, md: false });
  
    const [hashtags] = useState([
      {
        name: "MidtermPrep",
        posts: 245,
        recentPosts: [
          { content: "CS 301 study group forming tomorrow!", likes: 45, comments: 12 },
          { content: "Shared MATH 202 practice questions", likes: 89, comments: 24 },
          { content: "Office hours schedule updated", likes: 32, comments: 5 }
        ],
        isFollowing: false
      },
      {
        name: "Internship2024",
        posts: 189,
        recentPosts: [
          { content: "FAANG internship application tips", likes: 102, comments: 45 },
          { content: "Resume review workshop this Friday", likes: 67, comments: 18 }
        ],
        isFollowing: true
      },
      {
        name: "AIResearch",
        posts: 156,
        recentPosts: [
          { content: "New paper on neural architectures", likes: 78, comments: 29 },
          { content: "Machine learning workshop materials", likes: 54, comments: 15 }
        ],
        isFollowing: false
      }
    ]);
  
    return (
      <Grid templateColumns="1fr" minH="100vh" bg={bgColor}>
        <Box p={{ base: 4, md: 8 }} maxW="6xl" mx="auto" width="100%">
          <Flex direction="column" mb={8} gap={6}>
            <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
              Trending Hashtags
            </Heading>
            
            <InputGroup maxW="600px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search hashtags..."
                borderRadius="full"
                bg={useColorModeValue('white', 'gray.600')}
                _focus={{
                  boxShadow: '0 0 0 2px rgba(159, 122, 234, 0.6)',
                }}
              />
            </InputGroup>
  
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              }}
              gap={6}
            >
              {hashtags.map((hashtag) => (
                <MotionCard
                  key={hashtag.name}
                  bg={cardBg}
                  boxShadow="md"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardBody p={6}>
                    <Stack spacing={4}>
                      <Flex justify="space-between" align="center">
                        <HStack spacing={3}>
                          <Icon as={FiHash} boxSize={6} color="purple.500" />
                          <Heading size="lg" color={textColor}>
                            #{hashtag.name}
                          </Heading>
                        </HStack>
                        <Tag
                          colorScheme={hashtag.isFollowing ? "purple" : "gray"}
                          borderRadius="full"
                          cursor="pointer"
                          _hover={{ bg: hoverBg }}
                        >
                          {hashtag.isFollowing ? "Following" : "Follow"}
                        </Tag>
                      </Flex>
  
                      <Flex align="center" gap={2}>
                        <Icon as={FiTrendingUp} color={mutedText} />
                        <Text color={mutedText} fontSize="sm">
                          {hashtag.posts.toLocaleString()} posts
                        </Text>
                      </Flex>
  
                      <Divider borderColor={mutedText} />
  
                      <Stack spacing={3}>
                        <Text fontWeight="500" color={textColor}>
                          Recent Activity
                        </Text>
                        {hashtag.recentPosts.map((post, index) => (
                          <Box
                            key={index}
                            p={3}
                            borderRadius="md"
                            bg={hoverBg}
                            cursor="pointer"
                            onClick={() => navigate(`/posts/${post.id}`)}
                          >
                            <Text noOfLines={2} mb={2} color={textColor}>
                              {post.content}
                            </Text>
                            <HStack spacing={4}>
                              <Text fontSize="sm" color={mutedText}>
                                {post.likes} likes
                              </Text>
                              <Text fontSize="sm" color={mutedText}>
                                {post.comments} comments
                              </Text>
                            </HStack>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </CardBody>
                </MotionCard>
              ))}
            </Grid>
          </Flex>
        </Box>
      </Grid>
    );
  };
  
  export default HashtagsPage;