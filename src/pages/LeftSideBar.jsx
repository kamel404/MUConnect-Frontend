import { Box, Flex, Heading, Stack, Button, Divider, Text, Tooltip, Center } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiInbox, FiFlag } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/maaref-logo.png";

const LeftSidebar = ({ textColor, mutedText, highlightBg, isCollapsed, onClose }) => {
  const navigate = useNavigate();
  
  // Navigation items array for easier management
  const navItems = [
    { icon: FiHome, label: "Home", path: "/dashboard" },
    { icon: FiUsers, label: "Study Groups", path: "/study-groups" },
    { icon: FiBook, label: "Resources", path: "/resources" },
    { icon: FiFlag, label: "Clubs", path: "/clubs" },
    { icon: FiInbox, label: "Requests", path: "/requests" },
  ];

  // Resource items array
  const resourceItems = [
    { label: "CS 301", path: "/resources/cs301" },
    { label: "MATH 202", path: "/resources/math202" },
  ];

  // Handle navigation with closing
  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box>
      <Flex direction="column" gap={5}>
        <Center mb={4}>
          <img 
            src={logo} 
            alt="maaref Logo" 
            style={{ 
              maxWidth: isCollapsed ? "40px" : "60px", 
              height: "auto"
            }} 
          />
        </Center>
        
        <Stack spacing={2}>
          {navItems.map((item) => (
            <Tooltip 
              key={item.path} 
              label={item.label} 
              placement="right" 
              isDisabled={!isCollapsed}
            >
              <Button 
                leftIcon={isCollapsed ? null : <item.icon />}
                icon={isCollapsed ? <item.icon /> : null}
                justifyContent={isCollapsed ? "center" : "flex-start"}
                variant="ghost"
                color={textColor}
                onClick={() => handleNavigation(item.path)}
                _hover={{ bg: highlightBg }}
                px={isCollapsed ? 2 : 4}
              >
                {!isCollapsed && item.label}
                {isCollapsed && <item.icon />}
              </Button>
            </Tooltip>
          ))}
        </Stack>
        
        {!isCollapsed && <Divider mt={4} mb={4} />}
        
        {!isCollapsed && (
          <Text fontSize="sm" color={mutedText} mt={4}>
            Your Resources
          </Text>
        )}
        
        <Stack spacing={2} display={isCollapsed ? "none" : "flex"}>
          {resourceItems.map((item) => (
            <Button 
              key={item.label}
              variant="ghost" 
              justifyContent="flex-start" 
              color={textColor} 
              _hover={{ bg: highlightBg }}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
};

export default LeftSidebar;
