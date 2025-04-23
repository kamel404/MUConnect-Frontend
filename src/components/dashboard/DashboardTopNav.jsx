import { Flex, IconButton, Avatar, Tooltip } from "@chakra-ui/react";
import { FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import NotificationsPopover from "../notifications/NotificationsPopover";

const DashboardTopNav = ({ 
  colorMode, 
  toggleColorMode, 
  isMobile, 
  onLeftOpen 
}) => {
  return (
    <Flex align="center" gap={2}>
      <Tooltip label="Toggle color mode">
        <IconButton
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
        />
      </Tooltip>
      
      {/* Replaced direct navigation with popover */}
      <NotificationsPopover />
      
      <Tooltip label="Profile">
        <Avatar
          size="sm"
          src="https://bit.ly/broken-link"
          cursor="pointer" 
          as={Link}
          to="/profile"
        />
      </Tooltip>
    </Flex>
  );
};

export default DashboardTopNav;
