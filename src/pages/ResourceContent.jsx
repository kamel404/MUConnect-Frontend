import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
    Badge,
    Grid,
    Avatar,
    Tabs,
    TabList,
    Tab,
    Divider,
    IconButton,
    Icon,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    CardFooter
  } from "@chakra-ui/react";
  import { 
    FiArrowLeft, 
    FiFileText, 
    FiVideo, 
    FiSearch,
    FiDownload,
    FiThumbsUp,
    FiMessageSquare,
    FiShare2,
    FiClock,
  } from "react-icons/fi";
  import { Link, useParams } from "react-router-dom";
  
  const ResourceContentPage = () => {
    const { id } = useParams();
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentColor = useColorModeValue("blue.500", "blue.300");
  
    // Sample resource data
    const resource = {
      id: 1,
      type: "notes",
      title: "Computer Architecture Midterm Prep",
      author: "Sarah Mohamed",
      votes: 24,
      downloads: 142,
      comments: 15,
      date: "March 15, 2024",
      content: `
        ## Digital Logic Fundamentals
        ### Boolean Algebra Basics
        - Logical AND/OR operations
        - Truth tables and Karnaugh maps
        - Combinational vs sequential logic
        
        ### Practice Problems
        1. Simplify the Boolean expression: A'(B + C) + AB'
        2. Design a 4-bit parity generator
      `,
      preview: "This comprehensive guide covers key concepts for the midterm exam...",
      related: [
        { type: "video", title: "Boolean Algebra Explained", author: "Ali H", votes: 18 },
        { type: "notes", title: "Practice Problem Solutions", author: "Noura K", votes: 32 }
      ]
    };
  
    return (
      <Flex minH="100vh" p={8} bg={useColorModeValue("gray.50", "gray.800")}>
        <Box maxW="container.lg" mx="auto" w="full">
          {/* Header */}
          <Flex mb={8} align="center" justify="space-between">
            <Button
              leftIcon={<FiArrowLeft />}
              as={Link}
              to="/courses/CS301"
              variant="ghost"
              color={accentColor}
            >
              Back to Course
            </Button>
            <Flex align="center" gap={4}>
              <Text color={mutedText}><FiClock /> {resource.date}</Text>
              <Button leftIcon={<FiShare2 />} variant="outline">
                Share
              </Button>
            </Flex>
          </Flex>
  
          {/* Main Content */}
          <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={8}>
            {/* Primary Content */}
            <Card bg={cardBg}>
              <CardHeader>
                <Flex align="center" gap={4}>
                  <Icon 
                    as={resource.type === 'notes' ? FiFileText : FiVideo} 
                    boxSize={8} 
                    color={accentColor} 
                  />
                  <Box>
                    <Heading size="xl" color={textColor}>{resource.title}</Heading>
                    <Flex align="center" mt={2} gap={3}>
                      <Avatar size="sm" name={resource.author} />
                      <Text color={mutedText}>{resource.author}</Text>
                    </Flex>
                  </Box>
                </Flex>
              </CardHeader>
  
              <CardBody>
                {/* Content Preview */}
                <Box 
                  p={4} 
                  bg={useColorModeValue("gray.50", "gray.600")} 
                  borderRadius="md"
                  mb={6}
                >
                  {resource.type === 'notes' ? (
                    <Text whiteSpace="pre-wrap" fontFamily="monospace">
                      {resource.preview}
                    </Text>
                  ) : (
                    <Image
                      src="https://source.unsplash.com/random/800x450?tech"
                      alt="Video thumbnail"
                      borderRadius="md"
                    />
                  )}
                </Box>
  
                {/* Actions */}
                <Flex gap={4} mb={8}>
                  <Button leftIcon={<FiDownload />} colorScheme="blue">
                    Download ({resource.downloads})
                  </Button>
                  <Button leftIcon={<FiThumbsUp />} variant="outline">
                    Upvote ({resource.votes})
                  </Button>
                </Flex>
  
                {/* Full Content */}
                {resource.type === 'notes' && (
                  <Box 
                    className="content-editor"
                    dangerouslySetInnerHTML={{ __html: resource.content }}
                    fontFamily="monospace"
                    lineHeight="tall"
                  />
                )}
  
                {resource.type === 'video' && (
                  <Box
                    as="iframe"
                    width="100%"
                    height="500px"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    borderRadius="md"
                    allowFullScreen
                  />
                )}
              </CardBody>
  
              <CardFooter borderTopWidth="1px">
                <Stack w="full">
                  <Heading size="md" mb={4}>Comments ({resource.comments})</Heading>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMessageSquare color={mutedText} />
                    </InputLeftElement>
                    <Input placeholder="Add a comment..." />
                  </InputGroup>
                </Stack>
              </CardFooter>
            </Card>
  
            {/* Sidebar - Related Content */}
            <Box>
              <Heading size="md" mb={4}>Related Materials</Heading>
              <Stack spacing={4}>
                {resource.related.map((item, i) => (
                  <Card key={i} variant="outline">
                    <CardBody>
                      <Flex align="center" gap={3}>
                        <Icon 
                          as={item.type === 'notes' ? FiFileText : FiVideo} 
                          boxSize={5} 
                          color={accentColor} 
                        />
                        <Box>
                          <Text fontWeight="600">{item.title}</Text>
                          <Text fontSize="sm" color={mutedText}>{item.author}</Text>
                        </Box>
                      </Flex>
                      <Flex mt={3} justify="space-between">
                        <Text fontSize="sm" color={mutedText}>
                          <FiThumbsUp /> {item.votes}
                        </Text>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Box>
      </Flex>
    );
  };
  
  export default ResourceContentPage;