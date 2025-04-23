import {
  Flex,
  Box,
  Heading,
  Text,
  Avatar,
  Input,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
  IconButton,
  Grid,
  Badge,
  Card,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  FiEdit,
  FiSave,
  FiUpload,
  FiLogOut,
  FiArrowLeft,
  FiFileText,
  FiMessageSquare,
  FiHeart,
  FiUsers,
  FiCalendar,
  FiFlag,
  FiBookOpen,
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ahmed Ali",
    email: "ahmed.ali@university.edu",
    bio: "Computer Science Senior | AI Enthusiast | Open Source Contributor",
    major: "Computer Science",
    year: "Senior",
    avatar: "https://bit.ly/dan-abramov",
    stats: {
      posts: 24,
      contributions: 89,
      likes: 432,
      followers: 56,
      events: 5, // Placeholder: replace with dynamic count if available
      clubs: 3,  // Placeholder: replace with dynamic count if available
      resources: 12, // Placeholder: replace with dynamic count if available
    },
  });

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleGoBack = () => {
    if (
      isEditing &&
      !window.confirm("Are you sure you want to leave? Your changes will be lost.")
    ) {
      return;
    }
    navigate(-1);
  };

  // Stats configuration
  const statsItems = [
    { key: "posts", label: "Posts Created", icon: FiFileText },
    { key: "contributions", label: "Contributions", icon: FiMessageSquare },
    { key: "likes", label: "Likes Received", icon: FiHeart },
    { key: "followers", label: "Followers", icon: FiUsers },
    { key: "events", label: "Events Attended", icon: FiCalendar },
    { key: "clubs", label: "Clubs Joined", icon: FiFlag },
    { key: "resources", label: "Resources Downloaded", icon: FiBookOpen },
  ];

  return (
    <Flex minH="100vh" p={4} bg={useColorModeValue("gray.50", "gray.800")} justify="center">
      <Box w={{ base: "full", md: "80%", lg: "60%" }}>
        <Card bg={cardBg} p={{ base: 4, md: 6 }}>
          {/* Header with Back Button */}
          <Flex justify="space-between" align="center" mb={6} flexWrap="wrap">
            <Flex align="center" gap={4} flexWrap="wrap">
              <IconButton
                icon={<FiArrowLeft />}
                aria-label="Go back"
                onClick={handleGoBack}
                variant="ghost"
                title="Go back"
              />
              <Heading size={{ base: "lg", md: "xl" }} color={textColor}>
                Profile
              </Heading>
            </Flex>
            <Flex gap={2} flexWrap="wrap">
              {isEditing ? (
                <Button leftIcon={<FiSave />} colorScheme="blue" onClick={handleSave}>
                  Save Changes
                </Button>
              ) : (
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="blue"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
              <Button leftIcon={<FiLogOut />} variant="outline">
                Logout
              </Button>
            </Flex>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={6}>
            {/* Avatar Section */}
            <Box textAlign="center">
              <Box position="relative" mb={4}>
                <Avatar size="2xl" src={profile.avatar} name={profile.name} mb={4} />
                {isEditing && (
                  <IconButton
                    as="label"
                    position="absolute"
                    bottom={2}
                    right={2}
                    colorScheme="blue"
                    rounded="full"
                    cursor="pointer"
                    htmlFor="avatar-upload"
                  >
                    <FiUpload />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                  </IconButton>
                )}
              </Box>
              {!isEditing && (
                <Heading size="md" color={textColor}>
                  {profile.name}
                </Heading>
              )}
            </Box>

            {/* Profile Form */}
            <Stack spacing={4}>
              {isEditing ? (
                <>
                  <FormControl>
                    <FormLabel color={mutedText}>Full Name</FormLabel>
                    <Input name="name" value={profile.name} onChange={handleInputChange} />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={mutedText}>Email</FormLabel>
                    <Input name="email" type="email" value={profile.email} onChange={handleInputChange} />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={mutedText}>Major</FormLabel>
                    <Input name="major" value={profile.major} onChange={handleInputChange} />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={mutedText}>Academic Year</FormLabel>
                    <Input name="year" value={profile.year} onChange={handleInputChange} />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={mutedText}>Bio</FormLabel>
                    <Textarea name="bio" value={profile.bio} onChange={handleInputChange} rows={4} />
                  </FormControl>
                </>
              ) : (
                <>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {profile.name}
                    </Text>
                    <Text color={mutedText}>{profile.email}</Text>
                  </Box>

                  <Box>
                    <Text color={textColor}>{profile.bio}</Text>
                    <Flex gap={3} mt={2} flexWrap="wrap">
                      <Badge colorScheme="blue" fontSize="sm" p={2}>
                        {profile.major}
                      </Badge>
                      <Badge colorScheme="green" fontSize="sm" p={2}>
                        {profile.year}
                      </Badge>
                    </Flex>
                  </Box>
                </>
              )}
            </Stack>
          </Grid>

          {/* Modern Stat Bar Dashboard */}
          <Box
            mt={10}
            mb={4}
            px={{ base: 0, md: 2 }}
            overflowX={{ base: 'auto', md: 'visible' }}
            w="full"
          >
            <Flex
              gap={4}
              direction={{ base: 'row', md: 'row' }}
              wrap={{ base: 'nowrap', md: 'wrap' }}
              justify={{ base: 'flex-start', md: 'center' }}
              align="stretch"
              pb={2}
              style={{ scrollbarWidth: 'none' }}
              sx={{ '::-webkit-scrollbar': { display: 'none' } }}
            >
              {statsItems.map((stat, idx) => (
                <Box
                  key={stat.key}
                  minW={{ base: '180px', md: '200px' }}
                  flexShrink={0}
                  bg={stat.key === 'events' ? 'blue.500' : useColorModeValue('whiteAlpha.700', 'gray.700')}
                  color={stat.key === 'events' ? 'white' : textColor}
                  borderRadius="3xl"
                  boxShadow="0 6px 32px 0 rgba(30, 64, 175, 0.10)"
                  backdropFilter="blur(8px)"
                  borderWidth={stat.key === 'events' ? '2px' : '1px'}
                  borderColor={stat.key === 'events' ? 'blue.700' : useColorModeValue('gray.200', 'gray.600')}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  py={6}
                  px={4}
                  transition="all 0.18s"
                  cursor={['events','clubs','resources'].includes(stat.key) ? 'pointer' : 'default'}
                  _hover={['events','clubs','resources'].includes(stat.key) ? { transform: 'scale(1.06)', boxShadow: '0 10px 40px 0 rgba(30, 64, 175, 0.18)' } : {}}
                  onClick={() => {
                    if (stat.key === 'events') navigate('/events');
                    if (stat.key === 'clubs') navigate('/clubs');
                    if (stat.key === 'resources') navigate('/resources');
                  }}
                  position="relative"
                >
                  <Box
                    bg={stat.key === 'events' ? 'whiteAlpha.200' : useColorModeValue('blue.100', 'blue.900')}
                    borderRadius="full"
                    p={3}
                    mb={2}
                    boxShadow={stat.key === 'events' ? '0 0 0 4px rgba(255,255,255,0.07)' : 'none'}
                  >
                    <Icon as={stat.icon} boxSize={8} color={stat.key === 'events' ? 'white' : 'blue.500'} />
                  </Box>
                  <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="extrabold" mb={1}>
                    {profile.stats[stat.key]}
                  </Text>
                  <Text fontSize="sm" opacity={0.8} fontWeight="medium" textAlign="center">
                    {stat.label}
                  </Text>
                  {stat.key === 'events' && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme="yellow"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      Most Active
                    </Badge>
                  )}
                </Box>
              ))}
            </Flex>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default ProfilePage;