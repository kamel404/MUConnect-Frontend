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
  Circle
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
          avatar: data.avatar ? `${API_BASE_URL}/storage/${data.avatar}` : DEFAULT_AVATAR,
          coverPhoto: data.cover_photo_url || 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=2070',
          sharedResources: data.shared_resources || [],
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
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box height="250px" bg="gray.300" borderRadius="lg" />
          <HStack spacing={-16} ml={8}>
            <Box width="150px" height="150px" borderRadius="full" bg="gray.300" border="4px solid white" />
            <VStack align="start" spacing={2} pt={20} pl={20}>
              <Box height="30px" width="200px" bg="gray.300" borderRadius="md" />
              <Box height="20px" width="150px" bg="gray.300" borderRadius="md" />
            </VStack>
          </HStack>
        </VStack>
      </Container>
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
    <Box bg={bgColor} minH="100vh">
      <IconButton icon={<FiArrowLeft />} onClick={handleGoBack} aria-label="Go back" m={4} variant="ghost" size="lg" isRound />
      <Box maxW="container.xl" mx="auto" px={{ base: 2, md: 4 }} pb={10}>
        <Box
          h={{ base: '150px', md: '250px' }}
          bgImage={`url(${profile.coverPhoto})`}
          bgSize="cover"
          bgPosition="center"
          borderRadius={{ base: 0, md: 'xl' }}
        />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          mx={{ base: 4, md: 8 }}
          mt={{ base: -16, md: -20 }}
          align={{ base: 'center', md: 'flex-end' }}
        >
          <Avatar
            size="2xl"
            name={profile.name}
            src={profile.avatar}
            borderWidth="4px"
            borderColor={bgColor}
          />
          <VStack align={{ base: 'center', md: 'start' }} spacing={1} ml={{ md: 6 }} mt={{ base: 4, md: 0 }}>
            <HStack align="center">
              <Heading as="h1" size="lg" color={textColor}>{profile.name}</Heading>
              {profile.verified && (
                <Circle size="24px" bg="blue.500" color="white" display="flex" alignItems="center" justifyContent="center">
                  <FiCheck size="16px" />
                </Circle>
              )}
            </HStack>
            <Text color={mutedText} fontSize="lg">@{profile.username}</Text>
            <HStack spacing={2} pt={1}>
              {profile.roles.map(role => (
                <Badge key={role} colorScheme="teal" variant="subtle" textTransform="capitalize">{role}</Badge>
              ))}
            </HStack>
          </VStack>
        </Flex>

        <Tabs isLazy variant="soft-rounded" colorScheme="blue" mt={8}>
          <TabList mx={{ base: 2, md: 8 }}>
            <Tab>Overview</Tab>
            <Tab>Shared Resources ({profile.sharedResources.length})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <VStack spacing={6} align="start">
                  <Box bg={cardBg} p={6} borderRadius="xl" w="full">
                    <Heading size="md" mb={4}>About</Heading>
                    <Text color={textColor}>{profile.bio || 'No bio available.'}</Text>
                  </Box>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <InfoBox icon={FiBriefcase} title="Major" value={profile.major} />
                    <InfoBox icon={FiBookOpen} title="Faculty" value={profile.faculty} />
                    <InfoBox icon={FiMail} title="Email" value={profile.email} />
                    <InfoBox icon={FiCalendar} title="Joined" value={new Date(profile.joinDate).toLocaleDateString()} />
                  </SimpleGrid>
                </VStack>
              </MotionBox>
            </TabPanel>
            <TabPanel>
              <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {profile.sharedResources?.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {profile.sharedResources.map((resource, index) => (
                      <MotionBox
                        key={index}
                        p={4}
                        bg={cardBg}
                        borderRadius="lg"
                        whileHover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                        cursor="pointer"
                        onClick={() => navigate(`/resources/${resource.id}`)}
                      >
                        <Text fontWeight="bold">{resource.title}</Text>
                        <Text fontSize="sm" color={mutedText}>{resource.description}</Text>
                      </MotionBox>
                    ))}
                  </VStack>
                ) : (
                  <VStack py={10} spacing={4}>
                    <Box as={FiBookOpen} boxSize={10} color={mutedText} />
                    <Text color={mutedText}>No resources shared by this user yet.</Text>
                  </VStack>
                )}
              </MotionBox>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
