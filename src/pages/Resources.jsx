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
  CardFooter,
  useColorModeValue,
  Badge,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  HStack,
  Icon,
  Progress,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiSearch, FiBook, FiPlus, FiArrowRight, FiArrowLeft, FiFileText, FiDownload, FiExternalLink } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const ResourcesPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const resources = [
    {
      id: 1,
      title: "Academic Writing Guide",
      type: "PDF Document",
      category: "Study Skills",
      description: "Comprehensive guide for academic writing and research papers.",
      downloads: 128,
      fileSize: "2.4 MB",
      dateAdded: "2025-03-10",
    },
    {
      id: 2,
      title: "Statistical Analysis Tools",
      type: "Web Resource",
      category: "Research",
      description: "Online tools and resources for statistical analysis in research.",
      views: 256,
      externalLink: true,
      dateAdded: "2025-03-15",
    },
    {
      id: 3,
      title: "Career Development Workshop",
      type: "Video",
      category: "Career",
      description: "Recorded workshop on career development strategies for students.",
      views: 95,
      duration: "45 minutes",
      fileSize: "350 MB",
      dateAdded: "2025-03-20",
    },
    {
      id: 4,
      title: "Study Group Formation Guide",
      type: "PDF Document",
      category: "Study Skills",
      description: "Best practices for forming and managing effective study groups.",
      downloads: 78,
      fileSize: "1.2 MB",
      dateAdded: "2025-03-12",
    },
    {
      id: 5,
      title: "Research Database Access",
      type: "Web Resource",
      category: "Research",
      description: "Guide to accessing the university's research databases and journals.",
      views: 189,
      externalLink: true,
      dateAdded: "2025-03-18",
    },
  ];

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        {/* Header */}
        <Flex
          justify="space-between"
          align={isMobile ? "flex-start" : "center"}
          mb={8}
          direction={isMobile ? "column" : "row"}
          gap={4}
        >
          <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
              Learning Resources
            </Heading>
          </HStack>
          
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            as={Link}
            to="/resources/new"
            size="lg"
            borderRadius="full"
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            Add New Resource
          </Button>
        </Flex>

        {/* Search Bar */}
        <InputGroup mb={8} maxW="600px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color={mutedText} />
          </InputLeftElement>
          <Input
            placeholder="Search resources..."
            borderRadius="full"
            bg={cardBg}
            _focus={{
              boxShadow: `0 0 0 2px ${accentColor}`,
            }}
          />
        </InputGroup>

        {/* Resources Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }}
          gap={6}
        >
          {resources.map((resource) => (
            <MotionCard
              key={resource.id}
              bg={cardBg}
              boxShadow="lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Badge
                      colorScheme={
                        resource.type === "PDF Document" ? "blue" :
                        resource.type === "Video" ? "red" :
                        resource.type === "Web Resource" ? "green" : "gray"
                      }
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                      mb={2}
                    >
                      {resource.type}
                    </Badge>
                    <Heading size="md" color={textColor}>
                      {resource.title}
                    </Heading>
                  </Box>
                </Flex>
              </CardHeader>

              <CardBody>
                <Text color={mutedText} mb={4}>
                  {resource.description}
                </Text>
                
                <Stack spacing={3}>
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color={accentColor} />
                    <Text fontSize="sm" color={textColor}>
                      Category: {resource.category}
                    </Text>
                  </HStack>
                  {resource.downloads && (
                    <HStack spacing={3}>
                      <Icon as={FiDownload} color={accentColor} />
                      <Text fontSize="sm" color={textColor}>
                        {resource.downloads} Downloads
                      </Text>
                    </HStack>
                  )}
                  {resource.views && (
                    <HStack spacing={3}>
                      <Icon as={FiFileText} color={accentColor} />
                      <Text fontSize="sm" color={textColor}>
                        {resource.views} Views
                      </Text>
                    </HStack>
                  )}
                  {resource.fileSize && (
                    <HStack spacing={3}>
                      <Icon as={FiFileText} color={accentColor} />
                      <Text fontSize="sm" color={textColor}>
                        Size: {resource.fileSize}
                      </Text>
                    </HStack>
                  )}
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color={accentColor} />
                    <Text fontSize="sm" color={textColor}>
                      Added: {resource.dateAdded}
                    </Text>
                  </HStack>
                </Stack>
              </CardBody>

              <CardFooter pt={0}>
                <Flex justify="space-between" align="center" w="full">
                  <Button
                    as={Link}
                    to={resource.externalLink ? "#" : `/resources/${resource.id}`}
                    onClick={resource.externalLink ? (e) => {
                      e.preventDefault();
                      window.open('https://example.com/resource', '_blank');
                    } : undefined}
                    rightIcon={resource.externalLink ? <FiExternalLink /> : <FiArrowRight />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    _hover={{
                      bg: hoverBg,
                    }}
                  >
                    {resource.externalLink ? "Visit Resource" : "View Details"}
                  </Button>
                  
                  {!resource.externalLink && (
                    <Button
                      rightIcon={<FiDownload />}
                      colorScheme="gray"
                      variant="ghost"
                      size="sm"
                      borderRadius="full"
                      _hover={{
                        bg: hoverBg,
                      }}
                    >
                      Download
                    </Button>
                  )}
                </Flex>
              </CardFooter>
            </MotionCard>
          ))}
        </Grid>
      </Box>
    </Flex>
  );
};

export default ResourcesPage;
