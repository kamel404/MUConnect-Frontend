import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Badge,
  Divider,
  useColorModeValue,
  IconButton,
  Button,
  VStack,
  HStack,
  Icon,
  Container,
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import { FiArrowLeft, FiTrash2, FiBell, FiCheck, FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";

const Notifications = () => {
  // Colors
  const bgColor = useColorModeValue("#f0f4f8", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("brand.navy", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const boxShadow = useColorModeValue(
    "0 4px 20px rgba(0, 0, 0, 0.1)",
    "0 4px 20px rgba(0, 0, 0, 0.3)"
  );
  const cardBgHover = useColorModeValue("gray.50", "gray.700");
  
  // Responsive design
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Sample notification data
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
    {
      id: 4,
      user: "CS 301",
      avatar: "https://bit.ly/code-beast",
      content: "New course material available",
      time: "5d ago",
      isRead: true,
      link: "/courses/301",
    },
    {
      id: 5,
      user: "System",
      avatar: "",
      content: "Welcome to MU Connect! Complete your profile to get started.",
      time: "1w ago",
      isRead: true,
      link: "/profile",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Box minH="100vh" bg={bgColor} py={{ base: 4, md: 8 }} px={{ base: 3, md: 6 }}>
      <Container maxW="900px">
        <Flex
          direction="column"
          mx="auto"
          bg={cardBg}
          borderRadius="xl"
          overflow="hidden"
          boxShadow={boxShadow}
        >
          <Flex
            p={4}
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.750")}
          >
            <HStack spacing={3}>
              <IconButton
                as={Link}
                to="/dashboard"
                icon={<FiChevronLeft size={18} />}
                variant="ghost"
                aria-label="Go back"
                color={textColor}
                borderRadius="full"
                size="md"
                _hover={{ bg: `${accentColor}20` }}
              />
              <Icon as={FiBell} color={accentColor} boxSize={5} />
              <Heading size="md" color={textColor}>
                Notifications
              </Heading>
              {unreadCount > 0 && (
                <Badge
                  px={2}
                  py={1}
                  bg={accentColor}
                  color={primaryColor}
                  borderRadius="full"
                  fontWeight="medium"
                >
                  {unreadCount} new
                </Badge>
              )}
            </HStack>
            <Button
              size="sm"
              colorScheme="gray"
              variant="ghost"
              onClick={markAllAsRead}
              leftIcon={<FiCheck />}
              isDisabled={unreadCount === 0}
              _hover={{ bg: `${accentColor}20` }}
            >
              Mark all as read
            </Button>
          </Flex>

          <Box>
            {notifications.length > 0 ? (
              <VStack spacing={0} align="stretch" divider={<Divider borderColor={borderColor} />}>
                {notifications.map((notification) => (
                  <Box key={notification.id}>
                    <Flex
                      p={5}
                      position="relative"
                      bg={notification.isRead ? "transparent" : `${accentColor}10`}
                      _hover={{ bg: cardBgHover }}
                      transition="all 0.2s ease"
                      borderLeft="3px solid"
                      borderLeftColor={notification.isRead ? "transparent" : accentColor}
                    >
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
                            boxSize="10px"
                            borderRadius="full"
                            border="2px solid"
                            borderColor={cardBg}
                          />
                        )}
                      </Box>
                      <Box ml={4} flex="1" as={Link} to={notification.link}>
                        <Flex align="baseline" justify="space-between">
                          <Text 
                            fontWeight={notification.isRead ? "medium" : "bold"} 
                            color={textColor}
                          >
                            {notification.user}
                          </Text>
                          <Text fontSize="sm" color={mutedText}>
                            {notification.time}
                          </Text>
                        </Flex>
                        <Text mt={1} color={notification.isRead ? mutedText : textColor}>
                          {notification.content}
                        </Text>
                      </Box>
                      <IconButton
                        icon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        aria-label="Delete notification"
                        alignSelf="center"
                        borderRadius="full"
                        opacity={0.7}
                        _hover={{ opacity: 1 }}
                      />
                    </Flex>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Center py={16}>
                <VStack spacing={4}>
                  <Box 
                    p={4} 
                    borderRadius="full" 
                    bg={`${accentColor}20`}
                  >
                    <Icon 
                      as={FiBell} 
                      fontSize="3xl" 
                      color={accentColor} 
                    />
                  </Box>
                  <Heading size="md" color={textColor}>
                    No notifications
                  </Heading>
                  <Text color={mutedText} textAlign="center" maxW="350px">
                    You're all caught up! Check back later for updates and activities from your courses and study groups.
                  </Text>
                  <Button 
                    as={Link} 
                    to="/dashboard"
                    mt={2}
                    leftIcon={<FiArrowLeft />}
                    colorScheme="gray" 
                    variant="outline"
                    _hover={{ bg: `${accentColor}20`, borderColor: accentColor }}
                  >
                    Return to Dashboard
                  </Button>
                </VStack>
              </Center>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Notifications;
