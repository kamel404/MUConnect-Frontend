import {
  Flex,
  Box,
  Heading,
  Text,
  Avatar,
  Stack,
  useColorModeValue,
  IconButton,
  SimpleGrid,
  Container,
  Image,
  Divider,
  HStack,
  VStack,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiFileText,
  FiMessageSquare,
  FiHeart,
  FiUsers,
  FiCalendar,
  FiFlag,
  FiBookOpen,
  FiClock,
  FiShare2,
  FiUserPlus,
  FiMail
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Fetch user profile data
  useEffect(() => {
    // In a real app, you would fetch the user data from an API using the userId
    // For now, we'll simulate loading user data
    const fetchUser = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // This would normally come from an API
      setProfile({
        id: userId,
        name: "John Doe",
        email: "102030@mu.edu.lb",
        bio: "Mobile Developer | Flutter",
        major: "Computer Sciences",
        year: "1st",
        verified: true,
        avatar: "https://i.pravatar.cc/300?img=12",
        coverPhoto: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000",
        sharedResources: [
          { id: 1, title: "Machine Learning Basics", type: "PDF", dateShared: "2025-05-08", fileSize: "4.2 MB" },
          { id: 2, title: "Introduction to Research Methods", type: "Document", dateShared: "2025-04-15",fileSize: "2.8 MB" },
          { id: 3, title: "Statistical Analysis Tutorial", type: "Video", dateShared: "2025-03-20", fileSize: "156 MB" },
          { id: 4, title: "Academic Writing Guidelines", type: "PDF", dateShared: "2025-02-18", fileSize: "1.5 MB" },
        ],
      });
      
      setIsLoading(false);
    };

    fetchUser();
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box height="200px" bg="gray.200" borderRadius="lg" />
          <HStack>
            <Box width="120px" height="120px" borderRadius="full" bg="gray.200" />
            <VStack align="start" spacing={2}>
              <Box height="30px" width="200px" bg="gray.200" borderRadius="md" />
              <Box height="20px" width="150px" bg="gray.200" borderRadius="md" />
            </VStack>
          </HStack>
        </VStack>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Heading>User Not Found</Heading>
          <Text>The user profile you are looking for does not exist.</Text>
          <IconButton 
            icon={<FiArrowLeft />} 
            onClick={handleGoBack}
            aria-label="Go back"
          />
        </VStack>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" pb={10}>
      <Container maxW="container.xl" px={{ base: 4, md: 6 }} pt={4}>
        {/* Back button */}
        <IconButton
          icon={<FiArrowLeft />}
          onClick={handleGoBack}
          aria-label="Go back"
          mb={4}
          variant="ghost"
          size="md"
        />

        {/* Profile Info Card */}
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="md"
          p={6}
          mb={6}
        >
          <VStack spacing={4} align="start">
            {/* Profile picture and basic info */}
            <HStack spacing={6} w="full" align="flex-start">
              <Avatar
                size="2xl"
                src={profile.avatar}
                name={profile.name}
                border="4px solid white"
                mb={4}
              />
              <VStack align="start" spacing={1} flex={1}>
                <HStack width="100%" justify="space-between">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Heading as="h1" size="xl" color={textColor}>
                        {profile.name}
                      </Heading>
                      {profile.verified && (
                        <Badge 
                          bg="blue.500" 
                          color="white" 
                          fontSize="0.7em" 
                          px={2} 
                          py={1} 
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          boxShadow="sm"
                        >
                          <Box as="span" mr={1}>✓</Box>
                          Verified
                        </Badge>
                      )}
                    </HStack>
                    <Text color={mutedText} fontSize="lg">
                      {profile.major} • {profile.year}
                    </Text>
                    <Text color={textColor} mt={2} fontSize="md">
                      {profile.bio}
                    </Text>
                  </VStack>
                  
                  <HStack 
                    bg={useColorModeValue("gray.50", "gray.700")} 
                    p={2} 
                    borderRadius="md" 
                    boxShadow="sm"
                    spacing={3}
                    align="center"
                    height="fit-content"
                  >
                    <Box as={FiMail} color="blue.500" boxSize={4} />
                    <Text color={textColor} fontSize="md" fontWeight="medium">
                      {profile.email}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </MotionBox>

        {/* Shared Resources Section */}
        <MotionBox
          bg={cardBg}
          borderRadius="xl"
          boxShadow="md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          p={6}
        >
          <VStack spacing={6} align="stretch">
            <Heading size="lg" color={textColor}>Shared Resources</Heading>
            <Divider />
            
            {profile.sharedResources && profile.sharedResources.length > 0 ? (
              profile.sharedResources.map((resource, index) => (
                <MotionBox
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  whileHover={{ x: 5, boxShadow: "md" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  cursor="pointer"
                  onClick={() => navigate(`/resources/${resource.id}`)}
                >
                  <HStack spacing={4} justify="space-between">
                    <HStack spacing={4}>
                      <Box
                        as={resource.type === "PDF" ? FiFileText : 
                             resource.type === "Video" ? FiBookOpen : FiFileText}
                        color={resource.type === "PDF" ? "red.500" : 
                               resource.type === "Video" ? "blue.500" : "green.500"}
                        boxSize={6}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{resource.title}</Text>
                        <HStack spacing={4} mt={1}>
                          <Badge colorScheme={resource.type === "PDF" ? "red" : 
                                          resource.type === "Video" ? "blue" : "green"}>
                            {resource.type}
                          </Badge>
                          <Text fontSize="sm" color={mutedText}>
                            {resource.fileSize}
                          </Text>
                          <HStack fontSize="sm" color={mutedText}>
                            <Box as={FiClock} />
                            <Text>{new Date(resource.dateShared).toLocaleDateString()}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </HStack>
                  </HStack>
                </MotionBox>
              ))
            ) : (
              <VStack py={10} spacing={4}>
                <Box as={FiBookOpen} boxSize={10} color={mutedText} />
                <Text color={mutedText}>No resources shared yet</Text>
              </VStack>
            )}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default UserProfilePage;
