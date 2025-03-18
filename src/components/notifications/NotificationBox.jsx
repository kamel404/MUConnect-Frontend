import React, { useState } from 'react';
import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  IconButton,
  Text,
  Flex,
  Badge,
  Avatar,
  Button,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotificationBox = ({ notifications = [], onMarkRead, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Default handlers if not provided
  const handleMarkRead = onMarkRead || (() => {});
  const handleClear = onClear || (() => {});
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-end"
      closeOnBlur={true}
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            icon={<FiBell />}
            aria-label="Notifications"
            variant="ghost"
            borderRadius="full"
            onClick={() => setIsOpen(!isOpen)}
          />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              position="absolute"
              top="-2px"
              right="-2px"
              fontSize="0.8em"
              minW="1.6em"
              textAlign="center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent width="350px" maxH="500px" overflowY="auto" shadow="xl">
        <PopoverArrow />
        <PopoverHeader fontWeight="bold">
          <Flex justifyContent="space-between" alignItems="center">
            <Text>Notifications</Text>
            {unreadCount > 0 && (
              <Button
                size="xs"
                variant="ghost"
                colorScheme="blue"
                leftIcon={<FiCheck />}
                onClick={handleMarkRead}
                borderRadius="md"
              >
                Mark all as read
              </Button>
            )}
          </Flex>
        </PopoverHeader>
        <PopoverBody p={0}>
          {notifications.length === 0 ? (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={6} 
              color={mutedText}
            >
              <FiBell size={24} />
              <Text mt={2}>No notifications</Text>
            </Flex>
          ) : (
            <Box>
              {notifications.map((notification, index) => (
                <Box key={notification.id || index}>
                  <Flex 
                    p={3} 
                    _hover={{ bg: hoverBg }} 
                    borderLeftWidth="4px"
                    borderLeftColor={notification.read ? 'transparent' : 'blue.500'}
                    align="flex-start"
                    gap={3}
                  >
                    <Avatar 
                      size="sm" 
                      src={notification.avatar || "https://bit.ly/broken-link"} 
                      name={notification.from || "User"}
                    />
                    <Box flex={1}>
                      <Text fontWeight={notification.read ? 'normal' : 'bold'} fontSize="sm">
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color={mutedText}>
                        {notification.time}
                      </Text>
                    </Box>
                  </Flex>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          )}
        </PopoverBody>
        {notifications.length > 0 && (
          <PopoverFooter>
            <Flex justify="space-between">
              <Button 
                size="sm" 
                colorScheme="red" 
                variant="ghost" 
                leftIcon={<FiTrash2 />}
                onClick={handleClear}
                borderRadius="md"
              >
                Clear all
              </Button>
              <Button 
                size="sm" 
                colorScheme="blue" 
                variant="link"
                onClick={() => setIsOpen(false)}
                as={Link}
                to="/notifications"
                borderRadius="md"
              >
                View all
              </Button>
            </Flex>
          </PopoverFooter>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBox;
