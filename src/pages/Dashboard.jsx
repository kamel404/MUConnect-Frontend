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
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");

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
      <CardHeader>
        <Flex gap={3} align="center">
          <Avatar src={post.avatar} />
          <Box>
            <Heading size="sm" color={textColor}>
              {post.user}
            </Heading>
            <Text fontSize="sm" color={mutedText}>
              {post.time} {post.course && `• ${post.course}`}
            </Text>
          </Box>
        </Flex>
      </CardHeader>
    );

    const PostActions = () => (
      <CardFooter>
        <Flex gap={4} color={mutedText} justify="space-between" width="100%">
          <Flex gap={4}>
            <Button variant="ghost" leftIcon={<FiTrendingUp />} size="sm">
              {post.likes}
            </Button>
            <Button variant="ghost" leftIcon={<FiMessageSquare />} size="sm">
              {post.comments}
            </Button>
          </Flex>
          <Menu placement="bottom-end">
            <MenuButton 
              as={IconButton} 
              icon={<FiMoreHorizontal />} 
              variant="ghost" 
              size="sm"
              aria-label="More options"
              borderRadius="full"
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            />
            <Portal>
              <MenuList minW="150px" shadow="lg">
                <MenuItem icon={<FiShare />} fontSize="sm">Share</MenuItem>
                <MenuItem icon={<FiEdit />} fontSize="sm">Edit</MenuItem>
                <MenuItem icon={<FiTrash />} fontSize="sm" color="red.500">Delete</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </CardFooter>
    );

    const PostOptions = () => null;

    switch (post.type) {
      case "Study Group":
        return (
          <Card key={post.id} bg={cardBg} borderLeft="4px" borderColor="blue.500">
            <PostHeader />
            <CardBody>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor}>
                  {post.content}
                </Text>
                <Flex align="center" gap={2}>
                  <Icon as={FiCalendar} color="blue.500" />
                  <Text fontSize="sm">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Flex>
                <Badge width="fit-content" colorScheme="blue" px={2} py={1}>
                  <Flex align="center" gap={2}>
                    <FiUsers /> {post.members} Members
                  </Flex>
                </Badge>
              </Stack>
            </CardBody>
            <PostActions />
          </Card>
        );

      case "Course Material":
        return (
          <Card key={post.id} bg={cardBg} borderLeft="4px" borderColor="green.500">
            <PostHeader />
            <CardBody>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor}>
                  {post.content}
                </Text>
                <Box borderRadius="lg" overflow="hidden" position="relative">
                  <Image src={post.file} alt="Course material" />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
                    p={4}
                  >
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="green"
                      size="sm"
                      variant="solid"
                    >
                      Download Notes
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </CardBody>
            <PostActions />
          </Card>
        );

      case "Event":
        return (
          <Card key={post.id} bg={cardBg} borderLeft="4px" borderColor="purple.500">
            <PostHeader />
            <CardBody>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor}>
                  {post.content}
                </Text>
                <Flex direction="column" gap={2}>
                  <Flex align="center" gap={2}>
                    <Icon as={FiCalendar} color="purple.500" />
                    <Text fontSize="sm">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Icon as={FiMapPin} color="purple.500" />
                    <Text fontSize="sm">{post.location}</Text>
                  </Flex>
                </Flex>
                <Button colorScheme="purple" width="fit-content">
                  RSVP Now
                </Button>
              </Stack>
            </CardBody>
            <PostActions />
          </Card>
        );

      case "Media":
        return (
          <Card key={post.id} bg={cardBg} borderLeft="4px" borderColor="orange.500">
            <PostHeader />
            <CardBody>
              <Stack spacing={4}>
                <Text fontWeight="600" color={textColor}>
                  {post.content}
                </Text>
                <Box position="relative" borderRadius="lg" overflow="hidden">
                  <Image src={post.media} alt="Media content" />
                  {post.mediaType === 'video' && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    >
                      <Icon as={FiVideo} boxSize={8} color="white" />
                    </Box>
                  )}
                </Box>
              </Stack>
            </CardBody>
            <PostActions />
          </Card>
        );

      default:
        return (
          <Card key={post.id} bg={cardBg}>
            <PostHeader />
            <CardBody>
              <Text color={textColor}>{post.content}</Text>
            </CardBody>
            <PostActions />
          </Card>
        );
    }
  };

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

  const RightSidebarContent = () => (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Trending Topics
          </Heading>
          <Stack spacing={3}>
            {[
              { name: "Midterm Prep" },
              { name: "Internship Opportunities" },
              { name: "Hackathon Team Forming"},
            ].map((topic) => (
              <Flex key={topic.name} justify="space-between">
                <Button variant="ghost" justifyContent="flex-start" color='blue.500' as={Link} to={`/search?query=${topic.name}`}>
                  #{topic.name}
                </Button>
              </Flex>
            ))}
          </Stack>
        </Box>
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
      {!isMobile && (
        <Box bg={cardBg} p={4} borderRight="1px solid" borderColor={borderColor}>
          <LeftSidebarContent />
        </Box>
      )}

      <Box p={6}>
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
              icon={<FiBell />}
              aria-label="Notifications"
              variant="ghost"
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
          </CardBody>
        </Card>

        <Stack spacing={6}>
          {posts.map((post) => renderPostCard(post))}
        </Stack>
      </Box>

      {!isMobile && (
        <Box bg={cardBg} p={6} borderLeft="1px solid" borderColor={borderColor}>
          <RightSidebarContent />
        </Box>
      )}

      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <LeftSidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

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

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        addNewPost={addNewPost}
      />
    </Grid>
  );
};

export default Dashboard;