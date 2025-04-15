import { Flex, IconButton, Avatar } from "@chakra-ui/react";
import { FiSun, FiMoon, FiMoreHorizontal } from "react-icons/fi";
import NotificationsBox from "../../components/ui/NotificationsBox";
import { Link } from "react-router-dom";

const DashboardTopNav = ({ colorMode, toggleColorMode, isMobile, onRightOpen }) => (
  <Flex align="center" gap={2}>
    <IconButton
      icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
      onClick={toggleColorMode}
      aria-label="Toggle theme"
      variant="ghost"
    />
    <NotificationsBox />
    {isMobile && (
      <IconButton
        icon={<FiMoreHorizontal />}
        variant="ghost"
        aria-label="Open sidebar menu"
        onClick={onRightOpen}
      />
    )}
    <Avatar
      size="sm"
      src="https://bit.ly/dan-abramov"
      as={Link}
      to="/profile"
      _hover={{ cursor: "pointer" }}
    />
  </Flex>
);

export default DashboardTopNav;
