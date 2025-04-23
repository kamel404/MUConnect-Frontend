import {
  Box,
  Flex,
  Text,
  Avatar,
  Badge,
  Divider,
  Button,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  Center,
  useTheme,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiBell, FiCheck, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Animation for the bell icon
const ringBell = keyframes`
  0% { transform: rotate(0); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-15deg); }
  30% { transform: rotate(7deg); }
  40% { transform: rotate(-7deg); }
  50% { transform: rotate(0); }
  100% { transform: rotate(0); }
`;

const NotificationsBox = () => {
  // Popover control
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Theme and colors
  const theme = useTheme();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const cardBgHover = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("brand.navy", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const boxShadow = useColorModeValue(
    "0 4px 20px rgba(0, 0, 0, 0.1)",
    "0 4px 20px rgba(0, 0, 0, 0.3)"
  );
  
  // Animation styling
  const bellAnimation = `${ringBell} 1s ease-in-out`;
  const notifAnimation = useColorModeValue(
    `0 0 8px ${theme.colors.brand?.gold || "#F2D944"}`, 
    `0 0 8px ${theme.colors.brand?.goldDark || "#D9C226"}`
  );
  
  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: "Ahmed Ali",
      avatar: "https://bit.ly/dan-abramov",
      content: "commented on your post",
      time: "2h ago",
      isRead: false,
      link: "/dashboard",
    },
    {
      id: 2,
      user: "Study Group: Computer Architecture",
      avatar: "https://bit.ly/kent-c-dodds",
      content: "New meeting scheduled for tomorrow",
      time: "1d ago",
      isRead: false,
      link: "/study-groups",
    },
    {
      id: 3,
      user: "Nada Ahmed",
      avatar: "https://bit.ly/ryan-florence",
      content: "mentioned you in a comment",
      time: "3d ago",
      isRead: true,
      link: "/dashboard",
    },
  ]);

  const notificationCount = notifications.filter(n => !n.isRead).length;
  const initialFocusRef = useRef();
  const [animate, setAnimate] = useState(false);

  // Trigger animation when notification count changes
  useEffect(() => {
    if (notificationCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [notificationCount]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
      initialFocusRef={initialFocusRef}
      closeOnBlur={true}
      gutter={1}
      strategy="fixed"
    >
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            icon={<FiBell size={20} />}
            aria-label="Notifications"
            variant="ghost"
            position="relative"
            animation={animate ? bellAnimation : undefined}
            _hover={{ 
              transform: "scale(1.05)", 
              bg: cardBgHover,
              transition: "all 0.2s ease-in-out" 
            }}
            transition="all 0.2s ease-in-out"
            borderRadius="full"
          />
          {notificationCount > 0 && (
            <Badge
              position="absolute"
              top="-2px"
              right="-2px"
              bg={accentColor}
              color={primaryColor}
              borderRadius="full"
              boxSize="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
              boxShadow={animate ? notifAnimation : "none"}
              transition="box-shadow 0.3s ease-in-out"
              border="2px solid"
              borderColor={bgColor}
              zIndex={2}
            >
              {notificationCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        w={{ base: "300px", sm: "350px" }}
        maxH="450px"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow={boxShadow}
        borderRadius="xl"
        _focus={{ outline: "none" }}
        overflow="hidden"
      >
        <PopoverArrow bg={bgColor} />
        <PopoverCloseButton color={textColor} size="md" />
        <PopoverHeader
          borderBottom="1px solid"
          borderColor={borderColor}
          p={4}
          fontWeight="bold"
          color={textColor}
          bg={useColorModeValue("gray.50", "gray.750")}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Icon as={FiBell} color={accentColor} />
              <Text fontSize="md">Notifications</Text>
            </HStack>
          </Flex>
        </PopoverHeader>
        <PopoverBody p={0} overflowY="auto" maxH="300px">
          {notifications.length > 0 ? (
            <VStack spacing={0} align="stretch" divider={<Divider borderColor={borderColor} />}>
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  position="relative"
                  bg={notification.isRead ? "transparent" : `${accentColor}10`}
                  _hover={{ bg: cardBgHover }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => {
                    markAsRead(notification.id);
                    onClose();
                  }}
                  as={Link}
                  to={notification.link}
                  borderLeft="3px solid"
                  borderLeftColor={notification.isRead ? "transparent" : accentColor}
                >
                  <Flex align="center">
                    <Box position="relative">
                      <Avatar
                        size="md"
                        src={notification.avatar || undefined}
                        name={notification.avatar ? undefined : notification.user}
                        border="2px solid"
                        borderColor={notification.isRead ? borderColor : accentColor}
                      />
                      {!notification.isRead && (
                        <Badge
                          position="absolute"
                          top="-1"
                          right="-1"
                          bg={accentColor}
                          boxSize="8px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor={bgColor}
                        />
                      )}
                    </Box>
                    <Box ml={4} flex="1">
                      <Flex align="baseline" justify="space-between">
                        <Text
                          fontWeight={notification.isRead ? "medium" : "bold"}
                          fontSize="sm"
                          color={textColor}
                          noOfLines={1}
                        >
                          {notification.user}
                        </Text>
                        <Text fontSize="xs" color={mutedText}>
                          {notification.time}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="sm"
                        color={notification.isRead ? mutedText : textColor}
                        mt={1}
                        noOfLines={2}
                      >
                        {notification.content}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Center py={10}>
              <VStack spacing={2}>
                <Box p={3} borderRadius="full" bg={`${accentColor}20`}>
                  <Icon as={FiBell} fontSize="xl" color={accentColor} />
                </Box>
                <Text fontWeight="medium" color={textColor}>
                  No notifications
                </Text>
                <Text fontSize="sm" color={mutedText} textAlign="center">
                  You're all caught up!
                </Text>
              </VStack>
            </Center>
          )}
        </PopoverBody>
        <PopoverFooter
          p={0}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <Button
            as={Link}
            to="/notifications"
            ref={initialFocusRef}
            variant="ghost"
            size="md"
            color={primaryColor}
            _hover={{ bg: `${accentColor}20` }}
            fontWeight="medium"
            width="100%"
            height="50px"
            borderRadius="0"
            rightIcon={<FiChevronRight />}
            onClick={onClose}
          >
            See All Notifications
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBox;