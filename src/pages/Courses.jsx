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
import { FiSearch, FiBook, FiPlus, FiArrowRight, FiArrowLeft, FiFileText, FiMessageSquare } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const CoursesPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const courses = [
    {
      id: 1,
      code: "CS 301",
      title: "Computer Architecture",
      description: "Explore the fundamentals of computer systems design.",
      enrolled: true,
      resources: 12,
      discussions: 45,
    },
    {
      id: 2,
      code: "MATH 202",
      title: "Linear Algebra",
      description: "Study vectors, matrices, and linear transformations.",
      enrolled: true,
      resources: 8,
      discussions: 32,
    },
    {
      id: 3,
      code: "PHYS 101",
      title: "Introduction to Physics",
      description: "Learn the basics of mechanics and thermodynamics.",
      enrolled: false,
      resources: 5,
      discussions: 18,
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
              Academic Courses
            </Heading>
          </HStack>
          
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            as={Link}
            to="/courses/new"
            size="lg"
            borderRadius="full"
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            Add New Course
          </Button>
        </Flex>

        {/* Search Bar */}
        <InputGroup mb={8} maxW="600px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color={mutedText} />
          </InputLeftElement>
          <Input
            placeholder="Search courses..."
            borderRadius="full"
            bg={cardBg}
            _focus={{
              boxShadow: `0 0 0 2px ${accentColor}`,
            }}
          />
        </InputGroup>

        {/* Courses Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }}
          gap={6}
        >
          {courses.map((course) => (
            <MotionCard
              key={course.id}
              bg={cardBg}
              boxShadow="lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <CardHeader pb={0}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontSize="xl"
                      fontWeight="800"
                      color={accentColor}
                      mb={1}
                    >
                      {course.code}
                    </Text>
                    <Heading size="md" color={textColor}>
                      {course.title}
                    </Heading>
                  </Box>
                  {course.enrolled && (
                    <Badge
                      colorScheme="green"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="sm"
                    >
                      Enrolled
                    </Badge>
                  )}
                </Flex>
              </CardHeader>

              <CardBody>
                <Text color={mutedText} mb={4}>
                  {course.description}
                </Text>
                
                <Stack spacing={3}>
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color={accentColor} />
                    <Text fontSize="sm" color={textColor}>
                      {course.resources} Learning Resources
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiMessageSquare} color={accentColor} />
                    <Text fontSize="sm" color={textColor}>
                      {course.discussions} Active Discussions
                    </Text>
                  </HStack>
                </Stack>
              </CardBody>

              <CardFooter pt={0}>
                <Flex justify="space-between" align="center" w="full">
                  <Button
                    as={Link}
                    to={`/courses/${course.id}`}
                    rightIcon={<FiArrowRight />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    borderRadius="full"
                    _hover={{
                      bg: hoverBg,
                      transform: "translateX(4px)"
                    }}
                    transition="all 0.2s"
                  >
                    View Details
                  </Button>
                  {!course.enrolled && (
                    <Button
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                      _hover={{ transform: "scale(1.05)" }}
                      transition="all 0.2s"
                    >
                      Enroll Now
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

export default CoursesPage;