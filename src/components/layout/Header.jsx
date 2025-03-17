import { Flex, Heading, IconButton, Avatar, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FiMenu, FiMoon, FiSun, FiBell, FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";

const Header = ({ 
  title, 
  isMobile, 
  onOpenLeftSidebar, 
  onOpenRightSidebar 
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      align={isMobile ? "flex-start" : "center"}
      justify="space-between"
      mb={6}
      gap={isMobile ? 4 : 0}
    >
      <Flex align="center" gap={2}>
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open navigation menu"
            onClick={onOpenLeftSidebar}
          />
        )}
        <Heading size="lg" color={textColor}>
          {title}
        </Heading>
      </Flex>
      <Flex align="center" gap={2}>
        <IconButton
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          aria-label="Toggle theme"
          variant="ghost"
        />
        <IconButton
          icon={<FiBell />}
          aria-label="Notifications"
          variant="ghost"
        />
        {isMobile && (
          <IconButton
            icon={<FiMoreHorizontal />}
            variant="ghost"
            aria-label="Open more menu"
            onClick={onOpenRightSidebar}
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
    </Flex>
  );
};

export default Header;
