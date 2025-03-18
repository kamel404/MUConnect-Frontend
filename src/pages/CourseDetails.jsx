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
  useColorModeValue,
  Badge,
  Grid,
  Avatar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  Divider,
  CardFooter,
  Icon,
  HStack,
  AvatarGroup,
  useBreakpointValue,
  Progress,
  Tag,
  IconButton
} from "@chakra-ui/react";
import { 
  FiArrowLeft, 
  FiBook, 
  FiMessageSquare, 
  FiUsers,
  FiFileText,
  FiVideo,
  FiShare2,
  FiBookOpen,
  FiPlus,
  FiClock,
  FiThumbsUp,
  FiAlertCircle
} from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionListItem = motion(ListItem);

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Course data remains the same
  const course = {
    id: 1,
    code: "CS 301",
    title: "Computer Architecture",
    description: "Join fellow students studying Computer Architecture. Share resources, ask questions, and collaborate on learning.",
    members: 142,
    activeGroups: 8,
    resources: 23,
    discussions: 45,
    recentMaterials: [
      { type: "notes", title: "Midterm Prep Notes", author: "Sarah M", votes: 15 },
      { type: "video", title: "Cache Memory Explained", author: "Ali H", votes: 9 },
      { type: "notes", title: "Practice Problem Set", author: "Noura K", votes: 22 }
    ],
    studyGroups: [
      { name: "Digital Logic Study Group", members: 12, active: "2h ago" },
      { name: "Weekly Problem Solving", members: 8, active: "5h ago" }
    ]
  };

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        <Button
          leftIcon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          mb={8}
          variant="ghost"
          color={accentColor}
          borderRadius="full"
          _hover={{ bg: hoverBg }}
        >
          Back to Courses
        </Button>

        <MotionCard
          bg={cardBg}
          boxShadow="xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardHeader px={{ base: 4, md: 8 }} py={8} bgGradient={`linear(to-r, ${accentColor}, blue.400)`} color="white">
            <Stack spacing={4}>
              <HStack spacing={3}>
                <Badge variant="solid" fontSize="lg" px={3} py={1} borderRadius="full">
                  {course.code}
                </Badge>
                <Heading size="xl">{course.title} Community</Heading>
              </HStack>
              
              <Flex gap={6} flexWrap="wrap">
                <HStack spacing={2}>
                  <Icon as={FiUsers} boxSize={5} />
                  <Text fontWeight="500">{course.members} Members</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiBookOpen} boxSize={5} />
                  <Text fontWeight="500">{course.activeGroups} Active Groups</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiMessageSquare} boxSize={5} />
                  <Text fontWeight="500">{course.discussions} Discussions</Text>
                </HStack>
              </Flex>
            </Stack>
          </CardHeader>

          <CardBody px={{ base: 4, md: 8 }} py={8}>
            <Tabs variant="enclosed-colored" colorScheme="blue">
              <TabList>
                <Tab _selected={{ color: "white", bg: accentColor }} borderRadius="md">
                  Resources ({course.resources})
                </Tab>
                <Tab _selected={{ color: "white", bg: accentColor }} borderRadius="md">
                  Study Groups ({course.activeGroups})
                </Tab>
                <Tab _selected={{ color: "white", bg: accentColor }} borderRadius="md">
                  Discussions ({course.discussions})
                </Tab>
              </TabList>

              <TabPanels mt={6}>
                {/* Resources Tab */}
                <TabPanel p={0}>
                  <Stack spacing={6}>
                    <Button 
                      leftIcon={<FiPlus />} 
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      _hover={{ transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      Share New Material
                    </Button>
                    
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                      {course.recentMaterials.map((material, i) => (
                        <MotionCard
                          key={i}
                          variant="outline"
                          whileHover={{ y: -5 }}
                          transition={{ duration: 0.2 }}
                          cursor="pointer"
                          onClick={() => navigate(`/courses/${id}/resource/${material.id}`)}
                        >
                          <CardBody>
                            <Flex align="center" mb={3}>
                              <Icon 
                                as={material.type === 'notes' ? FiFileText : FiVideo} 
                                boxSize={6} 
                                color={accentColor} 
                                mr={3}
                              />
                              <Text fontWeight="700" fontSize="lg">{material.title}</Text>
                            </Flex>
                            <Flex justify="space-between" align="center">
                              <Flex align="center">
                                <Avatar size="sm" name={material.author} mr={2} />
                                <Text fontSize="sm" color={mutedText}>{material.author}</Text>
                              </Flex>
                              <Badge 
                                colorScheme="green" 
                                px={3} 
                                py={1} 
                                borderRadius="full"
                                display="flex" 
                                alignItems="center"
                              >
                                <Icon as={FiThumbsUp} mr={1} /> {material.votes}
                              </Badge>
                            </Flex>
                          </CardBody>
                        </MotionCard>
                      ))}
                    </Grid>
                  </Stack>
                </TabPanel>

                {/* Study Groups Tab */}
                <TabPanel p={0}>
                  <Stack spacing={6}>
                    <Button 
                      leftIcon={<FiPlus />} 
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      _hover={{ transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      Create New Group
                    </Button>
                    
                    <List spacing={4}>
                      {course.studyGroups.map((group, i) => (
                        <MotionListItem
                          key={i}
                          p={4}
                          borderWidth="1px"
                          borderRadius="lg"
                          _hover={{ borderColor: accentColor }}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Flex justify="space-between" align="center">
                            <Box flex={1}>
                              <Text fontWeight="700" mb={1}>{group.name}</Text>
                              <HStack spacing={2}>
                                <Icon as={FiClock} color={mutedText} boxSize={4} />
                                <Text fontSize="sm" color={mutedText}>
                                  Active {group.active}
                                </Text>
                              </HStack>
                            </Box>
                            <HStack spacing={2}>
                              <AvatarGroup size="sm" max={4}>
                                {[...Array(group.members)].map((_, i) => (
                                  <Avatar key={i} name={`Member ${i+1}`} src={`https://i.pravatar.cc/150?img=${i}`} />
                                ))}
                              </AvatarGroup>
                              <Text color={mutedText}>{group.members}</Text>
                            </HStack>
                          </Flex>
                        </MotionListItem>
                      ))}
                    </List>
                  </Stack>
                </TabPanel>

                {/* Discussions Tab */}
                <TabPanel p={0}>
                  <Stack spacing={6}>
                    <Button 
                      leftIcon={<FiPlus />} 
                      colorScheme="blue"
                      size="lg"
                      borderRadius="full"
                      _hover={{ transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      Start New Discussion
                    </Button>
                    
                    {[1, 2, 3].map((i) => (
                      <MotionCard
                        key={i}
                        variant="outline"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardBody>
                          <Flex align="center" mb={2}>
                            <Avatar size="sm" name="Omar K" mr={3} />
                            <Box flex={1}>
                              <Text fontWeight="700">Understanding Pipeline Hazards</Text>
                              <HStack mt={1} spacing={2}>
                                <Tag colorScheme="blue" size="sm">Help Needed</Tag>
                                <Tag colorScheme="purple" size="sm">CS 301</Tag>
                              </HStack>
                            </Box>
                          </Flex>
                          <Text color={mutedText} noOfLines={2} mb={4}>
                            Can someone explain the different types of pipeline hazards? 
                            I'm having trouble with this concept...
                          </Text>
                          <Flex justify="space-between" align="center">
                            <HStack spacing={4}>
                              <Button variant="ghost" size="sm" leftIcon={<FiThumbsUp />}>
                                24 Helpful
                              </Button>
                              <Button variant="ghost" size="sm" leftIcon={<FiAlertCircle />}>
                                5 Answers
                              </Button>
                            </HStack>
                            <Text fontSize="sm" color={mutedText}>3h ago</Text>
                          </Flex>
                        </CardBody>
                      </MotionCard>
                    ))}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>

          <CardFooter px={{ base: 4, md: 8 }} py={6} borderTopWidth="1px">  
            <Stack w="full" spacing={4}>
              <Text fontWeight="700" fontSize="xl">Community Actions</Text>
              <Grid 
                templateColumns={{ 
                  base: "1fr", 
                  md: "repeat(3, 1fr)", 
                  lg: "repeat(4, 1fr)" 
                }} 
                gap={4}
              >
                <FeatureCard 
                  icon={FiShare2} 
                  title="Share Community"
                  description="Invite classmates to join"
                />
                <FeatureCard 
                  icon={FiMessageSquare} 
                  title="Discussions"
                  description="Browse all conversations"
                />
                <FeatureCard 
                  icon={FiUsers} 
                  title="Members"
                  description="Connect with peers"
                />
                <FeatureCard 
                  icon={FiBook} 
                  title="Resources"
                  description="View all materials"
                />
              </Grid>
            </Stack>
          </CardFooter>
        </MotionCard>
      </Box>
    </Flex>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <MotionCard
      p={4}
      variant="outline"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      cursor="pointer"
    >
      <Stack spacing={3}>
        <Icon as={icon} boxSize={6} color="blue.500" />
        <Text fontWeight="700">{title}</Text>
        <Text fontSize="sm" color="gray.500">{description}</Text>
      </Stack>
    </MotionCard>
  );
};

export default CourseDetailsPage;