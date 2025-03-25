import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  useColorModeValue,
  Badge,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Avatar,
  Wrap,
  WrapItem,
  useBreakpointValue,
  SimpleGrid,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from "@chakra-ui/react";
import { 
  FiSearch, 
  FiUsers, 
  FiCalendar, 
  FiArrowRight, 
  FiArrowLeft, 
  FiStar, 
  FiMessageSquare,
  FiMapPin,
  FiFilter
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const ClubsPage = () => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const badgeBg = useColorModeValue("gray.100", "gray.600");
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const clubs = [
    {
      id: 1,
      name: "Coding Club",
      description: "Bring your programming skills to the next level with hackathons, workshops, and coding competitions.",
      category: "Technology",
      members: 87,
      founded: "2022",
      meetingSchedule: "Tuesdays, 5:00 PM",
      location: "Computer Science Building, Room 305",
      logo: "https://via.placeholder.com/150?text=Coding+Club",
      featured: true,
      tags: ["Programming", "Web Dev", "AI", "Machine Learning"],
      leaders: [
        { name: "Sarah Johnson", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Michael Chen", role: "Vice President", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Hackathon Weekend"
    },
    {
      id: 2,
      name: "Debate Society",
      description: "Improve your public speaking and critical thinking skills through structured debates and discussions.",
      category: "Academic",
      members: 45,
      founded: "2015",
      meetingSchedule: "Wednesdays, 6:30 PM",
      location: "Humanities Building, Room 202",
      logo: "https://via.placeholder.com/150?text=Debate+Society",
      featured: false,
      tags: ["Public Speaking", "Critical Thinking", "Politics", "Current Events"],
      leaders: [
        { name: "Emily Wilson", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Daniel Park", role: "Secretary", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Invitational Debate Tournament"
    },
    {
      id: 3,
      name: "Photography Club",
      description: "Explore the art of photography through workshops, photo walks, and exhibitions of student work.",
      category: "Arts",
      members: 62,
      founded: "2018",
      meetingSchedule: "Mondays, 4:00 PM",
      location: "Arts Building, Studio 3",
      logo: "https://via.placeholder.com/150?text=Photo+Club",
      featured: true,
      tags: ["Photography", "Digital Editing", "Visual Arts"],
      leaders: [
        { name: "Jessica Lee", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Ryan Thompson", role: "Treasurer", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Campus Photo Exhibition"
    },
    {
      id: 4,
      name: "Pre-Med Society",
      description: "Support for students pursuing careers in medicine through mentorship, workshops, and volunteer opportunities.",
      category: "Academic",
      members: 93,
      founded: "2014",
      meetingSchedule: "Thursdays, 5:30 PM",
      location: "Life Sciences Building, Room 105",
      logo: "https://via.placeholder.com/150?text=Pre-Med",
      featured: false,
      tags: ["Medicine", "Healthcare", "Biology", "Volunteering"],
      leaders: [
        { name: "Amir Hassan", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Sophia Garcia", role: "Vice President", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Medical School Application Workshop"
    },
    {
      id: 5,
      name: "Chess Club",
      description: "For beginners and masters alike. Regular tournaments, casual play, and strategy discussions.",
      category: "Gaming",
      members: 38,
      founded: "2019",
      meetingSchedule: "Fridays, 3:00 PM",
      location: "Student Union, Game Room",
      logo: "https://via.placeholder.com/150?text=Chess+Club",
      featured: false,
      tags: ["Chess", "Strategy", "Tournaments", "Logic"],
      leaders: [
        { name: "Victor Nguyen", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Olivia Kim", role: "Secretary", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Weekend Chess Tournament"
    },
    {
      id: 6,
      name: "Environmental Action",
      description: "Advocating for sustainability on campus and beyond through projects, education, and activism.",
      category: "Activism",
      members: 72,
      founded: "2017",
      meetingSchedule: "Tuesdays, 7:00 PM",
      location: "Environmental Studies Center",
      logo: "https://via.placeholder.com/150?text=Env+Action",
      featured: true,
      tags: ["Environment", "Sustainability", "Climate", "Activism"],
      leaders: [
        { name: "Maya Peterson", role: "President", avatar: "https://via.placeholder.com/150" },
        { name: "Jordan Taylor", role: "Project Coordinator", avatar: "https://via.placeholder.com/150" }
      ],
      upcomingEvent: "Campus Cleanup Day"
    }
  ];

  const categories = ["All", "Technology", "Academic", "Arts", "Gaming", "Activism", "Sports"];

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        {/* Header */}
        <Flex
          justify="space-between"
          align={isMobile ? "flex-start" : "center"}
          mb={6}
          direction={isMobile ? "column" : "row"}
          gap={4}
        >
          <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
              University Clubs
            </Heading>
          </HStack>
        </Flex>

        {/* Tabs and Controls */}
        <Tabs colorScheme="blue" mb={6} variant="soft-rounded">
          <Flex 
            justify="space-between" 
            align={isMobile ? "flex-start" : "center"} 
            direction={isMobile ? "column" : "row"}
            gap={4}
            mb={4}
          >
            <TabList>
              <Tab>All Clubs</Tab>
              <Tab>My Clubs</Tab>
              <Tab>Featured</Tab>
            </TabList>
            
            <HStack spacing={4}>
              <Button leftIcon={<FiFilter />} size="sm" variant="outline">
                Filter
              </Button>
              <InputGroup maxW="250px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={mutedText} />
                </InputLeftElement>
                <Input
                  placeholder="Search clubs..."
                  size="sm"
                  borderRadius="full"
                  _focus={{
                    boxShadow: `0 0 0 2px ${accentColor}`,
                  }}
                />
              </InputGroup>
            </HStack>
          </Flex>
          
          {/* Category Tags */}
          <Wrap spacing={3} mb={6}>
            {categories.map((category) => (
              <WrapItem key={category}>
                <Tag 
                  size="md" 
                  variant={category === "All" ? "solid" : "subtle"} 
                  colorScheme={category === "All" ? "blue" : "gray"}
                  borderRadius="full"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                >
                  <TagLabel>{category}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>

          <TabPanels>
            {/* All Clubs Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {clubs.map((club) => (
                  <MotionCard
                    key={club.id}
                    bg={cardBg}
                    boxShadow="md"
                    borderRadius="lg"
                    overflow="hidden"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box position="relative">
                      <Image 
                        src={club.logo} 
                        alt={`${club.name} logo`} 
                        height="130px"
                        width="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x130?text=Club+Image"
                      />
                      <Badge
                        position="absolute"
                        top="10px"
                        right="10px"
                        colorScheme={
                          club.category === "Technology" ? "blue" :
                          club.category === "Academic" ? "purple" :
                          club.category === "Arts" ? "pink" :
                          club.category === "Gaming" ? "green" :
                          club.category === "Activism" ? "orange" :
                          "gray"
                        }
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {club.category}
                      </Badge>
                      {club.featured && (
                        <Badge
                          position="absolute"
                          top="10px"
                          left="10px"
                          colorScheme="yellow"
                          borderRadius="full"
                          px={2}
                          py={1}
                        >
                          Featured
                        </Badge>
                      )}
                    </Box>

                    <CardBody pt={3}>
                      <Heading size="md" mb={2} color={textColor}>
                        {club.name}
                      </Heading>
                      <Text fontSize="sm" color={mutedText} noOfLines={2} mb={3}>
                        {club.description}
                      </Text>
                      
                      <Stack spacing={2} mb={4}>
                        <HStack>
                          <FiUsers size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor}>
                            {club.members} Members
                          </Text>
                        </HStack>
                        <HStack>
                          <FiCalendar size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor}>
                            {club.meetingSchedule}
                          </Text>
                        </HStack>
                        <HStack>
                          <FiMapPin size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor} noOfLines={1}>
                            {club.location}
                          </Text>
                        </HStack>
                      </Stack>
                      
                      <Wrap spacing={2} mb={3}>
                        {club.tags.slice(0, 3).map((tag) => (
                          <WrapItem key={tag}>
                            <Tag size="sm" colorScheme="gray" borderRadius="full">
                              <TagLabel>{tag}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                        {club.tags.length > 3 && (
                          <WrapItem>
                            <Tag size="sm" colorScheme="gray" borderRadius="full">
                              <TagLabel>+{club.tags.length - 3} more</TagLabel>
                            </Tag>
                          </WrapItem>
                        )}
                      </Wrap>
                    </CardBody>

                    <CardFooter 
                      pt={0}
                      borderTop="1px solid"
                      borderColor={useColorModeValue("gray.200", "gray.700")}
                    >
                      <Flex justify="space-between" align="center" w="full">
                        <Button
                          as={Link}
                          to={`/clubs/${club.id}`}
                          rightIcon={<FiArrowRight />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          borderRadius="full"
                          _hover={{
                            bg: hoverBg,
                          }}
                        >
                          View Details
                        </Button>
                        <HStack>
                          <Avatar 
                            size="xs" 
                            src={club.leaders[0].avatar} 
                            name={club.leaders[0].name} 
                          />
                          <Text fontSize="xs" color={mutedText}>
                            {club.leaders[0].name}
                          </Text>
                        </HStack>
                      </Flex>
                    </CardFooter>
                  </MotionCard>
                ))}
              </SimpleGrid>
            </TabPanel>
            
            {/* My Clubs Tab */}
            <TabPanel px={0}>
              <Flex direction="column" align="center" justify="center" py={10}>
                <Box textAlign="center" maxW="400px">
                  <FiUsers size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                  <Heading size="md" mb={2}>You haven't joined any clubs yet</Heading>
                  <Text color={mutedText} mb={6}>
                    Explore and join clubs that match your interests to see them here
                  </Text>
                  <Button
                    colorScheme="blue"
                    leftIcon={<FiStar />}
                    onClick={() => {}}
                  >
                    Explore Featured Clubs
                  </Button>
                </Box>
              </Flex>
            </TabPanel>
            
            {/* Featured Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {clubs.filter(club => club.featured).map((club) => (
                  <MotionCard
                    key={club.id}
                    bg={cardBg}
                    boxShadow="md"
                    borderRadius="lg"
                    overflow="hidden"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box position="relative">
                      <Image 
                        src={club.logo} 
                        alt={`${club.name} logo`} 
                        height="130px"
                        width="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x130?text=Club+Image"
                      />
                      <Badge
                        position="absolute"
                        top="10px"
                        right="10px"
                        colorScheme={
                          club.category === "Technology" ? "blue" :
                          club.category === "Academic" ? "purple" :
                          club.category === "Arts" ? "pink" :
                          club.category === "Gaming" ? "green" :
                          club.category === "Activism" ? "orange" :
                          "gray"
                        }
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {club.category}
                      </Badge>
                      <Badge
                        position="absolute"
                        top="10px"
                        left="10px"
                        colorScheme="yellow"
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        Featured
                      </Badge>
                    </Box>

                    <CardBody pt={3}>
                      <Heading size="md" mb={2} color={textColor}>
                        {club.name}
                      </Heading>
                      <Text fontSize="sm" color={mutedText} noOfLines={2} mb={3}>
                        {club.description}
                      </Text>
                      
                      <Stack spacing={2} mb={4}>
                        <HStack>
                          <FiUsers size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor}>
                            {club.members} Members
                          </Text>
                        </HStack>
                        <HStack>
                          <FiCalendar size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor}>
                            {club.meetingSchedule}
                          </Text>
                        </HStack>
                        <HStack>
                          <FiMapPin size={14} color={accentColor} />
                          <Text fontSize="sm" color={textColor} noOfLines={1}>
                            {club.location}
                          </Text>
                        </HStack>
                      </Stack>
                      
                      <Wrap spacing={2} mb={3}>
                        {club.tags.slice(0, 3).map((tag) => (
                          <WrapItem key={tag}>
                            <Tag size="sm" colorScheme="gray" borderRadius="full">
                              <TagLabel>{tag}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                        {club.tags.length > 3 && (
                          <WrapItem>
                            <Tag size="sm" colorScheme="gray" borderRadius="full">
                              <TagLabel>+{club.tags.length - 3} more</TagLabel>
                            </Tag>
                          </WrapItem>
                        )}
                      </Wrap>
                    </CardBody>

                    <CardFooter 
                      pt={0}
                      borderTop="1px solid"
                      borderColor={useColorModeValue("gray.200", "gray.700")}
                    >
                      <Flex justify="space-between" align="center" w="full">
                        <Button
                          as={Link}
                          to={`/clubs/${club.id}`}
                          rightIcon={<FiArrowRight />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          borderRadius="full"
                          _hover={{
                            bg: hoverBg,
                          }}
                        >
                          View Details
                        </Button>
                        <HStack>
                          <Avatar 
                            size="xs" 
                            src={club.leaders[0].avatar} 
                            name={club.leaders[0].name} 
                          />
                          <Text fontSize="xs" color={mutedText}>
                            {club.leaders[0].name}
                          </Text>
                        </HStack>
                      </Flex>
                    </CardFooter>
                  </MotionCard>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ClubsPage;
