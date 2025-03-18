import {
  Flex,
  Grid,
  Box,
  Heading,
  Text,
  Avatar,
  Input,
  Button,
  IconButton,
  Divider,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Tag,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Image,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  InputGroup,
  InputLeftElement,
  HStack,
  Progress,
  AspectRatio,
  AvatarGroup
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBell,
  FiMessageSquare,
  FiCalendar,
  FiTrendingUp,
  FiSun,
  FiMoon,
  FiMenu,
  FiMoreHorizontal,
  FiDownload,
  FiMapPin,
  FiVideo,
  FiShare,
  FiEdit,
  FiTrash,
  FiBookmark,
} from "react-icons/fi";
import { useState} from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionCard = motion(Card);

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();
  const { isOpen: isPostModalOpen, onOpen: openPostModal, onClose: closePostModal } = useDisclosure();

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Ahmed Ali",
      avatar: "https://bit.ly/dan-abramov",
      content: "Computer Architecture Study Group",
      likes: 24,
      comments: 12,
      time: "2h ago",
      course: "CS 301",
      type: "Study Group",
      date: "2024-03-20T14:00:00",
      members: 8,
    },
    {
      id: 2,
      user: "Mostafa Mohamed",
      avatar: "https://bit.ly/sage-adebayo",
      content: "MATH 202 Midterm Notes",
      likes: 45,
      comments: 8,
      time: "4h ago",
      course: "MATH 202",
      type: "Course Material",
      file: "https://via.placeholder.com/600x400",
    },
    {
      id: 3,
      user: "Nada Ahmed",
      avatar: "https://bit.ly/kent-c-dodds",
      content: "AI Workshop Announcement",
      likes: 32,
      comments: 5,
      time: "1d ago",
      type: "Event",
      date: "2024-03-15T15:00:00",
      location: "Main Auditorium",
    },
    {
      id: 4,
      user: "Omar Khaled",
      avatar: "https://bit.ly/ryan-florence",
      content: "Sorting Algorithms Visualization",
      likes: 56,
      comments: 18,
      time: "3h ago",
      type: "Media",
      media: "https://via.placeholder.com/600x400",
      mediaType: "image",
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'AI Workshop',
      date: '2024-03-15',
      time: '15:00',
      location: 'Main Auditorium',
    },
    {
      id: 2,
      title: 'CS 301 Study Group',
      date: '2024-03-20',
      time: '14:00',
      location: 'Room 101',
    },
  ]);

  const addNewPost = (content, selectedType, additionalData) => {
    let newPost = {
      id: posts.length + 1,
      user: "Current User",
      avatar: "https://bit.ly/dan-abramov",
      content,
      likes: 0,
      comments: 0,
      time: "Just now",
      type: selectedType,
      ...additionalData,
    };
    
    // Deep clone media-related arrays to ensure they're preserved in state
    if (additionalData.images && additionalData.images.length > 0) {
      newPost.images = JSON.parse(JSON.stringify(additionalData.images));
    }
    
    if (additionalData.videos && additionalData.videos.length > 0) {
      newPost.videos = JSON.parse(JSON.stringify(additionalData.videos));
    }
    
    if (additionalData.documents && additionalData.documents.length > 0) {
      newPost.documents = JSON.parse(JSON.stringify(additionalData.documents));
    }
    
    // Log the post data to verify structure
    console.log("New post data with media attachments:", newPost);
  
    setPosts([newPost, ...posts]);
  };

  const renderPostCard = (post) => {
    const PostHeader = () => (
      <CardHeader p={4} pb={0}>
        <Flex gap={3} align="center">
          <Avatar src={post.avatar} size="sm" />
          <Box>
            <Heading size="sm" color={textColor} fontWeight="600">
              {post.user}
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              {post.time} {post.course && `• ${post.course}`}
            </Text>
          </Box>
        </Flex>
      </CardHeader>
    );

    const PostActions = () => (
      <CardFooter p={4} pt={0}>
        <Flex gap={4} color={mutedText} justify="space-between" width="100%">
          <HStack spacing={4}>
            <Button 
              variant="ghost" 
              leftIcon={<FiTrendingUp />} 
              size="sm"
              _hover={{ bg: hoverBg }}
              borderRadius="full"
            >
              {post.likes}
            </Button>
            <Button 
              variant="ghost" 
              leftIcon={<FiMessageSquare />} 
              size="sm"
              _hover={{ bg: hoverBg }}
              borderRadius="full"
            >
              {post.comments}
            </Button>
            <IconButton
              aria-label="Bookmark post"
              icon={<FiBookmark />}
              variant="ghost"
              size="sm"
              borderRadius="full"
              _hover={{ bg: hoverBg }}
            />
          </HStack>
          <Menu placement="bottom-end">
            <MenuButton 
              as={IconButton} 
              icon={<FiMoreHorizontal />} 
              variant="ghost" 
              size="sm"
              aria-label="More options"
              borderRadius="full"
              _hover={{ bg: hoverBg }}
            />
            <Portal>
              <MenuList minW="150px" shadow="xl" bg={cardBg}>
                <MenuItem icon={<FiShare />} fontSize="sm" _hover={{ bg: hoverBg }}>Share</MenuItem>
                <MenuItem icon={<FiEdit />} fontSize="sm" _hover={{ bg: hoverBg }}>Edit</MenuItem>
                <MenuItem icon={<FiTrash />} fontSize="sm" color="red.500" _hover={{ bg: hoverBg }}>Delete</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </CardFooter>
    );

    switch (post.type) {
      case "Study Group":
        return (
          <MotionCard
            key={post.id}
            bg={cardBg}
            borderLeft="4px"
            borderColor="blue.500"
            boxShadow="md"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <PostHeader />
            <CardBody p={4}>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor} fontSize="lg">
                  {post.content}
                </Text>
                <Flex align="center" gap={2} bg="blue.50" p={3} borderRadius="lg">
                  <Icon as={FiCalendar} color="blue.500" boxSize={5} />
                  <Text fontSize="sm" color="blue.700">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Flex>
                <Flex align="center" gap={3}>
                  <AvatarGroup size="sm" max={4}>
                    {[...Array(post.members)].map((_, i) => (
                      <Avatar key={i} name={`Member ${i+1}`} src={`https://i.pravatar.cc/150?img=${i}`} />
                    ))}
                  </AvatarGroup>
                  <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                    {post.members} Members
                  </Badge>
                </Flex>
              </Stack>
            </CardBody>
            <PostActions />
          </MotionCard>
        );

      case "Course Material":
        return (
          <MotionCard
            key={post.id}
            bg={cardBg}
            borderLeft="4px"
            borderColor="green.500"
            boxShadow="md"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <PostHeader />
            <CardBody p={4}>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor} fontSize="lg">
                  {post.content}
                </Text>
                <Box 
                  borderRadius="lg" 
                  overflow="hidden" 
                  position="relative"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Image src={post.file} alt="Course material" />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
                    p={3}
                  >
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="green"
                      size="sm"
                      variant="solid"
                      width="full"
                    >
                      Download PDF
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </CardBody>
            <PostActions />
          </MotionCard>
        );

      case "Event":
        return (
          <MotionCard
            key={post.id}
            bg={cardBg}
            borderLeft="4px"
            borderColor="purple.500"
            boxShadow="md"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <PostHeader />
            <CardBody p={4}>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor} fontSize="lg">
                  {post.content}
                </Text>
                <Flex direction="column" gap={3}>
                  <Flex align="center" gap={2} bg="purple.50" p={3} borderRadius="lg">
                    <Icon as={FiCalendar} color="purple.500" boxSize={5} />
                    <Text fontSize="sm" color="purple.700">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2} bg="purple.50" p={3} borderRadius="lg">
                    <Icon as={FiMapPin} color="purple.500" boxSize={5} />
                    <Text fontSize="sm" color="purple.700">{post.location}</Text>
                  </Flex>
                </Flex>
                <Button 
                  colorScheme="purple" 
                  width="full"
                  borderRadius="full"
                  size="lg"
                  boxShadow="md"
                >
                  RSVP Now
                </Button>
              </Stack>
            </CardBody>
            <PostActions />
          </MotionCard>
        );

      case "Media":
        return (
          <MotionCard
            key={post.id}
            bg={cardBg}
            borderLeft="4px"
            borderColor="orange.500"
            boxShadow="md"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <PostHeader />
            <CardBody p={4}>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor} fontSize="lg">
                  {post.content}
                </Text>
                <AspectRatio ratio={16/9}>
                  <Box 
                    borderRadius="lg" 
                    overflow="hidden"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Image src={post.media} alt="Media content" objectFit="cover" />
                    {post.mediaType === 'video' && (
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        p={4}
                        bg="rgba(0,0,0,0.6)"
                        borderRadius="full"
                      >
                        <Icon as={FiVideo} boxSize={6} color="white" />
                      </Box>
                    )}
                  </Box>
                </AspectRatio>
              </Stack>
            </CardBody>
            <PostActions />
          </MotionCard>
        );

      default:
        return (
          <MotionCard
            key={post.id}
            bg={cardBg}
            boxShadow="md"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <PostHeader />
            <CardBody p={4}>
              <Text color={textColor}>{post.content}</Text>
            </CardBody>
            <PostActions />
          </MotionCard>
        );
    }
  };

  const LeftSidebarContent = () => (
    <Box p={4}>
      <Flex direction="column" gap={6}>
        <Heading size="lg" mb={4} color={textColor} letterSpacing="tight">
          MU Hub
        </Heading>
        <Stack spacing={1}>
          {[
            { icon: FiHome, label: "Home", to: "/" },
            { icon: FiUsers, label: "Study Groups", to: "/study-groups" },
            { icon: FiBook, label: "Courses", to: "/courses" },
            { icon: FiMessageSquare, label: "Messages", to: "/messages" },
          ].map((item) => (
            <Button
              key={item.label}
              leftIcon={<Icon as={item.icon} boxSize={5} />}
              justifyContent="flex-start"
              variant="ghost"
              color={textColor}
              borderRadius="lg"
              py={5}
              _hover={{ bg: hoverBg }}
              as={Link}
              to={item.to}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        <Divider borderColor={borderColor} />
        <Text fontSize="sm" color={mutedText} fontWeight="500" mt={4}>
          Your Courses
        </Text>
        <Stack spacing={2}>
          {['CS 301', 'MATH 202', 'PHY 101'].map((course) => (
            <Button 
              key={course}
              variant="ghost" 
              justifyContent="flex-start"
              color={textColor}
              borderRadius="lg"
              _hover={{ bg: hoverBg }}
            >
              {course}
            </Button>
          ))}
        </Stack>
      </Flex>
    </Box>
  );

  const RightSidebarContent = ({ events }) => (
    <Box p={4}>
      <Stack spacing={6}>
        <Box>
          <Flex justify="space-between" mb={4}>
            <Heading size="md" color={textColor} letterSpacing="tight">
              Trending Topics
            </Heading>
            <Button variant="ghost" color={mutedText} size="sm" onClick={() => navigate('/hashtags')}>
              See All
            </Button>
          </Flex>
          <Stack spacing={3}>
            {['Midterm Prep', 'Internship Opportunities', 'Hackathon Teams'].map((topic) => (
              <Flex 
                key={topic}
                align="center" 
                p={3}
                borderRadius="lg"
                bg={hoverBg}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Text fontWeight="500" color={textColor}>#{topic}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Box>
          <Flex justify="space-between" mb={4}>
            <Heading size="md" color={textColor} letterSpacing="tight">
              Upcoming Events
            </Heading>
            <Button variant="ghost" color={mutedText} size="sm" onClick={() => navigate('/events')}>
              See All
            </Button>
          </Flex>
          <Stack spacing={3}>
            {events.map((event) => (
              <Card 
                key={event.title} 
                variant="outline" 
                bg={cardBg}
                borderLeft="4px"
                borderColor="purple.500"
                boxShadow="sm"
              >
                <CardBody p={3}>
                  <Text fontWeight="600" color={textColor}>{event.title}</Text>
                  <Text fontSize="sm" color={mutedText}>
                    {event.date} • {event.time}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box>
          <Heading size="md" mb={4} color={textColor} letterSpacing="tight">
            Recent Resources
          </Heading>
          <Stack spacing={3}>
            {['CS 301 Notes', 'MATH 202 Exams', 'PHY 101 Slides'].map((resource) => (
              <Flex
                key={resource}
                align="center"
                p={3}
                borderRadius="lg"
                bg={hoverBg}
                _hover={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                cursor="pointer"
                transition="all 0.2s"
              >
                <Icon as={FiBook} mr={3} color={mutedText} />
                <Text color={textColor}>{resource}</Text>
              </Flex>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Grid 
      templateColumns={isMobile ? "1fr" : "280px 1fr 320px"} 
      minH="100vh" 
      bg={bgColor}
      overflowX="hidden"
    >
      {/* Left Sidebar */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          borderRight="1px solid" 
          borderColor={borderColor}
          position="sticky"
          top={0}
          h="100vh"
        >
          <LeftSidebarContent />
        </Box>
      )}

      {/* Main Content */}
      <Box 
        p={{ base: 4, md: 6 }}
        maxW={{ md: "3xl", lg: "4xl" }}
        mx="auto"
        width="100%"
      >
        <Flex
          direction="row"
          align="center"
          justify="space-between"
          mb={6}
          gap={4}
        >
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              aria-label="Open navigation menu"
              onClick={onLeftOpen}
              borderRadius="full"
            />
          )}
          <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
            Academic Feed
          </Heading>
          <Flex align="center" gap={2}>
            <IconButton
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              variant="ghost"
              borderRadius="full"
            />
            <IconButton
              icon={<FiBell />}
              aria-label="Notifications"
              variant="ghost"
              borderRadius="full"
            />
            <Avatar
              size="sm"
              src="https://bit.ly/dan-abramov"
              as={Link}
              to="/profile"
              _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
              transition="all 0.2s"
            />
          </Flex>
        </Flex>

        {/* Create Post Card */}
        <MotionCard
          bg={cardBg}
          mb={6}
          cursor="pointer"
          onClick={openPostModal}
          whileHover={{ scale: 1.01 }}
          boxShadow="md"
        >
          <CardBody p={4}>
            <Flex gap={4} align="center">
              <Avatar size="md" src="https://bit.ly/dan-abramov" />
              <Input
                placeholder="Share your knowledge..."
                isReadOnly
                _placeholder={{ color: mutedText }}
                cursor="pointer"
                borderRadius="full"
                bg={useColorModeValue('gray.100', 'gray.600')}
              />
            </Flex>
          </CardBody>
        </MotionCard>

        {/* Posts Feed */}
        <Stack spacing={6}>
          {posts.map((post) => renderPostCard(post))}
        </Stack>
      </Box>

      {/* Right Sidebar */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          borderLeft="1px solid" 
          borderColor={borderColor}
          position="sticky"
          top={0}
          h="100vh"
          overflowY="auto"
        >
          <RightSidebarContent events={events} />
        </Box>
      )}

      {/* Mobile Drawers */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4}>
            <LeftSidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerHeader>Quick Access</DrawerHeader>
          <DrawerBody p={4}>
            <RightSidebarContent events={events} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        addNewPost={addNewPost}
      />
    </Grid>
  );
};

export default Dashboard;