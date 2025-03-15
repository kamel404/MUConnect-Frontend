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

          {/* Stats Panel */}
          <Box mt={8}>
            <Heading size="md" mb={4} color={textColor}>
              Activity Stats
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {statsItems.map((stat) => (
                <Card
                  key={stat.key}
                  p={4}
                  bg={cardBg}
                  boxShadow="sm"
                  _hover={{ boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  <Flex align="center">
                    <Icon as={stat.icon} boxSize={6} color="blue.500" mr={3} />
                    <Box>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>
                        {profile.stats[stat.key]}
                      </Text>
                      <Text fontSize="sm" color={mutedText}>
                        {stat.label}
                      </Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
};

export default ProfilePage;