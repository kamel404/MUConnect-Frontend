import {
    Flex,
    Grid,
    Box,
    Heading,
    Text,
    Avatar,
    Button,
    IconButton,
    Card,
    CardBody,
    Stack,
    useColorModeValue,
    useBreakpointValue,
    Icon,
    Badge,
    Image,
    Link,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    useToast,
  } from "@chakra-ui/react";
  import { FiCalendar, FiMapPin, FiBell, FiVideo, FiChevronLeft, FiSearch, FiBookmark } from "react-icons/fi";
  import { useNavigate } from "react-router-dom";
  import { motion } from "framer-motion";
  
  const MotionCard = motion(Card);
  
  const EventsPage = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const bgColor = useColorModeValue("gray.50", "gray.800");
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const isMobile = useBreakpointValue({ base: true, md: false });
  
    const events = [
        {
            id: 1,
            title: "AI Innovation Summit",
            date: "2024-03-15T15:00:00",
            location: "Tech Hub Convention Center",
            organizer: "Future Tech Institute",
            description: "Explore cutting-edge AI advancements with industry leaders",
            attendees: 145,
            media: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "image",
            category: "Conference"
        },
        {
            id: 2,
            title: "UX Design Masterclass",
            date: "2024-03-20T10:00:00",
            location: "Creative Design Studio",
            organizer: "Digital Arts Collective",
            description: "Hands-on workshop with Figma and prototyping tools",
            attendees: 89,
            media: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "image",
            category: "Workshop"
        },
        {
            id: 3,
            title: "Startup Pitch Night",
            date: "2024-04-01T19:00:00",
            location: "Innovation Theater",
            organizer: "Entrepreneurship Network",
            description: "Witness tomorrow's unicorns pitch to top VCs",
            attendees: 212,
            media: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "video",
            category: "Networking"
        },
        {
            id: 4,
            title: "Blockchain Deep Dive",
            date: "2024-04-10T13:00:00",
            location: "Crypto Arena",
            organizer: "Web3 Foundation",
            description: "Understanding smart contracts and DeFi ecosystems",
            attendees: 93,
            media: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "image",
            category: "Workshop"
        },
        {
            id: 5,
            title: "Tech Leadership Forum",
            date: "2024-04-18T09:00:00",
            location: "Executive Conference Hall",
            organizer: "Tech Management Association",
            description: "Leadership strategies for engineering managers",
            attendees: 67,
            media: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "video",
            category: "Conference"
        },
        {
            id: 6,
            title: "DevOps Bootcamp",
            date: "2024-05-02T11:00:00",
            location: "Cloud Computing Lab",
            organizer: "SysOps Academy",
            description: "CI/CD pipelines and infrastructure as code",
            attendees: 124,
            media: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
            mediaType: "image",
            category: "Workshop"
        }
    ];

  
    const EventCard = ({ event }) => (
      <MotionCard
        key={event.id}
        bg={cardBg}
        position="relative"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        boxShadow="lg"
        borderRadius="xl"
      >
        <CardBody p={0}>
          <Stack spacing={4}>
            {/* Media Section */}
            <Box 
              position="relative"
              height="200px"
              overflow="hidden"
            >
              <Image
                src={event.media}
                alt={event.title}
                objectFit="cover"
                width="100%"
                height="100%"
                filter="brightness(0.9)"
              />
              
              <Box
                position="absolute"
                top={4}
                left={4}
                bg="rgba(0,0,0,0.7)"
                p={2}
                borderRadius="lg"
                color="white"
                textAlign="center"
              >
                <Text fontSize="xs" fontWeight="bold">
                  {new Date(event.date).toLocaleDateString("en-US", { month: 'short' }).toUpperCase()}
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  {new Date(event.date).getDate()}
                </Text>
              </Box>
              
              <IconButton
                aria-label="Bookmark event"
                icon={<FiBookmark />}
                position="absolute"
                top={4}
                right={4}
                colorScheme="purple"
                variant="ghost"
                borderRadius="full"
              />
            </Box>
  
            <Stack p={4} spacing={4}>
              <Flex justify="space-between" align="flex-start">
                <Heading size="md" color={textColor} noOfLines={2}>
                  {event.title}
                </Heading>
                <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
                  {event.attendees} Going
                </Badge>
              </Flex>
              
              <Flex direction="column" gap={3}>
                <Flex align="center" gap={2}>
                  <Icon as={FiMapPin} color="purple.500" boxSize={5} />
                  <Text fontSize="sm" color={mutedText}>
                    {event.location}
                  </Text>
                </Flex>
                
                <Flex align="center" gap={2}>
                  <Icon as={FiCalendar} color="purple.500" boxSize={5} />
                  <Text fontSize="sm" color={mutedText}>
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </Text>
                </Flex>
              </Flex>
              
              <Button
                colorScheme="purple"
                variant="solid"
                width="full"
                borderRadius="full"
                onClick={() => {
                  toast({
                    title: 'RSVP Successful!',
                    description: `You're attending ${event.title}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                Get Tickets
              </Button>
            </Stack>
          </Stack>
        </CardBody>
      </MotionCard>
    );
  
    return (
      <Grid templateColumns="1fr" minH="100vh" bg={bgColor}>
        <Box p={{ base: 4, md: 8 }}>
          <Flex
            direction="column"
            mb={8}
            gap={4}
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={4}>
                <IconButton
                  icon={<FiChevronLeft />}
                  onClick={() => navigate(-1)}
                  variant="ghost"
                  borderRadius="full"
                  aria-label="Back"
                />
                <Heading size="xl" color={textColor} fontWeight="extrabold">
                  Upcoming Events
                </Heading>
              </Flex>   
              <Flex align="center" gap={2}>
                <IconButton
                  icon={<FiBell />}
                  aria-label="Notifications"
                  variant="ghost"
                  borderRadius="full"
                />
                <Avatar
                  size="sm"
                  src="https://bit.ly/dan-abramov"
                  _hover={{ transform: 'scale(1.1)', cursor: 'pointer' }}
                  transition="all 0.2s"
                />
              </Flex>
            </Flex>
            
            <InputGroup maxW="600px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search events..."
                borderRadius="full"
                bg={useColorModeValue('white', 'gray.600')}
                _focus={{
                  boxShadow: '0 0 0 2px rgba(159, 122, 234, 0.6)',
                }}
              />
            </InputGroup>
            
            <Flex gap={2} wrap="wrap">
              {['All', 'Workshops', 'Career', 'Hackathons'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                  borderRadius="full"
                  _active={{ bg: 'purple.500', color: 'white' }}
                >
                  {category}
                </Button>
              ))}
            </Flex>
          </Flex>
  
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            }}
            gap={6}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </Grid>
        </Box>
      </Grid>
    );
  };
  
  export default EventsPage;