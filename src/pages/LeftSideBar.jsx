import { Box, Flex, Stack, Button, Divider, Text, Tooltip, Center, useColorModeValue, Menu, MenuButton, MenuItem, MenuList, Avatar, HStack, Icon, Heading } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiInbox, FiFlag, FiUser, FiLogOut, FiChevronDown, FiCalendar, FiCheckSquare, FiBookmark, FiCodesandbox, FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/maaref-logo.png";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LeftSidebar = ({ textColor, mutedText, isCollapsed, onClose }) => {
  const { user } = useAuth();
  const accentColor = useColorModeValue("rgba(250, 202, 21, 0.3)", "rgba(202, 162, 18, 0.3)");
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  
  // Navigation items array for easier management
  const navItems = [
    { icon: FiHome, label: "Home", path: "/dashboard" },
    { icon: FiBook, label: "Resources", path: "/resources" },
    { icon: FiUsers, label: "Study Groups", path: "/study-groups" },
    { icon: FiCalendar, label: "Events", path: "/events" },
    { icon: FiFlag, label: "Clubs", path: "/clubs" },
    // { icon: FiCheckSquare, label: "Degree Chart", path: "/degree-chart" },
    { icon: FiCodesandbox, label: "Grade Calculator", path: "/grade-calculator" },
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
        
        {/* Saved Section - Separated */}
        <Box mt={6}>
          {!isCollapsed && (
            <Text px={3} fontSize="xs" fontWeight="medium" textTransform="uppercase" color={mutedText} mb={2}>
              Personal
            </Text>
          )}
          <Divider mb={3} opacity={0.3} />
          <Stack spacing={3} px={isCollapsed ? 1 : 3}>
            <Tooltip 
              label="Saved" 
              placement="right" 
              isDisabled={!isCollapsed}
              hasArrow
            >
              <Button 
                leftIcon={isCollapsed ? null : <FiBookmark />}
                justifyContent={isCollapsed ? "center" : "flex-start"}
                variant="ghost"
                color={textColor}
                bg={isActive("/saved-resources") ? accentColor : "transparent"}
                onClick={() => handleNavigation("/saved-resources")}
                _hover={{ bg: accentColor }}
                px={isCollapsed ? 2 : 4}
                w="full"
                size="md"
              >
                {!isCollapsed && "Saved"}
                {isCollapsed && <FiBookmark />}
              </Button>
            </Tooltip>
          </Stack>
        </Box>
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
              <Avatar size="sm" name={user ? `${user.first_name} ${user.last_name}` : 'User'} src={user?.avatar_url || user?.avatar} />
              {!isCollapsed && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textColor}>{user ? `${user.first_name} ${user.last_name}` : 'Guest'}</Text>
                  <Text fontSize="xs" color={mutedText}>{userRole}</Text>
                </Box>
              )}
              {!isCollapsed && <Icon as={FiChevronDown} ml="auto" fontSize="sm" color={textColor} />}
            </HStack>
          </MenuButton>
          <MenuList zIndex={1500} shadow="xl">
            <MenuItem icon={<FiSettings />} onClick={() => handleNavigation("/settings")}>Settings</MenuItem>
            <Divider />
            <MenuItem icon={<FiLogOut />} 
              onClick={() => {
                logout();
              }}
            >Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default LeftSidebar;
