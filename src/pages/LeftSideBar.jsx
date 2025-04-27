import { Box, Flex, Stack, Button, Divider, Text, Tooltip, Center, useColorModeValue, Menu, MenuButton, MenuItem, MenuList, Avatar, HStack, Icon } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiInbox, FiFlag, FiUser, FiLogOut, FiChevronDown, FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/maaref-logo.png";

const LeftSidebar = ({ textColor, mutedText, isCollapsed, onClose }) => {
  const accentColor = useColorModeValue("rgba(250, 202, 21, 0.3)", "rgba(202, 162, 18, 0.3)");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items array for easier management
  const navItems = [
    { icon: FiHome, label: "Home", path: "/dashboard" },
    { icon: FiBook, label: "Resources", path: "/resources" },
    { icon: FiUsers, label: "Study Groups", path: "/study-groups" },
    { icon: FiFlag, label: "Clubs", path: "/clubs" },
    { icon: FiInbox, label: "Requests", path: "/requests" },
  ];

  // Handle navigation with closing
  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };
  
  // Check if path is active
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <Flex direction="column" h="100%" justify="space-between">
      {/* Top section with logo */}
      <Box>
        <Center py={4} mb={2}>
          <img 
            src={logo} 
            alt="maaref Logo" 
            style={{ 
              maxWidth: isCollapsed ? "40px" : "60px", 
              height: "auto",
              transition: "max-width 0.3s ease"
            }} 
          />
        </Center>
        
        {/* Main Navigation */}
        <Stack spacing={3} px={isCollapsed ? 1 : 3}>
          {navItems.map((item) => (
            <Tooltip 
              key={item.path} 
              label={item.label} 
              placement="right" 
              isDisabled={!isCollapsed}
              hasArrow
            >
              <Button 
                leftIcon={isCollapsed ? null : <item.icon />}
                justifyContent={isCollapsed ? "center" : "flex-start"}
                variant="ghost"
                color={textColor}
                bg={isActive(item.path) ? accentColor : "transparent"}
                onClick={() => handleNavigation(item.path)}
                _hover={{ bg: accentColor }}
                px={isCollapsed ? 2 : 4}
                w="full"
                size="md"
              >
                {!isCollapsed && item.label}
                {isCollapsed && <item.icon />}
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Box>
      
      {/* Profile section at bottom */}
      <Box px={isCollapsed ? 1 : 3} py={4} mt="auto">
        <Divider mb={4} />
        <Menu placement="top-end" strategy="fixed" offset={[0, 10]}>
          <MenuButton
            as={Button}
            variant="ghost"
            w="full"
            py={2}
            borderRadius="md"
            textAlign="left"
            _hover={{ bg: accentColor }}
          >
            <HStack spacing={3} justify={isCollapsed ? "center" : "flex-start"}>
              <Avatar size="sm" name="John Doe" src="https://bit.ly/sage-adebayo" />
              {!isCollapsed && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>John Doe</Text>
                  <Text fontSize="xs" color={mutedText}>Student</Text>
                </Box>
              )}
              {!isCollapsed && <Icon as={FiChevronDown} ml="auto" fontSize="sm" color={textColor} />}
            </HStack>
          </MenuButton>
          <MenuList zIndex={1500} shadow="xl">
            <MenuItem icon={<FiUser />} onClick={() => handleNavigation("/profile")}>My Profile</MenuItem>
            <MenuItem icon={<FiSettings />} onClick={() => handleNavigation("/settings")}>Settings</MenuItem>
            <Divider />
            <MenuItem icon={<FiLogOut />}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default LeftSidebar;
