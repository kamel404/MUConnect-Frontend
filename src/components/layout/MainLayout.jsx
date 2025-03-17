import React from 'react';
import { Grid, Box, useBreakpointValue, useColorModeValue, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody } from "@chakra-ui/react";
import { useState } from "react";

const MainLayout = ({ leftSidebar, rightSidebar, children }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();

  // Pass the sidebar control functions to children via React.cloneElement
  // This allows us to open the sidebars from the header in mobile view
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        onOpenLeftSidebar: onLeftOpen,
        onOpenRightSidebar: onRightOpen,
        isMobile
      });
    }
    return child;
  });

  return (
    <Grid templateColumns={isMobile ? "1fr" : "240px 1fr 300px"} minH="100vh" bg={bgColor}>
      {/* Left Sidebar - visible on desktop */}
      {!isMobile && (
        <Box bg={cardBg} p={4} borderRight="1px solid" borderColor={borderColor}>
          {leftSidebar}
        </Box>
      )}

      {/* Main Content */}
      <Box p={6}>
        {childrenWithProps}
      </Box>

      {/* Right Sidebar - visible on desktop */}
      {!isMobile && (
        <Box bg={cardBg} p={6} borderLeft="1px solid" borderColor={borderColor}>
          {rightSidebar}
        </Box>
      )}

      {/* Left Sidebar Drawer - for mobile */}
      <Drawer isOpen={isLeftOpen} placement="left" onClose={onLeftClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            {leftSidebar}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Right Sidebar Drawer - for mobile */}
      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>More</DrawerHeader>
          <DrawerBody>
            {rightSidebar}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
};

export default MainLayout;
