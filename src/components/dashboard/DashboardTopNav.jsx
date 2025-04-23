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
import { FiMenu, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import NotificationsPopover from "../notifications/NotificationsPopover";

const DashboardTopNav = ({ 
  isMobile, 
  onLeftOpen 
}) => {
  const navigate = useNavigate();
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("rgba(250, 202, 21, 0.3)", "rgba(202, 162, 18, 0.3)");
  return (
    <Flex align="center" gap={2}>
      {/* Notification Popover */}
      <NotificationsPopover />
      
      {/* Profile Menu */}
      <Menu placement="bottom-end" closeOnBlur={true}>
        <MenuButton>
          <Avatar
            size="sm"
            src="https://bit.ly/broken-link"
            cursor="pointer"
            _hover={{ boxShadow: "0 0 0 3px var(--chakra-colors-yellow-400)" }}
            transition="all 0.2s"
          />
        </MenuButton>
        <MenuList
          bg={menuBg}
          borderColor={menuBorderColor}
          boxShadow="lg"
          px={1}
          py={2}
        >
          <MenuItem
            as={Link}
            to="/profile"
            rounded="md"
            px={3}
            py={2}
            _hover={{ bg: accentColor }}
          >
            <Flex align="center">
              <Icon as={FiUser} mr={3} boxSize={5} />
              <Text>Profile</Text>
            </Flex>
          </MenuItem>
          
          <MenuItem
            as={Link}
            to="/settings"
            rounded="md"
            px={3}
            py={2}
            _hover={{ bg: accentColor }}
          >
            <Flex align="center">
              <Icon as={FiSettings} mr={3} boxSize={5} />
              <Text>Settings</Text>
            </Flex>
          </MenuItem>
          
          <MenuDivider my={2} />
          
          <MenuItem
            rounded="md"
            px={3}
            py={2}
            _hover={{ bg: accentColor }}
          >
            <Flex align="center">
              <Icon as={FiLogOut} mr={3} boxSize={5} />
              <Text>Logout</Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default DashboardTopNav;
