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
  Table, Thead, Tbody, Tr, Th, Td,
  Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Select,
} from "@chakra-ui/react";
import {
  FiEdit,
  FiSave,
  FiUpload,
  FiLogOut,
  FiArrowLeft,
  FiFileText,
  FiMessageSquare,
  FiX,
  FiUsers,
  FiCalendar,
  FiFlag,
  FiBookOpen,
  FiClock,
  FiActivity,
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiMoreVertical,
  FiUserCheck,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import MUConnect from "../assets/mu-connect.png";
import { getUserProfile, updateUserProfile } from "../services/profileService";
import { getUsers, toggleUserActive, updateUserRole } from "../services/userService";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { format } from 'date-fns';
import { createErrorToast, createSuccessToast, logError } from '../utils/errorHandler';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ProfilePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  // Store a copy of the profile before editing so we can revert on cancel without refetching
  const [originalProfile, setOriginalProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('role');
  const [activeTab, setActiveTab] = useState('overview');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [toast]);

  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
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
        setHasChanges(true);
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
      setHasChanges(false);
    } catch (error) {
      logError('handleSave', error);
      toast(createErrorToast(error, "There was an error updating your profile"));
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
      logError('fetchProfileData', error);
      toast(createErrorToast(error, "There was an error loading your profile data"));
      setLoading(false);
    }
  };

  const fetchUsers = async (term = '') => {
    try {
      setUsersLoading(true);
      const res = await getUsers(term);
      // API returns list in res.data or res.data.data depending on backend pagination
      const list = res.data ? res.data : res.data?.data || res.users || res;
      setUsers(list);
      setUsersLoading(false);
    } catch (error) {
      logError('fetchUsers', error);
      toast(createErrorToast(error, "There was an error loading the users list"));
      setUsersLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchUsers('');
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await toggleUserActive(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, is_active: res.is_active } : u)));
      toast({
        title: 'Updated',
        description: `User is now ${res.is_active ? 'active' : 'inactive'}.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.primary_role);
    onOpen();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      await updateUserRole(selectedUser.id, selectedRole);

      // Update the user in the local state
      setUsers((prev) => prev.map((u) => (
        u.id === selectedUser.id ? { ...u, primary_role: selectedRole } : u
      )));

      toast({
        title: 'Role Updated',
        description: `${selectedUser.username}'s role has been updated to ${selectedRole}.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
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
    { key: 'applications_total', label: "Applications", icon: FiBriefcase, value: analytics?.applications?.total || 0 },
  ];

  // Data for contribution chart
  const contributionData = {
    labels: ['Comments Made', 'Upvotes Given', 'Upvotes Received'],
    datasets: [
      {
        label: 'Contributions',
        data: [
          analytics?.contributions.comments_made || 0,
          analytics?.contributions.upvotes_given || 0,
          analytics?.contributions.upvotes_received || 0,
        ],
        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };

  const contributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Data for top posting users chart
  const topPostingUsersData = {
    labels: analytics?.charts?.top_posting_users?.map(user => user.username) || [],
    datasets: [
      {
        label: 'Resources Shared',
        data: analytics?.charts?.top_posting_users?.map(user => user.resources_count) || [],
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1,
      },
    ],
  };

  const topPostingUsersOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Resources Shared',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Username',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top Posting Users',
        font: {
          size: 18,
        },
      },
    },
  };

  // Data for top commenting users chart
  const topCommentingUsersData = {
    labels: analytics?.charts?.top_commenting_users?.map(user => user.username) || [],
    datasets: [
      {
        label: 'Comments Made',
        data: analytics?.charts?.top_commenting_users?.map(user => user.comments_count) || [],
        backgroundColor: '#2ecc71',
        borderColor: '#27ae60',
        borderWidth: 1,
      },
    ],
  };

  const topCommentingUsersOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Comments Made',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Username',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top Commenting Users',
        font: {
          size: 18,
        },
      },
    },
  };

  // Data for top upvoting users chart
  const topUpvotingUsersData = {
    labels: analytics?.charts?.top_upvoting_users?.map(user => user.username) || [],
    datasets: [
      {
        label: 'Upvotes Given',
        data: analytics?.charts?.top_upvoting_users?.map(user => user.upvotes_given) || [],
        backgroundColor: '#e74c3c',
        borderColor: '#c0392b',
        borderWidth: 1,
      },
    ],
  };

  const topUpvotingUsersOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Upvotes Given',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Username',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top Upvoting Users',
        font: {
          size: 18,
        },
      },
    },
  };

  // Data for top courses chart
  const topCoursesData = {
    labels: analytics?.charts?.top_courses?.map(course => course.code) || [],
    datasets: [
      {
        label: 'Resources Posted',
        data: analytics?.charts?.top_courses?.map(course => course.resources_count) || [],
        backgroundColor: '#f39c12',
        borderColor: '#d35400',
        borderWidth: 1,
      },
    ],
  };

  const topCoursesOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Resources Posted',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Course',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Top Courses',
        font: {
          size: 18,
        },
      },
    },
  };

  // Gamification hooks
  const getGamificationMessage = (topUserData = [], field, label) => {
    if (!profile) return '';
    const topValue = topUserData[0]?.[field] || 0;
    const currentUserRecord = topUserData.find(u => u.username === profile.username);
    const userValue = currentUserRecord ? currentUserRecord[field] : 0;
    const difference = topValue - userValue;
    if (difference > 0) {
      return `You're ${difference} ${label} away from the top spot!`;
    } else if (userValue === topValue && topValue !== 0) {
      return `You're the top ${label.toLowerCase()}!`;
    }
    return '';
  };

  const postingMessage = analytics?.charts ? getGamificationMessage(
    analytics?.charts.top_posting_users,
    'resources_count',
    'resources'
  ) : '';

  const commentingMessage = analytics?.charts ? getGamificationMessage(
    analytics?.charts.top_commenting_users,
    'comments_count',
    'comments'
  ) : '';

  const upvotingMessage = analytics?.charts ? getGamificationMessage(
    analytics?.charts.top_upvoting_users,
    'upvotes_given',
    'upvotes'
  ) : '';

  // Conditional badges
  const getBadges = (upvotesReceived) => {
    const badges = [];
    if (upvotesReceived >= 5) {
      badges.push({ name: 'Helpful', color: 'bg-green-100 text-green-800' });
    }
    if (upvotesReceived >= 10) {
      badges.push({ name: 'Insightful', color: 'bg-blue-100 text-blue-800' });
    }
    if (upvotesReceived >= 20) {
      badges.push({ name: 'Expert', color: 'bg-purple-100 text-purple-800' });
    }
    return badges;
  };

  const badges = getBadges(analytics?.contributions.upvotes_received || 0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers(searchTerm);
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <Flex height="100vh" width="100%" align="center" justify="center">
        <Spinner size="xl" />
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
              left={{ base: 2, md: 4 }} 
              right={{ base: 2, md: 4 }}
              justify="flex-start"
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
                size={{ base: "sm", md: "md" }}
              />
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
              flexWrap="wrap"
              gap={2}
            >
              <Heading size={{ base: "md", sm: "lg", md: "xl" }} color={textColor} textAlign={{ base: "center", md: "left" }}>
                {!isEditing && getFullName(profile)}
              </Heading>
              
              {/* Role Badge */}
              <Badge 
                ml={{ base: 0, sm: 3 }} 
                fontSize={{ base: "0.7em", md: "0.8em" }} 
                colorScheme={profile?.primary_role === "moderator" ? "purple" : 
                             profile?.primary_role === "admin" ? "red" : "blue"}
                textTransform="capitalize"
              >
                {profile?.primary_role || "Student"}
              </Badge>
            </Flex>
          </Box>

          <Box mx={{ base: 2, md: 6 }} mt={{ base: 0, md: 6 }}>
            {/* Tab Navigation */}
            <HStack 
              spacing={0} 
              mb={8} 
              borderBottom="1px solid" 
              borderColor="gray.200" 
              justify={{ base: "flex-start", md: "center" }}
              overflowX="auto"
              overflowY="hidden"
              css={{
                '&::-webkit-scrollbar': {
                  height: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: useColorModeValue('gray.300', 'gray.600'),
                  borderRadius: '2px',
                },
              }}
            >
              <Button
                variant={activeTab === 'overview' ? 'solid' : 'ghost'}
                borderRadius={0}
                borderBottom={activeTab === 'overview' ? '2px solid' : 'none'}
                borderColor="blue.500"
                color={activeTab === 'overview' ? 'blue.500' : 'gray.500'}
                onClick={() => handleTabChange('overview')}
                px={{ base: 3, sm: 4, md: 6 }}
                py={4}
                fontWeight="medium"
                textTransform="capitalize"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'activity' ? 'solid' : 'ghost'}
                borderRadius={0}
                borderBottom={activeTab === 'activity' ? '2px solid' : 'none'}
                borderColor="blue.500"
                color={activeTab === 'activity' ? 'blue.500' : 'gray.500'}
                onClick={() => handleTabChange('activity')}
                px={{ base: 3, sm: 4, md: 6 }}
                py={4}
                fontWeight="medium"
                textTransform="capitalize"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Activity
              </Button>
              {role === 'admin' && (
              <Button
                variant={activeTab === 'analytics' ? 'solid' : 'ghost'}
                borderRadius={0}
                borderBottom={activeTab === 'analytics' ? '2px solid' : 'none'}
                borderColor="blue.500"
                color={activeTab === 'analytics' ? 'blue.500' : 'gray.500'}
                onClick={() => handleTabChange('analytics')}
                px={{ base: 3, sm: 4, md: 6 }}
                py={4}
                fontWeight="medium"
                textTransform="capitalize"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                whiteSpace="nowrap"
                flexShrink={0}
              >
                Analytics
              </Button>
              )}
              {role === 'admin' && (
                <Button
                  variant={activeTab === 'users' ? 'solid' : 'ghost'}
                  borderRadius={0}
                  borderBottom={activeTab === 'users' ? '2px solid' : 'none'}
                  borderColor="blue.500"
                  color={activeTab === 'users' ? 'blue.500' : 'gray.500'}
                  onClick={() => handleTabChange('users')}
                  px={{ base: 3, sm: 4, md: 6 }}
                  py={4}
                  fontWeight="medium"
                  textTransform="capitalize"
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  whiteSpace="nowrap"
                  flexShrink={0}
                >
                  Users
                </Button>
              )}
            </HStack>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <VStack spacing={8} align="stretch">
                {/* Personal Information */}
                <Card p={6} shadow="md" bg={cardBg}>
                  <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
                    <Heading size="md" color={textColor}>Personal Information</Heading>
                    <Flex gap={2}>
                      {isEditing ? (
                        <>
                          <Button 
                            leftIcon={<FiSave />} 
                            colorScheme="green" 
                            onClick={handleSave}
                            size={{ base: "sm", md: "md" }}
                            fontSize={{ base: "xs", sm: "sm" }}
                            isDisabled={!hasChanges && !password}
                          >
                            Save
                          </Button>
                          <Button
                            colorScheme="red"
                            leftIcon={<FiX />}
                            onClick={() => {
                              if (originalProfile) {
                                setProfile(originalProfile);
                              }
                              setIsEditing(false);
                              setPassword("");
                              setHasChanges(false);
                            }}
                            size={{ base: "sm", md: "md" }}
                            fontSize={{ base: "xs", sm: "sm" }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          leftIcon={<FiEdit />}
                          colorScheme="blue"
                          onClick={() => {
                            setOriginalProfile(profile);
                            setIsEditing(true);
                            setHasChanges(false);
                          }}
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", sm: "sm" }}
                        >
                          Edit Profile
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                  {isEditing ? (
                    <Stack spacing={4}>
                      <FormControl>
                        <FormLabel>First Name</FormLabel>
                        <Input
                          name="first_name"
                          value={profile?.first_name || ''}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          name="last_name"
                          value={profile?.last_name || ''}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          value={profile?.email || ''}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          name="username"
                          value={profile?.username || ''}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                          name="bio"
                          value={profile?.bio || ''}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Password (leave blank to keep current)</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (e.target.value) setHasChanges(true);
                            }}
                            placeholder="Enter new password"
                          />
                          <InputRightElement>
                            <IconButton
                              h="1.75rem"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              icon={showPassword ? <FiEyeOff /> : <FiEye />}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  ) : (
                    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                      <Box>
                        <Text fontWeight="bold" color={mutedText}>First Name</Text>
                        <Text color={textColor}>{profile?.first_name || '-'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color={mutedText}>Last Name</Text>
                        <Text color={textColor}>{profile?.last_name || '-'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color={mutedText}>Email</Text>
                        <Text color={textColor}>{profile?.email || '-'}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" color={mutedText}>Username</Text>
                        <Text color={textColor}>{profile?.username || '-'}</Text>
                      </Box>
                      <Box gridColumn={{ md: 'span 2' }}>
                        <Text fontWeight="bold" color={mutedText}>Bio</Text>
                        <Text color={textColor}>{profile?.bio || 'No bio provided.'}</Text>
                      </Box>
                    </Grid>
                  )}
                </Card>

                {/* Academic Information */}
                <Card p={6} shadow="md" bg={cardBg}>
                  <Heading size="md" mb={4} color={textColor}>Academic Information</Heading>
                  <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                    <Box>
                      <Text fontWeight="bold" color={mutedText}>Faculty</Text>
                      <Text color={textColor}>{profile?.faculty?.name || 'Not specified'}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold" color={mutedText}>Major</Text>
                      <Text color={textColor}>{profile?.major?.name || 'Not specified'}</Text>
                    </Box>
                  </Grid>
                </Card>

                {/* Stats Cards */}
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
                  {statsItems.map((stat) => (
                    <Card
                      key={stat.key}
                      p={4}
                      shadow="sm"
                      bg={cardBg}
                      borderLeft="4px solid"
                      borderColor="blue.500"
                    >
                      <Flex align="center">
                        <Icon as={stat.icon} boxSize={6} color="blue.500" mr={3} />
                        <Box>
                          <Text fontSize="sm" color={mutedText}>{stat.label}</Text>
                          <Text fontSize="2xl" fontWeight="bold" color={textColor}>{stat.value}</Text>
                        </Box>
                      </Flex>
                    </Card>
                  ))}
                </SimpleGrid>

                {/* Contribution Chart */}
                <Card p={6} shadow="md" bg={cardBg}>
                  <Heading size="md" mb={4} color={textColor}>Contribution Mix</Heading>
                  <Box h="300px" w="100%" maxW="500px" mx="auto">
                    <Doughnut data={contributionData} options={contributionOptions} />
                  </Box>
                </Card>

                {/* Badges */}
                {badges.length > 0 && (
                  <Card p={6} shadow="md" bg={cardBg}>
                    <Heading size="md" mb={4} color={textColor}>Achievements</Heading>
                    <Flex flexWrap="wrap" gap={2}>
                      {badges.map((badge, index) => (
                        <Badge
                          key={index}
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="sm"
                          fontWeight="medium"
                          colorScheme={badge.color.split('-')[1]}
                        >
                          {badge.name}
                        </Badge>
                      ))}
                    </Flex>
                  </Card>
                )}

                {/* Gamification Messages */}
                <Card p={6} shadow="md" bgGradient={useColorModeValue("linear(to-r, blue.50, indigo.50)", "linear(to-r, blue.900, indigo.900)")}>
                  <Heading size="md" mb={4} color={textColor}>Community Standing</Heading>
                  <VStack align="start" spacing={2}>
                    {postingMessage && (
                      <Text color={useColorModeValue("blue.700", "blue.200")} fontWeight="medium">{postingMessage}</Text>
                    )}
                    {commentingMessage && (
                      <Text color={useColorModeValue("blue.700", "blue.200")} fontWeight="medium">{commentingMessage}</Text>
                    )}
                    {upvotingMessage && (
                      <Text color={useColorModeValue("blue.700", "blue.200")} fontWeight="medium">{upvotingMessage}</Text>
                    )}
                  </VStack>
                </Card>
              </VStack>
            )}

            {activeTab === 'users' && role === 'admin' && (
              <VStack spacing={8} align="stretch">
                <Card p={6} shadow="md" bg={cardBg}>
                  <Heading size="md" mb={4} color={textColor}>User Management</Heading>
                  <InputGroup mb={4} maxW={{ base: "100%", md: "400px" }} size={{ base: "sm", md: "md" }}>
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      bg={useColorModeValue('white', 'gray.700')}
                      fontSize={{ base: "xs", md: "sm" }}
                    />
                    <InputRightElement width={{ base: "6rem", md: "7rem" }} display="flex" justifyContent="flex-end" alignItems="center">
                      {searchTerm && (
                        <IconButton aria-label="Clear" icon={<FiX />} size="xs" mr={1} onClick={clearSearch} />
                      )}
                      <Button h="100%" size="xs" onClick={() => fetchUsers(searchTerm)} fontSize={{ base: "xs", sm: "sm" }}>
                        Search
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {usersLoading ? (
                    <Flex justify="center"><Spinner /></Flex>
                  ) : (
                    <Box overflowX="auto" overflowY="hidden" w="100%">
                      <Table variant="simple" size={{ base: "sm", md: "md" }}>
                        <Thead>
                          <Tr>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Username</Th>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Name</Th>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Email</Th>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Role</Th>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Status</Th>
                            <Th whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {users.map((u) => (
                            <Tr key={u.id}>
                              <Td whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>{u.username}</Td>
                              <Td whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>{`${u.first_name} ${u.last_name}`}</Td>
                              <Td whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>{u.email}</Td>
                              <Td textTransform="capitalize" whiteSpace="nowrap" fontSize={{ base: "xs", md: "sm" }}>{u.primary_role}</Td>
                              <Td whiteSpace="nowrap">
                                <Badge 
                                  colorScheme={u.is_active ? 'green' : 'red'}
                                  variant="solid"
                                  fontSize={{ base: "xs", md: "sm" }}
                                  px={2}
                                  py={1}
                                  borderRadius="md"
                                >
                                  {u.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </Td>
                              <Td whiteSpace="nowrap">
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    icon={<FiMoreVertical />}
                                    variant="ghost"
                                    size="sm"
                                    aria-label="Options"
                                  />
                                  <MenuList>
                                    <MenuItem 
                                      icon={<FiUserCheck />} 
                                      onClick={() => openRoleModal(u)}
                                      fontSize={{ base: "xs", md: "sm" }}
                                    >
                                      Update Role
                                    </MenuItem>
                                    <MenuDivider />
                                    <MenuItem 
                                      color={u.is_active ? 'red.500' : 'green.500'}
                                      onClick={() => handleToggleActive(u.id)}
                                      fontSize={{ base: "xs", md: "sm" }}
                                    >
                                      {u.is_active ? 'Deactivate User' : 'Activate User'}
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </Card>
              </VStack>
            )}

            {activeTab === 'activity' && (
              <VStack spacing={8} align="stretch">
                {/* Activity Timeline */}
                <Card p={6} shadow="md" bg={cardBg}>
                  <Heading size="md" mb={4} color={textColor}>Recent Activity</Heading>
                  <Box position="relative">
                    <Box position="absolute" left={{ base: "20px", md: "50%" }} transform={{ base: "none", md: "translateX(-50%)" }} h="100%" w="2px" bg="gray.200" />
                    {analytics?.activity && analytics.activity.length > 0 ? (
                      analytics.activity.map((activity, index) => {
                        const isLeft = index % 2 === 0;
                        const icon = activity.type === 'event_registration' ? FiCalendar : activity.type === 'study_group_join' ? FiUsers : FiActivity;
                        const color = activity.type === 'event_registration' ? 'blue' : activity.type === 'study_group_join' ? 'green' : 'purple';
                        return (
                          <Flex
                            key={index}
                            mb={8}
                            justify={{ base: "flex-start", md: "space-between" }}
                            align="center"
                            w="100%"
                            direction={{ base: "row", md: isLeft ? 'row-reverse' : 'row' }}
                            position="relative"
                            pl={{ base: "50px", md: 0 }}
                          >
                            <Box w={{ base: "100%", md: "45%" }} textAlign={{ base: "left", md: "center" }} p={3} borderRadius="lg" display={{ base: "none", md: "block" }}>
                              <Text fontWeight="medium" color={textColor} fontSize={{ base: "xs", md: "sm" }}>
                                {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
                              </Text>
                            </Box>
                            <Box
                              position="absolute"
                              left={{ base: "10px", md: "50%" }}
                              transform={{ base: "none", md: "translateX(-50%)" }}
                              w={{ base: 8, md: 10 }}
                              h={{ base: 8, md: 10 }}
                              borderRadius="full"
                              zIndex={10}
                              bg={`${color}.100`}
                              color={`${color}.600`}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              shadow="lg"
                              border="4px solid white"
                            >
                              <Icon as={icon} boxSize={{ base: 3, md: 4 }} />
                            </Box>
                            <Box w={{ base: "100%", md: "45%" }} bg={cardBg} p={{ base: 2, md: 3 }} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.100">
                              <Text fontWeight="medium" color={textColor} textTransform="capitalize" fontSize={{ base: "xs", md: "sm" }}>
                                {activity.type === 'event_registration' ? 'Event Registration' :
                                 activity.type === 'study_group_join' ? 'Joined Study Group' : 'Task Completed'}
                              </Text>
                              <Text fontSize={{ base: "xs", md: "sm" }} color={mutedText}>
                                {activity.type === 'event_registration' ? `Registered for an event` :
                                 activity.type === 'study_group_join' ? `Joined: ${activity.data.group_name}` : 'Completed a task'}
                              </Text>
                              <Text fontSize="xs" color={mutedText} mt={1} display={{ base: "block", md: "none" }}>
                                {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
                              </Text>
                            </Box>
                          </Flex>
                        );
                      })
                    ) : (
                      <Text color={mutedText} textAlign="center" py={4} fontSize={{ base: "xs", md: "sm" }}>No recent activity to display.</Text>
                    )}
                  </Box>
                </Card>
              </VStack>
            )}

            {activeTab === 'analytics' && role === 'admin' && analytics?.charts && (
              <VStack spacing={8} align="stretch">
                {/* Leaderboards */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card p={6} shadow="md" bg={cardBg} gridColumn={{ lg: role === 'admin' ? 'span 4' : 'span 3' }}>
                    <Heading size="md" mb={4} color={textColor}>Community Leaderboards</Heading>
                    <Text color={mutedText} mb={4}>Track your standing in the community based on your contributions.</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card p={4} shadow="sm" bg={cardBg} border="1px solid" borderColor="gray.100">
                        <Heading size="sm" mb={2} color={textColor}>Top Posters</Heading>
                        <Box h="400px" w="100%">
                          <Bar data={topPostingUsersData} options={topPostingUsersOptions} />
                        </Box>
                      </Card>
                      <Card p={4} shadow="sm" bg={cardBg} border="1px solid" borderColor="gray.100">
                        <Heading size="sm" mb={2} color={textColor}>Top Commenters</Heading>
                        <Box h="400px" w="100%">
                          <Bar data={topCommentingUsersData} options={topCommentingUsersOptions} />
                        </Box>
                      </Card>
                      <Card p={4} shadow="sm" bg={cardBg} border="1px solid" borderColor="gray.100">
                        <Heading size="sm" mb={2} color={textColor}>Top Upvoters</Heading>
                        <Box h="400px" w="100%">
                          <Bar data={topUpvotingUsersData} options={topUpvotingUsersOptions} />
                        </Box>
                      </Card>
                      {role === 'admin' && (
                        <Card p={4} shadow="sm" bg={cardBg} border="1px solid" borderColor="gray.100">
                          <Heading size="sm" mb={2} color={textColor}>Top Courses</Heading>
                          <Box h="400px" w="100%">
                            <Bar data={topCoursesData} options={topCoursesOptions} />
                          </Box>
                        </Card>
                      )}
                    </SimpleGrid>
                  </Card>
                </SimpleGrid>
              </VStack>
            )}
            
            {/* Role Update Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update User Role</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {selectedUser && (
                    <>
                      <Text mb={4}>
                        Update role for <strong>{selectedUser.username}</strong>
                      </Text>
                      <FormControl>
                        <FormLabel>Select Role</FormLabel>
                        <Select 
                          value={selectedRole} 
                          onChange={(e) => setSelectedRole(e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </FormControl>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleUpdateRole}>
                    Update Role
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default ProfilePage;