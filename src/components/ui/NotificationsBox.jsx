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
import { useNotifications } from "../../context/NotificationsContext";
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
  // Get notifications from context
  const { 
    unreadNotifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

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

  const initialFocusRef = useRef();
  const [animate, setAnimate] = useState(false);

  // Trigger animation when notification count changes
  useEffect(() => {
    if (unreadCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  return (
    <Popover
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
          {unreadCount > 0 && (
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
              {unreadCount}
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
          {loading ? (
            <Center py={10}><Text color={mutedText}>Loading notifications...</Text></Center>
          ) : error ? (
            <Center py={10}><Text color="red.400">{error}</Text></Center>
          ) : unreadNotifications.length > 0 ? (
            <VStack spacing={0} align="stretch" divider={<Divider borderColor={borderColor} />}>
              {unreadNotifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={4}
                  position="relative"
                  bg={notification.isRead ? "transparent" : `${accentColor}10`}
                  _hover={{ bg: cardBgHover }}
                  transition="all 0.2s"
                  cursor="pointer"
                  onClick={() => markAsRead(notification.id)}
                  borderLeft="3px solid"
                  borderLeftColor={notification.isRead ? "transparent" : accentColor}
                >
                  <Flex align="center">
                    <Box position="relative">
                      <Avatar
                        size="md"
                        name={notification.user}
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
          >
            See All Notifications
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBox;
