import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Image,
  useColorModeValue,
  Flex,
  Heading,
  IconButton ,
  Avatar,
  Tooltip
} from '@chakra-ui/react';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiBookmark, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const EventCard = ({ event, onBookmark, onCardClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!event || !event.data) {
    return (
      <MotionBox
        p={5}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        bg={cardBg}
        textAlign="center"
      >
        <Text color={mutedColor}>This saved item is no longer available.</Text>
      </MotionBox>
    );
  }

  const { title, event_datetime, location, organizer, attendees_count, image_path, is_club_event, club } = event.data;

  const formattedDate = new Date(event_datetime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(event_datetime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <MotionBox
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      whileHover={{ y: -5, boxShadow: 'lg' }}
      transition={{ type: 'spring', stiffness: 300 }}
      cursor="pointer"
      onClick={() => onCardClick(event.data.id)}
    >
      <Box position="relative">
        <Image src={`http://127.0.0.1:8000/storage/${image_path}`} alt={title} objectFit="cover" w="100%" h="200px" />
        <HStack position="absolute" top={2} right={2} spacing={2}>
          <Tooltip label={event.isSaved ? 'Unsave' : 'Save'} placement="top">
            <IconButton
              icon={<FiBookmark fill={event.isSaved ? 'currentColor' : 'none'} />}
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(event.data.id, 'Event');
              }}
              size="sm"
              borderRadius="full"
              bg="rgba(0,0,0,0.6)"
              color="white"
              _hover={{ bg: 'rgba(0,0,0,0.8)' }}
              aria-label="Bookmark Event"
            />
          </Tooltip>
        </HStack>
      </Box>

      <VStack p={4} align="start" spacing={3}>
        <Heading size="md" color={textColor} noOfLines={2}>
          {title}
        </Heading>

        <VStack align="start" spacing={2} color={mutedColor}>
          <HStack>
            <Icon as={FiCalendar} />
            <Text>{formattedDate}</Text>
          </HStack>
          <HStack>
            <Icon as={FiClock} />
            <Text>{formattedTime}</Text>
          </HStack>
          <HStack>
            <Icon as={FiMapPin} />
            <Text>{location}</Text>
          </HStack>
        </VStack>

        <Flex justify="space-between" align="center" w="100%" mt={3}>
          <HStack>
            {is_club_event && club ? (
              <>
                <Avatar size="xs" name={club.name} src={`http://127.0.0.1:8000/storage/${club.logo_path}`} />
                <Text fontSize="sm" fontWeight="bold">{club.name}</Text>
              </>
            ) : (
              <Text fontSize="sm">Organized by: {organizer}</Text>
            )}
          </HStack>

          <HStack spacing={1} align="center">
            <Icon as={FiUsers} />
            <Text fontSize="sm">{attendees_count}</Text>
          </HStack>
        </Flex>
      </VStack>
    </MotionBox>
  );
};

export default EventCard;
