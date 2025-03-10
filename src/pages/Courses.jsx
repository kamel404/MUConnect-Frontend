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
  } from "@chakra-ui/react";
  import { FiSearch, FiBook, FiPlus, FiArrowRight, FiArrowLeft } from "react-icons/fi";
  import { Link } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  
  const CoursesPage = () => {
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const navigate = useNavigate();
  
    // Sample courses data
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

    const handleGoBack = () => {
      navigate(-1);
    };
  
    return (
      <Flex minH="100vh" p={8} bg={useColorModeValue("gray.50", "gray.800")}>
        <Box maxW="container.lg" mx="auto" w="full">
          {/* Header */}
          <Flex justify="space-between" align="center" mb={8}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={handleGoBack}
              variant="ghost"
              title="Go back" 
            />
            <Heading size="xl" color={textColor}>
              Courses
            </Heading>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              as={Link}
              to="/courses/new"
            >
              Add Course
            </Button>
          </Flex>
  
          {/* Search Bar */}
          <InputGroup mb={8}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color={mutedText} />
            </InputLeftElement>
            <Input
              placeholder="Search courses..."
              _placeholder={{ color: mutedText }}
            />
          </InputGroup>
  
          {/* Courses Grid */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {courses.map((course) => (
              <Card key={course.id} bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Heading size="md" color={textColor}>
                        {course.code}
                      </Heading>
                      <Text fontSize="sm" color={mutedText}>
                        {course.title}
                      </Text>
                    </Box>
                    {course.enrolled && (
                      <Badge colorScheme="green" fontSize="sm">
                        Enrolled
                      </Badge>
                    )}
                  </Flex>
                </CardHeader>
  
                <CardBody>
                  <Text color={textColor}>{course.description}</Text>
                </CardBody>
  
                <CardFooter>
                  <Flex justify="space-between" align="center" w="full">
                    <Stack spacing={1}>
                      <Text fontSize="sm" color={mutedText}>
                        {course.resources} Resources
                      </Text>
                      <Text fontSize="sm" color={mutedText}>
                        {course.discussions} Discussions
                      </Text>
                    </Stack>
                    <Button
                      as={Link}
                      to={`/courses/${course.id}`}
                      rightIcon={<FiArrowRight />}
                      colorScheme="blue"
                      size="sm"
                    >
                      View
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>
      </Flex>
    );
  };
  
  export default CoursesPage;