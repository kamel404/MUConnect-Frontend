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
      events: 5, // Placeholder: replace with dynamic count if available
      clubs: 3,  // Placeholder: replace with dynamic count if available
      resources: 12, // Placeholder: replace with dynamic count if available
    },
    badges: [
      { type: 'Top Contributor', color: 'blue' },
      { type: 'Frequent Poster', color: 'purple' }
    ],
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
    { key: "events", label: "Events Attended", icon: FiCalendar },
    { key: "clubs", label: "Clubs Joined", icon: FiFlag },
    { key: "resources", label: "Resources Downloaded", icon: FiBookOpen },
  ];

  return (
    <Flex minH="100vh" p={4} bg={useColorModeValue("gray.50", "gray.800")} justify="center">
      <Box w={{ base: "full", md: "90%", lg: "80%" }}>
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

          {/* Enhanced Analytics Dashboard */}
          <Box mt={10} mb={6} w="full">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" fontWeight="bold" color={textColor}>
                Your Analytics
              </Heading>
            </Flex>

            <SimpleGrid 
              columns={{ base: 1, sm: 2, md: 4 }} 
              spacing={5} 
              mb={8}
            >
              {/* Main stat cards - first row */}
              {statsItems.slice(0, 4).map((stat) => {
                const isHighlight = ['likes', 'contributions'].includes(stat.key);
                const statValue = profile.stats[stat.key];
                
                return (
                  <Box
                    key={stat.key}
                    position="relative"
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="lg"
                    boxShadow={isHighlight ? 
                      `0 4px 20px rgba(66, 153, 225, 0.15)` : 
                      useColorModeValue('sm', 'dark-lg')
                    }
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor={isHighlight ? 'blue.200' : useColorModeValue('gray.200', 'gray.700')}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-5px)',
                      boxShadow: 'lg'
                    }}
                  >
                    {/* Colored top border */}
                    <Box 
                      h="4px" 
                      bg={isHighlight ? 'blue.400' : 
                        stat.key === 'posts' ? 'purple.400' :
                        stat.key === 'followers' ? 'teal.400' : 'gray.400'} 
                      w="full"
                    />
                    
                    <Flex p={4} direction="column">
                      <Flex justify="space-between" align="flex-start" mb={3}>
                        <Box
                          p={2}
                          borderRadius="md"
                          bg={isHighlight ? 'blue.50' : 
                            stat.key === 'posts' ? 'purple.50' :
                            stat.key === 'followers' ? 'teal.50' : 'gray.100'}
                          color={isHighlight ? 'blue.500' : 
                            stat.key === 'posts' ? 'purple.500' :
                            stat.key === 'followers' ? 'teal.500' : 'gray.500'}
                        >
                          <Icon as={stat.icon} boxSize={5} />
                        </Box>

                      </Flex>
                      
                      <Text 
                        fontSize="xs" 
                        fontWeight="medium" 
                        color={mutedText}
                        textTransform="uppercase"
                        letterSpacing="wide"
                        mb={1}
                      >
                        {stat.label}
                      </Text>
                      
                      <Text 
                        fontSize="2xl" 
                        fontWeight="bold" 
                        color={textColor}
                        lineHeight="1"
                      >
                        {statValue.toLocaleString()}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </SimpleGrid>

            {/* User badges section */}
            <Flex direction="column" mb={6}>
              <Flex align="center" mb={3}>
                <Heading size="sm" fontWeight="medium" color={mutedText}>
                  Achievement Badges
                </Heading>
                <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} ml={4} />
              </Flex>
              
              <Flex gap={3} wrap="wrap">
                {profile.badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    colorScheme={badge.color}
                    variant="subtle"
                    py={2}
                    px={3}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="medium"
                    display="flex"
                    alignItems="center"
                    boxShadow="sm"
                  >
                    <Box 
                      as="span" 
                      bg={`${badge.color}.100`} 
                      color={`${badge.color}.700`}
                      p={1}
                      borderRadius="full"
                      mr={2}
                      fontSize="xs"
                    >
                      ★
                    </Box>
                    {badge.type}
                  </Badge>
                ))}
              </Flex>
            </Flex>
            
            {/* Section divider */}
            <Flex align="center" mb={6}>
              <Heading size="sm" fontWeight="medium" color={mutedText}>
                Campus Engagement
              </Heading>
              <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} ml={4} />
            </Flex>

            {/* Interactive Section - Second Row */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {statsItems.slice(4).map((stat) => {
                const isClickable = ['events', 'clubs', 'resources'].includes(stat.key);
                const statValue = profile.stats[stat.key];
                
                return (
                  <Flex
                    key={stat.key}
                    p={4}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    bg={useColorModeValue('white', 'gray.800')}
                    align="center"
                    transition="all 0.2s"
                    cursor={isClickable ? 'pointer' : 'default'}
                    _hover={isClickable ? {
                      bg: useColorModeValue('gray.50', 'gray.700'),
                      transform: 'translateY(-2px)',
                      boxShadow: 'md'
                    } : {}}
                    onClick={() => {
                      if (stat.key === 'events') navigate('/events');
                      if (stat.key === 'clubs') navigate('/clubs');
                      if (stat.key === 'resources') navigate('/resources');
                    }}
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Background gradient stripe for visual interest */}
                    {stat.key === 'events' && (
                      <Box
                        position="absolute"
                        right="-10px"
                        top="-20px"
                        w="100px"
                        h="100px"
                        bg="blue.400"
                        opacity="0.1"
                        borderRadius="full"
                        zIndex="0"
                      />
                    )}
                    
                    <Flex 
                      align="center" 
                      justify="center"
                      bg={stat.key === 'events' ? 'blue.100' : 
                         stat.key === 'clubs' ? 'green.100' : 'orange.100'}
                      borderRadius="full"
                      p={3}
                      mr={4}
                      zIndex="1"
                    >
                      <Icon 
                        as={stat.icon} 
                        boxSize={5} 
                        color={stat.key === 'events' ? 'blue.600' : 
                               stat.key === 'clubs' ? 'green.600' : 'orange.600'} 
                      />
                    </Flex>
                    
                    <Box zIndex="1" flex="1">
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium" color={textColor}>
                          {stat.label}
                        </Text>
                        <Text 
                          fontSize="xl" 
                          fontWeight="bold" 
                          color={stat.key === 'events' ? 'blue.500' : 
                                 stat.key === 'clubs' ? 'green.500' : 'orange.500'}
                        >
                          {statValue}
                        </Text>
                      </Flex>
                      
                      {isClickable && (
                        <Text fontSize="xs" color={mutedText} mt={1}>
                          Click to view all
                        </Text>
                      )}
                    </Box>
                    
                    {stat.key === 'events' && (
                      <Badge
                        position="absolute"
                        top={3}
                        right={3}
                        colorScheme="blue"
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        zIndex="1"
                        display="flex"
                        alignItems="center"
                      >
                        <Box 
                          as="span" 
                          bg="blue.100" 
                          color="blue.700"
                          p={1}
                          borderRadius="full"
                          mr={1}
                          fontSize="xx-small"
                        >
                          ★
                        </Box>
                        Top Contributor
                      </Badge>
                    )}
                  </Flex>
                );
              })}
            </SimpleGrid>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default ProfilePage;