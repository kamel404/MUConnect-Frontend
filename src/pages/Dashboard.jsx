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
  InputGroup,
  InputLeftElement,
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
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBell,
  FiMessageSquare,
  FiPlus,
  FiCalendar,
  FiTrendingUp,
  FiSun,
  FiMoon,
  FiMenu,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal"; // Import the modal component

const Dashboard = () => {
  // Dark mode hooks
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  // Determine if mobile view
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Drawer controls for mobile menus
  const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();

  // Notification state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "group",
      message: "Your study group meeting starts in 30 minutes",
      read: false,
      timestamp: "2024-03-15T14:30:00",
    },
    {
      id: 2,
      type: "resource",
      message: "Sarah uploaded new notes for CS 301",
      read: false,
      timestamp: "2024-03-15T13:45:00",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle notification click
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Ahmed Ali",
      avatar: "https://bit.ly/dan-abramov",
      content: "Anyone interested in forming a study group for Computer Architecture?",
      likes: 24,
      comments: 12,
      time: "2h ago",
      course: "CS 301",
    },
    {
      id: 2,
      user: "Sara Mohamed",
      avatar: "https://bit.ly/sage-adebayo",
      content: "Sharing my notes for MATH 202 Midterm. Let me know if you find them helpful!",
      likes: 45,
      comments: 8,
      time: "4h ago",
      course: "MATH 202",
    },
  ]);

  // Function to add a new post
  const addNewPost = (content) => {
    const newPost = {
      id: posts.length + 1,
      user: "Current User",
      avatar: "https://bit.ly/dan-abramov",
      content,
      likes: 0,
      comments: 0,
      time: "Just now",
      course: "General",
    };
    setPosts([newPost, ...posts]);
  };

  // Modal controls for creating a post
  const { isOpen: isPostModalOpen, onOpen: openPostModal, onClose: closePostModal } = useDisclosure();

  // Left sidebar content component
  const LeftSidebarContent = () => (
    <Box>
      <Flex direction="column" gap={6}>
        <Heading size="md" mb={4} color={textColor}>
          MU Hub
        </Heading>
        <Stack spacing={2}>
          <Button
            leftIcon={<FiHome />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
          >
            Home
          </Button>
          <Button
            leftIcon={<FiUsers />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
            as={Link}
            to="/study-groups"
          >
            Study Groups
          </Button>
          <Button
            leftIcon={<FiBook />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
            as={Link}
            to="/courses"
          >
            Courses
          </Button>
          <Button
            leftIcon={<FiMessageSquare />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
          >
            Messages
          </Button>
        </Stack>
        <Divider borderColor={borderColor} />
        <Text fontSize="sm" color={mutedText} mt={4}>
          Your Courses
        </Text>
        <Stack spacing={2}>
          <Button variant="ghost" justifyContent="flex-start" color={textColor}>
            CS 301
          </Button>
          <Button variant="ghost" justifyContent="flex-start" color={textColor}>
            MATH 202
          </Button>
        </Stack>
      </Flex>
    </Box>
  );

  // Right sidebar content component
  const RightSidebarContent = () => (
    <Box>
      <Stack spacing={6}>
        {/* Trending Topics */}
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Trending Topics
          </Heading>
          <Stack spacing={3}>
            {[
              { name: "Midterm Prep", posts: 142 },
              { name: "Internship Opportunities", posts: 89 },
              { name: "Hackathon Team Forming", posts: 67 },
            ].map((topic) => (
              <Flex key={topic.name} justify="space-between">
                <Text color={textColor}>#{topic.name}</Text>
                <Badge colorScheme="blue">{topic.posts} posts</Badge>
              </Flex>
            ))}
          </Stack>
        </Box>
        {/* Upcoming Events */}
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Upcoming Events
          </Heading>
          <Stack spacing={3}>
            {[
              { title: "AI Workshop", date: "Mar 15", time: "3:00 PM" },
              { title: "Career Fair", date: "Mar 20", time: "10:00 AM" },
            ].map((event) => (
              <Card key={event.title} variant="outline" bg={cardBg}>
                <CardBody>
                  <Text fontWeight="600" color={textColor}>
                    {event.title}
                  </Text>
                  <Text fontSize="sm" color={mutedText}>
                    {event.date} • {event.time}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
        {/* Recommended Resources */}
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Recommended Resources
          </Heading>
          <Stack spacing={3}>
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor}>
              CS 301 Lecture Notes
            </Button>
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor}>
              MATH 202 Practice Exams
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Grid templateColumns={isMobile ? "1fr" : "240px 1fr 300px"} minH="100vh" bg={bgColor}>
      {/* Desktop Left Sidebar */}
      {!isMobile && (
        <Box bg={cardBg} p={4} borderRight="1px solid" borderColor={borderColor}>
          <LeftSidebarContent />
        </Box>
      )}

      {/* Main Feed */}
      <Box p={6}>
        {/* Header */}
        <Flex
          direction={isMobile ? "column" : "row"}
          align={isMobile ? "flex-start" : "center"}
          justify="space-between"
          mb={6}
          gap={isMobile ? 4 : 0}
        >
          <Flex align="center" gap={2}>
            {isMobile && (
              <IconButton
                icon={<FiMenu />}
                variant="ghost"
                aria-label="Open navigation menu"
                onClick={onLeftOpen}
              />
            )}
            <Heading size="lg" color={textColor}>
              Academic Feed
            </Heading>
          </Flex>
          <Flex align="center" gap={2}>
            <IconButton
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              aria-label="Toggle theme"
              variant="ghost"
            />
            <IconButton
              icon={
                <Box position="relative">
                  <FiBell />
                  {unreadCount > 0 && (
                    <Badge
                      colorScheme="red"
                      variant="solid"
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      borderRadius="full"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Box>
              }
              aria-label="Notifications"
              variant="ghost"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {isMobile && (
              <IconButton
                icon={<FiMoreHorizontal />}
                variant="ghost"
                aria-label="Open more menu"
                onClick={onRightOpen}
              />
            )}
            <Avatar
              size="sm"
              src="https://bit.ly/dan-abramov"
              as={Link}
              to="/profile"
              _hover={{ cursor: "pointer" }}
            />
          </Flex>
        </Flex>

        {/* Create Post Card (LinkedIn style) */}
        <Card mb={6} bg={cardBg} cursor="pointer" onClick={openPostModal}>
          <CardBody>
            <Flex gap={4} direction={isMobile ? "column" : "row"} align="center">
              <Avatar size="md" src="https://bit.ly/dan-abramov" />
              <Input
                placeholder="What's on your mind?"
                isReadOnly
                _placeholder={{ color: mutedText }}
                cursor="pointer"
              />
            </Flex>
            <Flex mt={4} gap={2} wrap="wrap">
              <Button leftIcon={<FiUsers />} size="sm" variant="outline" color={textColor}>
                Study Group
              </Button>
              <Button leftIcon={<FiBook />} size="sm" variant="outline" color={textColor}>
                Course Material
              </Button>
              <Button leftIcon={<FiCalendar />} size="sm" variant="outline" color={textColor}>
                Event
              </Button>
            </Flex>
          </CardBody>
        </Card>

        {/* Render the CreatePostModal */}
        <CreatePostModal isOpen={isPostModalOpen} onClose={closePostModal} onPost={addNewPost} />

        {/* Posts Feed */}
        <Stack spacing={6}>
          {posts.map((post) => (
            <Card key={post.id} bg={cardBg}>
              <CardHeader>
                <Flex gap={3} align="center">
                  <Avatar src={post.avatar} />
                  <Box>
                    <Heading size="sm" color={textColor}>
                      {post.user}
                    </Heading>
                    <Text fontSize="sm" color={mutedText}>
                      {post.time} •{" "}
                      <Tag size="sm" bg={borderColor}>
                        {post.course}
                      </Tag>
                    </Text>
                  </Box>
                </Flex>
              </CardHeader>
              <CardBody>
                <Text color={textColor}>{post.content}</Text>
              </CardBody>
              <CardFooter>
                <Flex gap={4} color={mutedText}>
                  <Button variant="ghost" leftIcon={<FiTrendingUp />}>
                    {post.likes}
                  </Button>
                  <Button variant="ghost" leftIcon={<FiMessageSquare />}>
                    {post.comments}
                  </Button>
                  <Button variant="ghost" leftIcon={<FiUsers />}>
                    Share
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Desktop Right Sidebar */}
      {!isMobile && (
        <Box bg={cardBg} p={6} borderLeft="1px solid" borderColor={borderColor}>
          <RightSidebarContent />
        </Box>
      )}

      {/* Mobile Left Drawer */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <LeftSidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Mobile Right Drawer */}
      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>More</DrawerHeader>
          <DrawerBody>
            <RightSidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
};

export default Dashboard;
