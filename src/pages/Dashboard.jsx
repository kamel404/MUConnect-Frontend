import {
  Flex,
  Box,
  Heading,
  Text,
  Avatar,
  Input,
  IconButton,
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
  CloseButton,
} from "@chakra-ui/react";
import {
  FiSun,
  FiMoon,
  FiMoreHorizontal
} from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import NotificationsBox from "../components/ui/NotificationsBox";
import RightSidebar from "./RightSideBar";
import HeroSection from '../components/dashboard/HeroSection';
import DashboardTopNav from '../components/dashboard/DashboardTopNav';
import ResourcePostInput from '../components/dashboard/ResourcePostInput';
import FeedTabs from '../components/dashboard/FeedTabs';
import PostFeed from '../components/dashboard/PostFeed';

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Colors and theme values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("brand.navy", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const highlightBg = useColorModeValue("rgba(242, 217, 68, 0.1)", "rgba(217, 194, 38, 0.15)");

  // Use responsive values for layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const { isOpen: isPostModalOpen, onOpen: openPostModal, onClose: closePostModal } = useDisclosure();
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Dr. Lina Hassan",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "[PDF] Linear Algebra Final Exam Solutions (Spring 2024)",
      likes: 42,
      comments: 9,
      time: "15m ago",
      course: "MATH 201",
      type: "Document",
      fileType: "pdf",
      fileUrl: "#",
    },
    {
      id: 2,
      user: "Student Affairs Office",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      content: "How to apply for a student parking permit? Step-by-step guide attached.",
      likes: 20,
      comments: 3,
      time: "1h ago",
      type: "Student Affairs",
      fileType: "pdf",
      fileUrl: "#",
    },
    {
      id: 3,
      user: "Ahmad Hassan",
      avatar: "https://bit.ly/ryan-florence",
      content: "Practice Quiz: Database Normalization (with answers)",
      likes: 33,
      comments: 7,
      time: "2h ago",
      type: "Quiz",
      fileType: "quiz",
      fileUrl: "#",
    },
    {
      id: 4,
      user: "Nada Ahmed",
      avatar: "https://bit.ly/kent-c-dodds",
      content: "Official Announcement: Midterm Exam Schedule Released",
      likes: 17,
      comments: 2,
      time: "4h ago",
      type: "Announcement",
    },
  ]);

  // State for showing/hiding hero section
  const [showHero, setShowHero] = useState(true);

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
    <Flex direction={{ base: "column", lg: "row" }} width="100%">
      <Box flexGrow={1} pr={{ base: 0, lg: 4 }}>
        {showHero && <HeroSection onClose={() => setShowHero(false)} />}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          mb={6}
          gap={4}
          p={{ base: 4, md: 6 }}
        >
          <Flex align="center" gap={2}>
            <Heading size="lg" color={textColor}>
              Academic Resource Hub
            </Heading>
          </Flex>
          <DashboardTopNav colorMode={colorMode} toggleColorMode={toggleColorMode} isMobile={isMobile} onRightOpen={onRightOpen} />
        </Flex>
        <ResourcePostInput openPostModal={openPostModal} cardBg={cardBg} borderColor={borderColor} accentColor={accentColor} mutedText={mutedText} />
        <FeedTabs primaryColor={primaryColor} accentColor={accentColor} highlightBg={highlightBg} mutedText={mutedText} />
        <PostFeed posts={posts} cardBg={cardBg} textColor={textColor} mutedText={mutedText} accentColor={accentColor} primaryColor={primaryColor} />
      </Box>
      {/* Right Sidebar for Desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          p={{ base: 4, md: 6 }} 
          borderLeft="1px solid" 
          borderColor={borderColor}
          width="300px"
          flexShrink={0}
        >
          <RightSidebar 
            textColor={textColor} 
            mutedText={mutedText} 
            highlightBg={highlightBg} 
            primaryColor={primaryColor} 
            cardBg={cardBg} 
          />
        </Box>
      )}
      {/* Mobile Right Drawer */}
      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4} pt={12}>
            <RightSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              highlightBg={highlightBg} 
              primaryColor={primaryColor} 
              cardBg={cardBg} 
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={closePostModal} 
        addNewPost={addNewPost}
        cardBg={cardBg}
        textColor={textColor}
        mutedText={mutedText}
        borderColor={borderColor}
        accentColor={accentColor}
        primaryColor={primaryColor}
      />
    </Flex>
  );
};

export default Dashboard;
