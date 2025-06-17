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
  Card,
  SimpleGrid,
  Icon,
  Container,
  Image,
  Divider,
  HStack,
  VStack,
  Spinner,
  useToast,
  Badge,
  InputGroup,
  InputRightElement,
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
  FiClock,
  FiActivity,
  FiBriefcase,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { getUserProfile, updateUserProfile } from "../services/profileService";

const ProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, [toast]);

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
        // Update the local state for preview with the data URL
        // This will be detected by getAvatarUrl and used for display
        setProfile((prev) => ({ 
          ...prev, 
          avatar: reader.result,
          // Store the file for actual upload when saving
          avatarFile: file 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Format the data for the update API
      const updateData = {
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        bio: profile.bio,
      };
      
      // Only include password if it's been changed
      if (password) {
        updateData.password = password;
      }
      
      // Include the avatar file if it exists
      if (profile.avatarFile) {
        updateData.avatarFile = profile.avatarFile;
      }
      
      await updateUserProfile(profile.id, updateData);
      
      // After a successful update, refetch profile data to get new avatar_url
      await fetchProfileData();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Reset password field
      setPassword("");
      setIsEditing(false);
    } catch (error) {
      let errorMessage = "There was an error updating your profile.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Update failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoBack = () => {
    if (
      isEditing &&
      !window.confirm("Are you sure you want to leave? Your changes will be lost.")
    ) {
      return;
    }
    // Reset editing state
    if (isEditing) {
      setIsEditing(false);
      setPassword("");
      // Reset any profile changes by refetching data
      fetchProfileData();
    } else {
      navigate(-1);
    }
  };
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data.user);
      setAnalytics(data.analytics);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "There was an error loading your profile data.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  // Get the avatar URL with proper path
  const getAvatarUrl = (user) => {
    if (!user) return null;
    
    // If the user has uploaded a temp avatar during editing (base64 data URL)
    if (user.avatar && user.avatar.startsWith('data:')) {
      return user.avatar;
    }
    
    // Use the avatar_url provided by the API
    return user.avatar_url || null;
  };

  // Format full name
  const getFullName = (user) => {
    if (!user) return '';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };

  // Stats configuration
  const statsItems = [
    { key: 'resources_shared', label: "Resources Shared", icon: FiFileText, value: analytics?.resources?.shared || 0 },
    { key: 'study_groups_total', label: "Study Groups", icon: FiUsers, value: analytics?.study_groups?.total || 0 },
    { key: 'events_registered', label: "Events Registered", icon: FiCalendar, value: analytics?.events?.registered || 0 },
    { key: 'events_upcoming', label: "Upcoming Events", icon: FiClock, value: analytics?.events?.upcoming || 0 },
  ];

  if (loading) {
    return (
      <Flex height="100vh" width="100%" align="center" justify="center">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" p={4} bg={useColorModeValue("gray.50", "gray.800")} justify="center">
      <Box w={{ base: "full", md: "90%", lg: "80%" }}>
        <Card bg={cardBg} p={0} overflow="hidden">
          {/* Cover Photo Section */}
          <Box position="relative" h="180px" mb="60px">
            <Image 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
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
              
              <Flex gap={2} flexWrap="wrap">
                {isEditing ? (
                  <>
                    <Button 
                      leftIcon={<FiSave />} 
                      colorScheme="blue" 
                      onClick={handleSave}
                      boxShadow="md"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setPassword("");
                        fetchProfileData();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    onClick={() => setIsEditing(true)}
                    boxShadow="md"
                  >
                    Edit Profile
                  </Button>
                )}
                <Button 
                  leftIcon={<FiLogOut />} 
                  variant="solid"
                  bg={useColorModeValue("white", "gray.800")}
                  color={textColor}
                  _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  boxShadow="md"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </Button>
              </Flex>
            </Flex>
            
            {/* Avatar overlapping cover photo */}
            {isEditing ? (
              <Box 
                position="absolute"
                bottom="-40px"
                left={{ base: "50%", md: "40px" }}
                transform={{ base: "translateX(-50%)", md: "translateX(0)" }}
                cursor="pointer"
              >
                <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                  <Avatar 
                    size="xl" 
                    src={getAvatarUrl(profile)} 
                    name={getFullName(profile)} 
                    boxShadow="lg"
                    border="4px solid"
                    borderColor={useColorModeValue("white", "gray.800")}
                    _hover={{ 
                      opacity: 0.8,
                      boxShadow: "xl" 
                    }}
                  />
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="rgba(0,0,0,0.3)"
                    color="white"
                    borderRadius="full"
                    p={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FiUpload />
                  </Box>
                  <input
                    type="file"
                    id="avatar-upload"
                    name="avatar"
                    accept="image/jpeg,image/png,image/gif"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                </label>
              </Box>
            ) : (
              <Avatar 
                size="xl" 
                src={getAvatarUrl(profile)} 
                name={getFullName(profile)} 
                position="absolute"
                bottom="-40px"
                left={{ base: "50%", md: "40px" }}
                transform={{ base: "translateX(-50%)", md: "translateX(0)" }}
                boxShadow="lg"
                border="4px solid"
                borderColor={useColorModeValue("white", "gray.800")}
              />
            )}
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
                {!isEditing && getFullName(profile)}
              </Heading>
              
              {/* Role Badge */}
              <Badge 
                ml={3} 
                fontSize="0.8em" 
                colorScheme={profile?.primary_role === "moderator" ? "purple" : 
                             profile?.primary_role === "admin" ? "red" : "blue"}
                textTransform="capitalize"
              >
                {profile?.primary_role || "Student"}
              </Badge>
            </Flex>
          </Box>
          
          <Box mx={{ base: 2, md: 6 }} mt={{ base: 0, md: 6 }}>
            <Grid templateColumns={{ base: "1fr", md: "1fr" }} gap={6}>
              {/* Profile Form */}
              <Stack spacing={4}>
                {isEditing ? (
                  <>
                    <FormControl>
                      <FormLabel color={mutedText}>Username</FormLabel>
                      <Input name="username" value={profile?.username || ''} onChange={handleInputChange} />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel color={mutedText}>First Name</FormLabel>
                      <Input name="first_name" value={profile?.first_name || ''} onChange={handleInputChange} />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={mutedText}>Last Name</FormLabel>
                      <Input name="last_name" value={profile?.last_name || ''} onChange={handleInputChange} />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={mutedText}>Email</FormLabel>
                      <Input 
                        name="email" 
                        type="email" 
                        value={profile?.email || ''} 
                        onChange={handleInputChange} 
                        helperText="Must end with @mu.edu.lb"
                      />
                      <Text fontSize="xs" color={mutedText} mt={1}>
                        Email must end with @mu.edu.lb domain
                      </Text>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel color={mutedText}>Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Leave blank to keep current password"
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <Text fontSize="xs" color={mutedText} mt={1}>
                        Minimum 6 characters
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={mutedText}>Bio</FormLabel>
                      <Textarea name="bio" value={profile?.bio || ''} onChange={handleInputChange} rows={4} />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {getFullName(profile)}
                      </Text>
                      <Text color={mutedText}>{profile?.email}</Text>
                      <Text color={mutedText} fontSize="sm" mt={1}>
                        Username: @{profile?.username}
                      </Text>
                    </Box>

                    <Box>
                      <Text color={textColor} mb={2}>{profile?.bio}</Text>
                      <Flex gap={4} mt={3} flexWrap="wrap">
                        {profile?.faculty && (
                          <Box p={2} bg={useColorModeValue("purple.50", "purple.900")} borderRadius="md" color={useColorModeValue("purple.600", "purple.200")} fontWeight="medium" fontSize="sm">
                            {profile.faculty.name}
                          </Box>
                        )}
                        {profile?.major && (
                          <Box p={2} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md" color={useColorModeValue("blue.600", "blue.200")} fontWeight="medium" fontSize="sm">
                            {profile.major.name}
                          </Box>
                        )}
                      </Flex>
                    </Box>
                  </>
                )}
              </Stack>
            </Grid>
          </Box>

          {/* Enhanced Analytics Dashboard */}
          <Box mt={10} mb={6} w="full" px={{ base: 4, md: 6 }}>
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
              {statsItems.map((stat, index) => {
                const isHighlight = index < 2;
                
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
                        index === 2 ? 'green.400' :
                        index === 3 ? 'orange.400' : 'gray.400'} 
                      w="full"
                    />
                    
                    <Flex p={4} direction="column">
                      <Flex justify="space-between" align="flex-start" mb={3}>
                        <Box
                          p={2}
                          borderRadius="md"
                          bg={isHighlight ? 'blue.50' : 
                            index === 2 ? 'green.50' :
                            index === 3 ? 'orange.50' : 'gray.100'}
                          color={isHighlight ? 'blue.500' : 
                            index === 2 ? 'green.500' :
                            index === 3 ? 'orange.500' : 'gray.500'}
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
                        {stat.value.toLocaleString()}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </SimpleGrid>
            
            {/* Section divider */}
            <Flex align="center" mb={6}>
              <Heading size="sm" fontWeight="medium" color={mutedText}>
                Campus Engagement
              </Heading>
              <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} ml={4} />
            </Flex>

            {/* Interactive Section - Campus Engagement Section */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
              {/* Study Groups */}
              <Flex
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                bg={useColorModeValue('white', 'gray.800')}
                align="center"
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.700'),
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                onClick={() => navigate('/study-groups')}
                position="relative"
                overflow="hidden"
              >
                <Flex 
                  align="center" 
                  justify="center"
                  bg="blue.100"
                  borderRadius="full"
                  p={3}
                  mr={4}
                  zIndex="1"
                >
                  <Icon as={FiUsers} boxSize={5} color="blue.600" />
                </Flex>
                
                <Box zIndex="1" flex="1">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" color={textColor}>
                      Study Groups
                    </Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color="blue.500"
                    >
                      {analytics?.study_groups?.total || 0}
                    </Text>
                  </Flex>
                  
                  <Text fontSize="xs" color={mutedText} mt={1}>
                    Leading: {analytics?.study_groups?.leading || 0}
                  </Text>
                </Box>
              </Flex>
              
              {/* Clubs */}
              <Flex
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                bg={useColorModeValue('white', 'gray.800')}
                align="center"
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.700'),
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                onClick={() => navigate('/clubs')}
                position="relative"
                overflow="hidden"
              >
                <Flex 
                  align="center" 
                  justify="center"
                  bg="green.100" 
                  borderRadius="full"
                  p={3}
                  mr={4}
                  zIndex="1"
                >
                  <Icon as={FiFlag} boxSize={5} color="green.600" />
                </Flex>
                
                <Box zIndex="1" flex="1">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" color={textColor}>
                      Clubs
                    </Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color="green.500"
                    >
                      {analytics?.clubs?.joined || 0}
                    </Text>
                  </Flex>
                  
                  <Text fontSize="xs" color={mutedText} mt={1}>
                    Click to view all
                  </Text>
                </Box>
              </Flex>
              
              {/* Resources */}
              <Flex
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                bg={useColorModeValue('white', 'gray.800')}
                align="center"
                transition="all 0.2s"
                cursor="pointer"
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.700'),
                  transform: 'translateY(-2px)',
                  boxShadow: 'md'
                }}
                onClick={() => navigate('/resources')}
                position="relative"
                overflow="hidden"
              >
                <Flex 
                  align="center" 
                  justify="center"
                  bg="orange.100"
                  borderRadius="full"
                  p={3}
                  mr={4}
                  zIndex="1"
                >
                  <Icon as={FiBookOpen} boxSize={5} color="orange.600" />
                </Flex>
                
                <Box zIndex="1" flex="1">
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" color={textColor}>
                      Resources
                    </Text>
                    <Text 
                      fontSize="xl" 
                      fontWeight="bold" 
                      color="orange.500"
                    >
                      {analytics?.resources?.shared || 0}
                    </Text>
                  </Flex>
                  
                  <Text fontSize="xs" color={mutedText} mt={1}>
                    Shared resources
                  </Text>
                </Box>
              </Flex>
            </SimpleGrid>

            {/* Section divider */}
            <Flex align="center" my={6}>
              <Heading size="sm" fontWeight="medium" color={mutedText}>
                Recent Activity
              </Heading>
              <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} ml={4} />
            </Flex>

            {/* Activity Timeline */}
            {analytics?.activity && analytics.activity.length > 0 ? (
              <VStack spacing={4} align="stretch" px={{ base: 2, md: 4 }} pb={6}>
                {analytics.activity.map((activity, index) => {
                  // Format the date
                  const activityDate = new Date(activity.date);
                  const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(activityDate);

                  // Determine activity type icon and color
                  let activityIcon = FiActivity;
                  let activityColor = "blue";
                  let activityTitle = "Activity";
                  
                  if (activity.type === "event_registration") {
                    activityIcon = FiCalendar;
                    activityColor = "purple";
                    activityTitle = "Registered for an event";
                  } else if (activity.type === "study_group_join") {
                    activityIcon = FiUsers;
                    activityColor = "green";
                    activityTitle = "Joined study group";
                  }

                  return (
                    <Flex 
                      key={index}
                      p={4}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={useColorModeValue('gray.200', 'gray.700')}
                      align="center"
                      bg={useColorModeValue(`${activityColor}.50`, `${activityColor}.900`)}
                    >
                      <Box
                        p={2}
                        borderRadius="full"
                        bg={useColorModeValue(`${activityColor}.100`, `${activityColor}.800`)}
                        color={useColorModeValue(`${activityColor}.600`, `${activityColor}.200`)}
                        mr={4}
                      >
                        <Icon as={activityIcon} boxSize={5} />
                      </Box>
                      
                      <Box flex="1">
                        <Text fontWeight="medium" color={textColor}>
                          {activityTitle}
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          {activity.type === "study_group_join" && `"${activity.data.group_name}"`}
                          {activity.type === "event_registration" && "Event"}
                        </Text>
                      </Box>
                      
                      <Text 
                        fontSize="sm" 
                        color={mutedText}
                        fontWeight="medium"
                      >
                        {formattedDate}
                      </Text>
                    </Flex>
                  );
                })}
              </VStack>
            ) : (
              <Box
                p={6}
                textAlign="center"
                borderRadius="md"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                bg={useColorModeValue('gray.50', 'gray.800')}
                mb={6}
                mx={4}
              >
                <Icon as={FiActivity} boxSize={10} color={mutedText} mb={4} />
                <Text color={textColor} fontWeight="medium">
                  No activity recorded yet
                </Text>
                <Text color={mutedText} fontSize="sm" mt={1}>
                  Your recent activities will appear here
                </Text>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default ProfilePage;