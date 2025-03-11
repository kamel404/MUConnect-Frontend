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
    Icon
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
    FiPlus
  } from "react-icons/fi";
  import { Link, useParams } from "react-router-dom";
  import { useNavigate } from "react-router-dom";
  
  const CourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentColor = useColorModeValue("blue.500", "blue.300");
  
    // Simplified community-focused course data
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
      <Flex minH="100vh" p={8} bg={useColorModeValue("gray.50", "gray.800")}>
        <Box maxW="container.lg" mx="auto" w="full">
          <Button
            leftIcon={<FiArrowLeft />}
            as={Link}
            to="/courses"
            mb={8}
            variant="ghost"
            color={accentColor}
          >
            Back to Courses
          </Button>
  
          <Card bg={cardBg} overflow="hidden">
            <CardHeader px={8} pb={0}>
              <Stack spacing={4}>
                <Heading size="xl" color={textColor}>
                  {course.title} Community
                </Heading>
                
                <Flex gap={6} color={mutedText}>
                  <Text>
                    <Icon as={FiUsers} mr={2} />
                    {course.members} Members
                  </Text>
                  <Text>
                    <Icon as={FiBookOpen} mr={2} />
                    {course.activeGroups} Active Groups
                  </Text>
                </Flex>
              </Stack>
            </CardHeader>
  
            <CardBody px={8}>
              <Tabs variant="soft-rounded" colorScheme="blue">
                <TabList>
                  <Tab>Resources ({course.resources})</Tab>
                  <Tab>Study Groups ({course.activeGroups})</Tab>
                  <Tab>Discussions ({course.discussions})</Tab>
                </TabList>
  
                <TabPanels mt={6}>
                  {/* Resources Tab */}
                  <TabPanel p={0}>
                    <Stack spacing={6}>
                      <Button leftIcon={<FiPlus />} colorScheme="blue">
                        Share New Material
                      </Button>
                      
                      <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
                        {course.recentMaterials.map((material, i) => (
                          <Card key={i} variant="outline" onClick={() => navigate(`/courses/${id}/resource/${material.id}`)}>
                            <CardBody>
                              <Flex align="center" mb={3}>
                                <Icon 
                                  as={material.type === 'notes' ? FiFileText : FiVideo} 
                                  boxSize={6} 
                                  color={accentColor} 
                                  mr={3}
                                />
                                <Text fontWeight="600">{material.title}</Text>
                              </Flex>
                              <Flex justify="space-between" align="center">
                                <Flex align="center">
                                  <Avatar size="xs" name={material.author} mr={2} />
                                  <Text fontSize="sm" color={mutedText}>{material.author}</Text>
                                </Flex>
                                <Badge colorScheme="green">
                                  {material.votes} Upvotes
                                </Badge>
                              </Flex>
                            </CardBody>
                          </Card>
                        ))}
                      </Grid>
                    </Stack>
                  </TabPanel>
  
                  {/* Study Groups Tab */}
                  <TabPanel p={0}>
                    <Stack spacing={6}>
                      <Button leftIcon={<FiPlus />} colorScheme="blue">
                        Create New Group
                      </Button>
                      
                      <List spacing={4}>
                        {course.studyGroups.map((group, i) => (
                          <ListItem 
                            key={i} 
                            p={4} 
                            borderWidth="1px" 
                            borderRadius="md"
                            _hover={{ borderColor: accentColor }}
                          >
                            <Flex justify="space-between" align="center">
                              <Box>
                                <Text fontWeight="600">{group.name}</Text>
                                <Text color={mutedText} fontSize="sm">
                                  Last active {group.active}
                                </Text>
                              </Box>
                              <Flex align="center">
                                <Icon as={FiUsers} mr={2} color={mutedText} />
                                <Text color={mutedText}>{group.members}</Text>
                              </Flex>
                            </Flex>
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </TabPanel>
  
                  {/* Discussions Tab */}
                  <TabPanel p={0}>
                    <Stack spacing={6}>
                      <Button leftIcon={<FiPlus />} colorScheme="blue">
                        Start New Discussion
                      </Button>
                      
                      {/* Sample Discussion Threads */}
                      {[1, 2, 3].map((i) => (
                        <Card key={i} variant="outline">
                          <CardBody>
                            <Flex align="center" mb={2}>
                              <Avatar size="sm" name="Omar K" mr={3} />
                              <Text fontWeight="600">Understanding Pipeline Hazards</Text>
                            </Flex>
                            <Text color={mutedText} noOfLines={2}>
                              Can someone explain the different types of pipeline hazards? 
                              I'm having trouble with this concept...
                            </Text>
                            <Flex mt={4} color={mutedText} gap={4}>
                              <Text fontSize="sm">12 replies • 3h ago</Text>
                              <Badge colorScheme="blue">Help Needed</Badge>
                            </Flex>
                          </CardBody>
                        </Card>
                      ))}
                    </Stack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
  
            <CardFooter px={8} borderTopWidth="1px">  
              <Stack w="full">
                <Text fontWeight="600" mb={2}>Community Actions</Text>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  <Button leftIcon={<FiShare2 />} variant="outline">
                    Share Community
                  </Button>
                  <Button leftIcon={<FiMessageSquare />} variant="outline">
                    View All Discussions
                  </Button>
                  <Button leftIcon={<FiUsers />} variant="outline">
                    Browse Members
                  </Button>
                </Grid>
              </Stack>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    );
  };
  
  export default CourseDetailsPage;