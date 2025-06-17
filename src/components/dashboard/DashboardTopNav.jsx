import { 
  Flex, 
  IconButton, 
  Avatar, 
  Tooltip, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  MenuDivider,
  Box,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import NotificationsPopover from "../notifications/NotificationsPopover";

const DashboardTopNav = ({ 
  isMobile, 
  onLeftOpen,
  colorMode,
  toggleColorMode 
}) => {
  const navigate = useNavigate();
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("rgba(250, 202, 21, 0.3)", "rgba(202, 162, 18, 0.3)");
  return (
    <Flex align="center" gap={2} ml="auto">
      {/* Color Mode Toggle */}
      <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
        <IconButton
          size="md"
          variant="ghost"
          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          aria-label={`Toggle ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
        />
      </Tooltip>
      
      {/* Notification Popover */}
      <NotificationsPopover />
    </Flex>
  );
};

export default DashboardTopNav;
