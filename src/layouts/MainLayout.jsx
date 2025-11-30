import { useState } from "react";
import {
  Flex,
  Box,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Button
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiMenu, FiMoreHorizontal } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../pages/LeftSideBar";
import DashboardTopNav from "../components/dashboard/DashboardTopNav";

const MainLayout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const primaryColor = useColorModeValue("blue.600", "blue.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const highlightBg = useColorModeValue("gray.100", "gray.700");

  // Left sidebar collapse state
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const toggleLeftSidebar = () => setIsLeftCollapsed(!isLeftCollapsed);

  // Mobile drawer states
  const { 
    isOpen: isLeftOpen, 
    onOpen: onLeftOpen, 
    onClose: onLeftClose 
  } = useDisclosure();
  
  // Right sidebar is now separate from notifications
  const {
    isOpen: isRightOpen,
    onOpen: onRightOpen,
    onClose: onRightClose
  } = useDisclosure();

  return (
    <Flex direction={{ base: "column", lg: "row" }} width="100%" bg={bgColor} minH="100vh">
      {/* Left Sidebar for Desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          borderRight="1px solid" 
          borderColor={borderColor}
          width={isLeftCollapsed ? "70px" : "240px"}
          flexShrink={0}
          display={{ base: "none", lg: "block" }}
          position="fixed"
          left={0}
          top={0}
          transition="width 0.3s ease"
          height="100vh"
          overflowY="auto"
          overflowX="hidden"
          zIndex={20}
          px={isLeftCollapsed ? 2 : 4}
          py={4}
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { background: 'gray.300', borderRadius: '24px' },
          }}
        >
          <IconButton
            icon={isLeftCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            position="absolute"
            right="-12px"
            top="20px"
            size="sm"
            borderRadius="full"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            zIndex={30}
            onClick={toggleLeftSidebar}
            aria-label={isLeftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            boxShadow="sm"
          />
          <LeftSidebar 
            textColor={textColor} 
            mutedText={mutedText} 
            highlightBg={highlightBg}
            isCollapsed={isLeftCollapsed}
          />
        </Box>
      )}
      
      {/* Main Content Area */}
      <Box 
        flexGrow={1} 
        overflowY="auto"
        ml={{ base: 0, lg: isLeftCollapsed ? "70px" : "240px" }}
        transition="margin-left 0.3s ease"
      >
        {/* Top Navigation */}
        <Flex
          align="center"
          justify="space-between"
          mb={4}
          px={{ base: 4, md: 6 }}
          py={4}
          bg={cardBg}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Flex align="center">
            {isMobile && (
              <IconButton
                icon={<FiMenu />}
                variant="ghost"
                onClick={onLeftOpen}
                aria-label="Open menu"
              />
            )}
          </Flex>
          
          <DashboardTopNav 
            isMobile={isMobile} 
            onLeftOpen={onLeftOpen}
            colorMode={colorMode}
            toggleColorMode={toggleColorMode}
          />
        </Flex>
        
        {/* Page Content */}
        <Box p={{ base: 4, md: 6 }}>
          <Outlet />
        </Box>
      </Box>
      
      {/* Mobile Left Drawer */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4} pt={12}>
            <LeftSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              highlightBg={highlightBg}
              isCollapsed={false}
              onClose={onLeftClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MainLayout;
