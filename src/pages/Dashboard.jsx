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
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiBell,
  FiMessageSquare,
  FiTrendingUp,
  FiSun,
  FiMoon,
  FiMenu,
  FiMoreHorizontal,
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";
import LeftSidebar from "./LeftSideBar";
import RightSidebar from "./RightSideBar";
import PostCard from "./PostCard";
import NotificationsBox from "../components/ui/NotificationsBox";

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Colors and theme values
  const bgColor = useColorModeValue("#f0f4f8", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("brand.navy", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");

  // Use responsive values for layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gridTemplate = isMobile ? "1fr" : "240px 1fr 300px";

  const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();
  const { isOpen: isPostModalOpen, onOpen: openPostModal, onClose: closePostModal } = useDisclosure();

  // Sample posts data
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
      id: 3,
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
    const newPost = {
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

    setPosts([newPost, ...posts]);
  };

  return (
    <Grid templateColumns={gridTemplate} minH="100vh" bg={bgColor}>
      {/* Left Sidebar for Desktop */}
      {!isMobile && (
        <Box bg={cardBg} p={{ base: 4, md: 6 }} borderRight="1px solid" borderColor={borderColor}>
          <LeftSidebar 
            textColor={textColor} 
            mutedText={mutedText} 
            accentColor={accentColor} 
            primaryColor={primaryColor} 
            highlightBg={useColorModeValue("rgba(242, 217, 68, 0.1)", "rgba(217, 194, 38, 0.15)")} 
          />
        </Box>
      )}

      <Box p={{ base: 4, md: 6 }}>
        {/* Top Navigation */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          mb={6}
          gap={4}
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
            <NotificationsBox />
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

        {/* Create Post Input */}
        <Card mb={6} bg={cardBg} cursor="pointer" onClick={openPostModal} border="1px solid" borderColor={borderColor}>
          <Box p={{ base: 4, md: 6 }}>
            <Flex gap={4} direction={{ base: "column", md: "row" }} align="center">
              <Avatar size="md" src="https://bit.ly/dan-abramov" />
              <Input
                placeholder="What's on your mind?"
                isReadOnly
                _placeholder={{ color: mutedText }}
                cursor="pointer"
                borderColor={borderColor}
                _hover={{ borderColor: accentColor }}
              />
            </Flex>
          </Box>
        </Card>

        {/* Feed Posts */}
        <Box>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              cardBg={cardBg}
              textColor={textColor}
              mutedText={mutedText}
              accentColor={accentColor}
              primaryColor={primaryColor}
            />
          ))}
        </Box>
      </Box>

      {/* Right Sidebar for Desktop */}
      {!isMobile && (
        <Box bg={cardBg} p={{ base: 4, md: 6 }} borderLeft="1px solid" borderColor={borderColor}>
          <RightSidebar 
            textColor={textColor} 
            mutedText={mutedText} 
            accentColor={accentColor} 
            primaryColor={primaryColor} 
            cardBg={cardBg} 
          />
        </Box>
      )}

      {/* Mobile Drawers */}
      {/* Left Sidebar Drawer */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4}>
            <LeftSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              accentColor={accentColor} 
              primaryColor={primaryColor} 
              highlightBg={useColorModeValue("rgba(242, 217, 68, 0.1)", "rgba(217, 194, 38, 0.15)")} 
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Right Sidebar Drawer */}
      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4} pt={12}>
            <RightSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              accentColor={accentColor} 
              primaryColor={primaryColor} 
              cardBg={cardBg} 
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isPostModalOpen} onClose={closePostModal} addNewPost={addNewPost} />
    </Grid>
  );
};

export default Dashboard;
