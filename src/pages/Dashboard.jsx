import {
  Flex,
  Box,
  Heading,
  Avatar,
  IconButton,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure
} from "@chakra-ui/react";
import { FiMoon, FiSun, FiMenu, FiMoreHorizontal } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";
import MainLayout from "../components/layout/MainLayout";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import PostFactory from "../components/posts/PostFactory";
import CreatePostCard from "../components/posts/CreatePostCard";
import NotificationBox from "../components/notifications/NotificationBox";

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.800", "white");
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Create separate disclosures for each functionality
  const { isOpen: isPostModalOpen, onOpen: openPostModal, onClose: closePostModal } = useDisclosure();
  const { isOpen: isLeftSidebarOpen, onOpen: openLeftSidebar, onClose: closeLeftSidebar } = useDisclosure();
  const { isOpen: isRightSidebarOpen, onOpen: openRightSidebar, onClose: closeRightSidebar } = useDisclosure();

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      avatar: "https://bit.ly/dan-abramov",
      content: "Just submitted my project for Computer Science 301. Anyone else finish yet?",
      likes: 12,
      comments: 4,
      time: "2h ago",
      type: "text"
    },
    {
      id: 2,
      user: "Sarah Kim",
      avatar: "https://bit.ly/sage-adebayo",
      content: "Study group for Calculus II tonight at 8pm in the library. We'll be reviewing for the midterm!",
      likes: 24,
      comments: 8,
      time: "5h ago",
      type: "event",
      event: {
        title: "Calculus II Study Group",
        location: "Main Library, Room 204",
        date: "Today",
        time: "8:00 PM - 10:00 PM"
      }
    },
    {
      id: 3,
      user: "Alex Johnson",
      avatar: "https://bit.ly/ryan-florence",
      content: "Looking for study partners for the upcoming Physics exam. Anyone interested?",
      likes: 8,
      comments: 15,
      time: "1d ago",
      type: "study group",
      date: "2025-03-22",
      members: 4
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Sarah Kim mentioned you in a comment",
      from: "Sarah Kim",
      avatar: "https://bit.ly/sage-adebayo",
      time: "10 min ago",
      read: false
    },
    {
      id: 2,
      message: "New course materials available for CS301",
      from: "CS301 Instructor",
      avatar: "https://bit.ly/kent-c-dodds",
      time: "2h ago",
      read: false
    },
    {
      id: 3,
      message: "Alex Johnson replied to your post",
      from: "Alex Johnson",
      avatar: "https://bit.ly/ryan-florence",
      time: "1d ago",
      read: true
    }
  ]);

  const [events] = useState([
    { id: 1, title: "AI Workshop", date: "Mar 15", time: "3:00 PM" },
    { id: 2, title: "Career Fair", date: "Mar 20", time: "10:00 AM" }
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

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Main content component with proper prop handling
  const DashboardContent = ({ onOpenLeftSidebar, onOpenRightSidebar, isMobile, notifications, onMarkRead, onClear }) => (
    <Box>
      <Flex direction="row" align="center" justify="space-between" mb={6}>
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open menu"
            onClick={onOpenLeftSidebar}
            borderRadius="full"
          />
        )}
        
        <Heading 
          size={isMobile ? "lg" : "xl"} 
          color={textColor} 
          fontWeight="800" 
          letterSpacing="tight"
          ml={isMobile ? 2 : 0}
        >
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
          <NotificationBox 
            notifications={notifications} 
            onMarkRead={onMarkRead} 
            onClear={onClear}
          />
          {isMobile && (
            <IconButton
              icon={<FiMoreHorizontal />}
              variant="ghost"
              aria-label="More options"
              onClick={onOpenRightSidebar}
              borderRadius="full"
            />
          )}
          {!isMobile && (
            <Avatar
              size="sm"
              src="https://bit.ly/dan-abramov"
              as={Link}
              to="/profile"
              _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
              transition="all 0.2s"
            />
          )}
        </Flex>
      </Flex>

      <CreatePostCard onClick={openPostModal} />

      <Box>
        {posts.map((post) => (
          <PostFactory key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );

  return (
    <MainLayout
      leftSidebar={<LeftSidebar />}
      rightSidebar={<RightSidebar events={events} />}
      leftSidebarOpen={isLeftSidebarOpen}
      rightSidebarOpen={isRightSidebarOpen}
      onOpenLeftSidebar={openLeftSidebar}
      onCloseLeftSidebar={closeLeftSidebar}
      onOpenRightSidebar={openRightSidebar}
      onCloseRightSidebar={closeRightSidebar}
    >
      <DashboardContent 
        onOpenLeftSidebar={openLeftSidebar} 
        onOpenRightSidebar={openRightSidebar} 
        isMobile={isMobile} 
        notifications={notifications} 
        onMarkRead={handleMarkAllNotificationsAsRead} 
        onClear={handleClearAllNotifications} 
      />
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        addNewPost={addNewPost}
      />
    </MainLayout>
  );
};

export default Dashboard;