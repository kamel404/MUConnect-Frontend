import {
  Flex,
  Box,
  Heading,
  Text,
  Avatar,
  Button,
  Stack,
  useColorModeValue,
  IconButton,
  SimpleGrid,
  Card,
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
  Circle,
  Spinner,
  Icon
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
  FiMail,
  FiBriefcase
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getUserProfileVisitor } from "../services/userService";
import MUConnect from "../assets/mu-connect.png";
import { FiCheck } from "react-icons/fi";

const API_BASE_URL = 'http://127.0.0.1:8000';
const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

// Motion components
const MotionBox = motion(Box);

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

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const data = await getUserProfileVisitor(userId || 'me');
        const mappedProfile = {
          id: data.id,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
          username: data.username,
          email: data.email,
          bio: data.bio,
          major: data.major?.name || 'N/A',
          faculty: data.faculty?.name || 'N/A',
          roles: (data.roles || []).map(role => typeof role === 'string' ? role : role.name),
          verified: data.is_admin || data.is_moderator,
          // TODO: The API should return a full 'avatar_url' instead of just the filename.
          // The line below is a temporary workaround and may not work if the storage path changes.
          avatar: data.avatar ? `${API_BASE_URL}/storage/avatars/${data.avatar}` : DEFAULT_AVATAR,
          joinDate: data.created_at,
        };
        setProfile(mappedProfile);
      } catch (error) {
        console.error('Failed to load visitor profile', error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleGoBack = () => navigate(-1);

  if (isLoading) {
    return (
      <Flex height="100vh" width="100%" align="center" justify="center">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  if (!profile) {
    return (
      <Container maxW="container.xl" py={8} textAlign="center">
        <Heading>User Not Found</Heading>
        <Text>The user profile you are looking for does not exist.</Text>
        <IconButton icon={<FiArrowLeft />} onClick={handleGoBack} aria-label="Go back" mt={4} />
      </Container>
    );
  }

  const InfoBox = ({ icon, title, value }) => (
    <HStack spacing={4} p={4} bg={useColorModeValue("gray.50", "gray.800")} borderRadius="lg" w="full">
      <Box as={icon} color="blue.500" boxSize={6} />
      <VStack align="start" spacing={0}>
        <Text fontSize="sm" color={mutedText}>{title}</Text>
        <Text fontWeight="medium" color={textColor}>{value}</Text>
      </VStack>
    </HStack>
  );

  return (
    <Flex minH="100vh" p={4} bg={useColorModeValue("gray.50", "gray.800")} justify="center">
      <Box w={{ base: "full", md: "90%", lg: "80%" }}>
        <Card bg={cardBg} p={0} overflow="hidden">
          {/* Cover Photo Section */}
          <Box position="relative" h="180px" mb="60px">
            <Image 
              src={MUConnect}
              alt="Cover Photo" 
              objectFit="cover" 
              w="full" 
              h="full"
            />
            
            {/* Profile navigation controls */}
            <Flex 
              position="absolute" 
              top={4} 
              left={4} 
              right={4}
              justify="space-between"
              zIndex={1}
            >
              <IconButton
                icon={<FiArrowLeft />}
                aria-label="Go back"
                onClick={handleGoBack}
                bg={useColorModeValue("white", "gray.800")}
                color={textColor}
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                boxShadow="md"
                title="Go back"
              />
            </Flex>
            
            {/* Avatar overlapping cover photo */}
            <Avatar 
              size="xl" 
              src={profile.avatar} 
              name={profile.name} 
              position="absolute"
              bottom="-40px"
              left={{ base: "50%", md: "40px" }}
              transform={{ base: "translateX(-50%)", md: "translateX(0)" }}
              boxShadow="lg"
              border="4px solid"
              borderColor={useColorModeValue("white", "gray.800")}
            />
          </Box>
          
          <Box px={{ base: 4, md: 6 }}>
            {/* Header section with name */}
            <Flex 
              justify={{ base: "center", md: "flex-start" }} 
              align="center" 
              mb={6} 
              mt={{ base: 5, md: 0 }}
            >
              <Heading size={{ base: "lg", md: "xl" }} color={textColor} textAlign={{ base: "center", md: "left" }}>
                {profile.name}
                {profile.verified && (
                  <Circle size="24px" bg="blue.500" color="white" display="inline-flex" alignItems="center" justifyContent="center" ml={2} verticalAlign="middle">
                    <FiCheck size="16px" />
                  </Circle>
                )}
              </Heading>
              
              {/* Username */}
              <Text color={mutedText} fontSize="md" ml={3}>@{profile.username}</Text>
            </Flex>
            
            {/* Role Badges */}
            <Flex mb={4} flexWrap="wrap" gap={2} justify={{ base: "center", md: "flex-start" }}>
              {profile.roles.map(role => (
                <Badge 
                  key={role}
                  colorScheme={role === "moderator" ? "purple" : 
                              role === "admin" ? "red" : "blue"}
                  textTransform="capitalize"
                >
                  {role}
                </Badge>
              ))}
            </Flex>

            {/* Email InfoBox */}
            {profile.email && (
              <InfoBox icon={FiMail} title="Email" value={profile.email} />
            )}
          </Box>
          
          {/* Bio Section */}
          <Box p={6} borderTop="1px solid" borderColor={useColorModeValue("gray.100", "gray.700")}>
            <Heading size="md" mb={4}>About</Heading>
            <Text color={textColor}>{profile.bio || 'No bio available.'}</Text>
          </Box>
          
          {/* Stats Grid */}
          <SimpleGrid 
            columns={{ base: 1, md: 3 }} 
            spacing={{ base: 3, md: 6 }}
            p={6}
            bg={cardBg}
            borderTop="1px solid"
            borderColor={useColorModeValue("gray.100", "gray.700")}
          >
            <VStack spacing={1} alignItems="flex-start">
              <HStack>
                <Icon as={FiBriefcase} color="blue.500" />
                <Text fontSize="sm" color={mutedText}>Major</Text>
              </HStack>
              <Text fontWeight="bold" fontSize="md">{profile.major}</Text>
            </VStack>
            
            <VStack spacing={1} alignItems="flex-start">
              <HStack>
                <Icon as={FiBookOpen} color="blue.500" />
                <Text fontSize="sm" color={mutedText}>Faculty</Text>
              </HStack>
              <Text fontWeight="bold" fontSize="md">{profile.faculty}</Text>
            </VStack>
            
            <VStack spacing={1} alignItems="flex-start">
              <HStack>
                <Icon as={FiCalendar} color="blue.500" />
                <Text fontSize="sm" color={mutedText}>Joined</Text>
              </HStack>
              <Text fontWeight="bold" fontSize="md">{new Date(profile.joinDate).toLocaleDateString()}</Text>
            </VStack>
          </SimpleGrid>
        </Card>
      </Box>
    </Flex>
  );
};

export default UserProfilePage;
