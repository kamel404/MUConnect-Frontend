import { 
  Box, 
  Flex, 
  useColorModeValue, 
  IconButton, 
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Tooltip
} from "@chakra-ui/react";
import LeftSidebar from "../../pages/LeftSideBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiHome, FiUsers, FiBook, FiInbox, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../../assets/maaref-logo.png";

const MainLayout = () => {
  // Define colors based on color mode
  const bgColor = useColorModeValue("#f0f4f8", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("gray.100", "gray.700");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const highlightBg = useColorModeValue("rgba(242, 217, 68, 0.1)", "rgba(217, 194, 38, 0.15)");

  // Use responsive values for layout
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // State for desktop sidebar visibility
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  
  // Calculate content margin based on sidebar visibility and device
  const leftMargin = isMobile ? "0px" : isDesktopSidebarOpen ? "240px" : "60px";

  // Drawer control for mobile view
  const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();

  // Toggle desktop sidebar
  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  return (
    <Flex minHeight="100vh" bg={bgColor}>
      {/* Left Sidebar for Desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          p={{ base: 4, md: isDesktopSidebarOpen ? 6 : 3 }} 
          borderRight="1px solid" 
          borderColor={borderColor}
          position="fixed"
          height="100vh"
          width={isDesktopSidebarOpen ? "240px" : "60px"}
          zIndex="10"
          transition="all 0.3s ease"
          overflowY="auto"
        >
          {isDesktopSidebarOpen ? (
            <LeftSidebar 
              textColor={textColor}
              mutedText={mutedText}
              highlightBg={highlightBg}
              primaryColor={primaryColor}
            />
          ) : (
            <Flex direction="column" align="center" gap={6}>
              <Box mb={4}>
                <img src={logo} alt="MU Logo" style={{ maxWidth: "40px", height: "auto" }} />
              </Box>
              <Flex direction="column" gap={6} align="center" mt={4}>
                <Tooltip label="Home" placement="right">
                  <IconButton
                    as={Link}
                    to="/dashboard"
                    icon={<FiHome size={22} />}
                    variant="ghost"
                    aria-label="Home"
                    color={textColor}
                    borderRadius="md"
                    _hover={{ bg: highlightBg }}
                  />
                </Tooltip>
                <Tooltip label="Study Groups" placement="right">
                  <IconButton
                    as={Link}
                    to="/study-groups"
                    icon={<FiUsers size={22} />}
                    variant="ghost"
                    aria-label="Study Groups"
                    color={textColor}
                    borderRadius="md"
                    _hover={{ bg: highlightBg }}
                  />
                </Tooltip>
                <Tooltip label="Courses" placement="right">
                  <IconButton
                    as={Link}
                    to="/courses"
                    icon={<FiBook size={22} />}
                    variant="ghost"
                    aria-label="Courses"
                    color={textColor}
                    borderRadius="md"
                    _hover={{ bg: highlightBg }}
                  />
                </Tooltip>
                <Tooltip label="Requests" placement="right">
                  <IconButton
                    as={Link}
                    to="/requests"
                    icon={<FiInbox size={22} />}
                    variant="ghost"
                    aria-label="Requests"
                    color={textColor}
                    borderRadius="md"
                    _hover={{ bg: highlightBg }}
                  />
                </Tooltip>
              </Flex>
            </Flex>
          )}
          <IconButton
            icon={isDesktopSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
            position="absolute"
            right="-12px"
            top={isDesktopSidebarOpen ? "20px" : "80px"}
            size="sm"
            aria-label={isDesktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
            onClick={toggleDesktopSidebar}
            zIndex="11"
            bg={cardBg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            _hover={{ bg: highlightBg }}
          />
        </Box>
      )}
      
      {/* Main content area with appropriate margins */}
      <Box 
        ml={leftMargin} 
        width={`calc(100% - ${leftMargin})`} 
        transition="all 0.3s ease"
        p={5}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open navigation menu"
            onClick={onLeftOpen}
            mb={4}
          />
        )}
        
        <Outlet />
      </Box>

      {/* Mobile Left Drawer */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={6} bg={cardBg}>
            <LeftSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              highlightBg={highlightBg} 
              primaryColor={primaryColor} 
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MainLayout;
