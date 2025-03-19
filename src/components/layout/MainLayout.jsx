import React from 'react';
import { Grid, Box, useBreakpointValue, useColorModeValue, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, IconButton } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";

const MainLayout = ({ 
  leftSidebar, 
  rightSidebar, 
  children 
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Create disclosures for sidebar state management
  const { 
    isOpen: isLeftSidebarOpen, 
    onOpen: onOpenLeftSidebar, 
    onClose: onCloseLeftSidebar 
  } = useDisclosure();
  
  const { 
    isOpen: isRightSidebarOpen, 
    onOpen: onOpenRightSidebar, 
    onClose: onCloseRightSidebar 
  } = useDisclosure();

  // Clone sidebars with the isMobile prop
  const sidebarWithProps = (sidebar, isForMobile = false) => {
    if (React.isValidElement(sidebar)) {
      return React.cloneElement(sidebar, { 
        isMobile: isForMobile || isMobile,
        isDrawer: isForMobile 
      });
    }
    return sidebar;
  };

  // Pass the sidebar control functions to children via React.cloneElement
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onOpenLeftSidebar,
        onOpenRightSidebar,
        onCloseLeftSidebar,
        onCloseRightSidebar,
        isMobile
      });
    }
    return child;
  });

  return (
    <Grid 
      templateColumns={isMobile ? "1fr" : "240px 1fr 300px"} 
      minH="100vh" 
      bg={bgColor}
      position="relative"
    >
      {/* Left Sidebar - visible on desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          borderRight="1px solid" 
          borderColor={borderColor}
          position="sticky"
          top={0}
          height="100vh"
          overflowY="auto"
        >
          {sidebarWithProps(leftSidebar)}
        </Box>
      )}

      {/* Main Content */}
      <Box p={{ base: 3, md: 6 }}>
        {childrenWithProps}
      </Box>

      {/* Right Sidebar - visible on desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          borderLeft="1px solid" 
          borderColor={borderColor}
          position="sticky"
          top={0}
          height="100vh"
          overflowY="auto"
        >
          {sidebarWithProps(rightSidebar)}
        </Box>
      )}

      {/* Left Sidebar Drawer - for mobile */}
      <Drawer 
        isOpen={isMobile && isLeftSidebarOpen} 
        placement="left" 
        onClose={onCloseLeftSidebar}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            {sidebarWithProps(leftSidebar, true)}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Right Sidebar Drawer - for mobile */}
      <Drawer 
        isOpen={isMobile && isRightSidebarOpen} 
        placement="right" 
        onClose={onCloseRightSidebar}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerHeader>More</DrawerHeader>
          <DrawerBody p={0}>
            {sidebarWithProps(rightSidebar, true)}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
};

export default MainLayout;
