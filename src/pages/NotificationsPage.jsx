import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Avatar,
  Badge,
  IconButton,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiChevronLeft, FiCheck, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Sample notifications data - in a real app, this would be fetched from an API or context
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Sarah Kim mentioned you in a comment",
      from: "Sarah Kim",
      avatar: "https://bit.ly/sage-adebayo",
      time: "10 min ago",
      read: false,
      type: "mention"
    },
    {
      id: 2,
      message: "New course materials available for CS301",
      from: "CS301 Instructor",
      avatar: "https://bit.ly/kent-c-dodds",
      time: "2h ago",
      read: false,
      type: "course"
    },
    {
      id: 3,
      message: "Alex Johnson replied to your post",
      from: "Alex Johnson",
      avatar: "https://bit.ly/ryan-florence",
      time: "1d ago",
      read: true,
      type: "reply"
    },
    {
      id: 4,
      message: "Your submission for Math 202 has been graded",
      from: "Math Department",
      avatar: "https://bit.ly/prosper-baba",
      time: "2d ago",
      read: true,
      type: "grade"
    },
    {
      id: 5,
      message: "Reminder: Study group meeting tonight at 7pm",
      from: "Study Group",
      avatar: "https://bit.ly/code-beast",
      time: "3d ago",
      read: true,
      type: "event"
    }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MainLayout
      leftSidebar={<LeftSidebar />}
      rightSidebar={<RightSidebar />}
    >
      <Container maxW="container.lg" py={5}>
        <Flex direction="column" gap={5}>
          <Flex align="center" gap={4}>
            <IconButton
              icon={<FiChevronLeft />}
              aria-label="Go back"
              onClick={() => navigate(-1)}
              variant="ghost"
              size="md"
              borderRadius="full"
            />
            <Heading size="lg" color={textColor}>Notifications</Heading>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue">
            <Flex justify="space-between" align="center" mb={4}>
              <TabList>
                <Tab>All</Tab>
                <Tab>Unread {unreadCount > 0 && <Badge ml={2} colorScheme="red">{unreadCount}</Badge>}</Tab>
              </TabList>
              
              <Flex gap={2}>
                {unreadCount > 0 && (
                  <Button 
                    leftIcon={<FiCheck />} 
                    size="sm" 
                    colorScheme="blue" 
                    variant="outline"
                    onClick={handleMarkAllAsRead}
                    borderRadius="md"
                  >
                    Mark all as read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button 
                    leftIcon={<FiTrash2 />} 
                    size="sm" 
                    colorScheme="red" 
                    variant="outline"
                    onClick={handleClearAllNotifications}
                    borderRadius="md"
                  >
                    Clear all
                  </Button>
                )}
              </Flex>
            </Flex>

            <TabPanels>
              <TabPanel p={0}>
                {notifications.length === 0 ? (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10} 
                    color={mutedText}
                    bg={bgColor}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    minH="200px"
                  >
                    <Text mb={4}>No notifications</Text>
                    <Button as={Link} to="/dashboard" colorScheme="blue" size="sm" borderRadius="md">
                      Back to home
                    </Button>
                  </Flex>
                ) : (
                  <Box 
                    borderRadius="lg" 
                    overflow="hidden" 
                    border="1px" 
                    borderColor={borderColor}
                    bg={bgColor}
                  >
                    {notifications.map((notification, index) => (
                      <React.Fragment key={notification.id}>
                        <Box 
                          p={4} 
                          _hover={{ bg: hoverBg }} 
                          bg={notification.read ? bgColor : hoverBg}
                          borderLeftWidth="4px"
                          borderLeftColor={notification.read ? 'transparent' : 'blue.500'}
                        >
                          <Flex justify="space-between" align="flex-start">
                            <Flex gap={3}>
                              <Avatar 
                                size="md" 
                                src={notification.avatar} 
                                name={notification.from}
                              />
                              <Box>
                                <Text 
                                  fontWeight={notification.read ? 'normal' : 'bold'} 
                                  color={textColor}
                                >
                                  {notification.message}
                                </Text>
                                <Flex gap={2} mt={1} align="center">
                                  <Text fontSize="sm" color={mutedText}>
                                    {notification.from}
                                  </Text>
                                  <Text fontSize="xs" color={mutedText}>
                                    •
                                  </Text>
                                  <Text fontSize="sm" color={mutedText}>
                                    {notification.time}
                                  </Text>
                                </Flex>
                              </Box>
                            </Flex>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                                aria-label="Options"
                                borderRadius="full"
                              />
                              <MenuList>
                                {!notification.read && (
                                  <MenuItem 
                                    icon={<FiCheck />} 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </MenuItem>
                                )}
                                <MenuItem 
                                  icon={<FiTrash2 />} 
                                  onClick={() => handleDeleteNotification(notification.id)}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </Box>
                        {index < notifications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Box>
                )}
              </TabPanel>
              <TabPanel p={0}>
                {unreadCount === 0 ? (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={10} 
                    color={mutedText}
                    bg={bgColor}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                    minH="200px"
                  >
                    <Text mb={2}>No unread notifications</Text>
                    <Button as={Link} to="/" colorScheme="blue" size="sm" borderRadius="md">
                      Back to home
                    </Button>
                  </Flex>
                ) : (
                  <Box 
                    borderRadius="lg" 
                    overflow="hidden" 
                    border="1px" 
                    borderColor={borderColor}
                    bg={bgColor}
                  >
                    {notifications
                      .filter(notification => !notification.read)
                      .map((notification, index, filteredArr) => (
                        <React.Fragment key={notification.id}>
                          <Box 
                            p={4} 
                            _hover={{ bg: hoverBg }} 
                            bg={hoverBg}
                            borderLeftWidth="4px"
                            borderLeftColor="blue.500"
                          >
                            <Flex justify="space-between" align="flex-start">
                              <Flex gap={3}>
                                <Avatar 
                                  size="md" 
                                  src={notification.avatar} 
                                  name={notification.from}
                                />
                                <Box>
                                  <Text 
                                    fontWeight="bold" 
                                    color={textColor}
                                  >
                                    {notification.message}
                                  </Text>
                                  <Flex gap={2} mt={1} align="center">
                                    <Text fontSize="sm" color={mutedText}>
                                      {notification.from}
                                    </Text>
                                    <Text fontSize="xs" color={mutedText}>
                                      •
                                    </Text>
                                    <Text fontSize="sm" color={mutedText}>
                                      {notification.time}
                                    </Text>
                                  </Flex>
                                </Box>
                              </Flex>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<FiMoreVertical />}
                                  variant="ghost"
                                  size="sm"
                                  aria-label="Options"
                                  borderRadius="full"
                                />
                                <MenuList>
                                  <MenuItem 
                                    icon={<FiCheck />} 
                                    onClick={() => handleMarkAsRead(notification.id)}
                                  >
                                    Mark as read
                                  </MenuItem>
                                  <MenuItem 
                                    icon={<FiTrash2 />} 
                                    onClick={() => handleDeleteNotification(notification.id)}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Flex>
                          </Box>
                          {index < filteredArr.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Container>
    </MainLayout>
  );
};

export default NotificationsPage;
