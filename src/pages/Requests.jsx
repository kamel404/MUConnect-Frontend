import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Badge,
  Avatar,
  Tag,
  HStack,
  VStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiCalendar, FiClock, FiPlus, FiCheck, FiX, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Request card component
const RequestCard = ({ request, currentUserId, onApply, onCancel, onViewApplications }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const isMyRequest = request.requesterId === currentUserId;
  
  // Check if current user has already applied to this request
  const hasApplied = request.applications?.some(app => app.userId === currentUserId);
  const statusColor = {
    pending: "orange",
    accepted: "green",
    declined: "red",
    cancelled: "gray",
  };

  const formatTime = (time) => {
    if (!time) return "";
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return time;
    }
  };

  return (
    <Card
      bg={cardBg}
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      {request.status !== "pending" && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={statusColor[request.status]}
          variant="solid"
          borderRadius="md"
          px={2}
          textTransform="capitalize"
          fontSize="xs"
        >
          {request.status}
        </Badge>
      )}

      <CardHeader pb={3}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="sm" color={textColor}>
              {request.courseName}
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              Created: {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
          <HStack spacing={2}>
            <Tag size="sm" colorScheme="blue" variant="subtle" minW="max-content">
              {request.currentSection}
            </Tag>
            <Text fontSize="sm" color="gray.500">→</Text>
            <Tag size="sm" colorScheme="green" variant="subtle" minW="max-content">
              {request.desiredSection}
            </Tag>
          </HStack>
        </Flex>
      </CardHeader>

      <CardBody py={0}>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4} py={3}>
          <VStack align="start" spacing={2}>
            <Flex align="center">
              <Box as={FiCalendar} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Current Day</Text>
                <Text fontSize="sm" color={textColor}>{request.currentDay}</Text>
              </VStack>
            </Flex>
            <Flex align="center">
              <Box as={FiClock} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Time</Text>
                <Text fontSize="sm" color={textColor}>{formatTime(request.currentTime)}</Text>
              </VStack>
            </Flex>
          </VStack>

          <VStack align="start" spacing={2}>
            <Flex align="center">
              <Box as={FiCalendar} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Desired Day</Text>
                <Text fontSize="sm" color={textColor}>{request.desiredDay}</Text>
              </VStack>
            </Flex>
            <Flex align="center">
              <Box as={FiClock} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Time</Text>
                <Text fontSize="sm" color={textColor}>{formatTime(request.desiredTime)}</Text>
              </VStack>
            </Flex>
          </VStack>
        </Grid>

        {request.reason && (
          <Box mt={2} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
            <Text fontSize="sm" color={mutedText}>
              {request.reason}
            </Text>
          </Box>
        )}
      </CardBody>

      <CardFooter pt={3}>
        <Flex w="100%" justify="space-between" align="center">
          <HStack spacing={2}>
            <Avatar
              size="xs"
              src={request.requesterAvatar}
              name={request.requesterName}
            />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {isMyRequest ? "Your Request" : request.requesterName}
            </Text>
          </HStack>

          {request.status === "pending" && (
            <HStack spacing={2}>
              {isMyRequest ? (
                <>
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => onViewApplications(request.id)}
                  >
                    {request.applications && request.applications.length > 0 
                      ? `View Applications (${request.applications.length})` 
                      : "No Applications"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => onCancel(request.id)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                hasApplied ? (
                  <Button
                    size="sm"
                    colorScheme="gray"
                    variant="solid"
                    isDisabled
                  >
                    Applied
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    colorScheme="green"
                    variant="solid"
                    leftIcon={<FiCheck />}
                    onClick={() => onApply(request.id)}
                  >
                    Apply
                  </Button>
                )
              )}
            </HStack>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
};

const Requests = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  // Mock current user
  const currentUserId = "user1";

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    currentSection: "",
    desiredSection: "",
    currentDay: "",
    currentTime: "",
    desiredDay: "",
    desiredTime: "",
    reason: "",
  });

  // Mock request data
  const [requests, setRequests] = useState([
    {
      id: "1",
      courseName: "CS 101",
      currentSection: "A",
      desiredSection: "B",
      currentDay: "Monday",
      currentTime: "10:00",
      desiredDay: "Wednesday",
      desiredTime: "14:00",
      reason: "I have a schedule conflict with another course on Mondays.",
      status: "pending",
      requesterId: "user1",
      requesterName: "Ahmed Ali",
      requesterAvatar: "https://bit.ly/dan-abramov",
      createdAt: "2025-03-20T10:30:00",
      applications: [
        {
          id: "app1",
          userId: "user3",
          userName: "Omar Khaled",
          userAvatar: "https://bit.ly/ryan-florence",
          reason: "I prefer morning classes and this would work better with my schedule.",
          createdAt: "2025-03-21T11:45:00",
          status: "pending"
        }
      ],
    },
    {
      id: "2",
      courseName: "MATH 202",
      currentSection: "C",
      desiredSection: "D",
      currentDay: "Tuesday",
      currentTime: "13:00",
      desiredDay: "Thursday",
      desiredTime: "13:00",
      reason: "The current time slot conflicts with my part-time job.",
      status: "pending",
      requesterId: "user2",
      requesterName: "Nada Ahmed",
      requesterAvatar: "https://bit.ly/kent-c-dodds",
      createdAt: "2025-03-21T14:45:00",
      applications: [],
    },
    {
      id: "3",
      courseName: "PHYS 201",
      currentSection: "B",
      desiredSection: "A",
      currentDay: "Thursday",
      currentTime: "08:00",
      desiredDay: "Tuesday",
      desiredTime: "11:00",
      reason: "The early morning time is difficult for me as I commute from far.",
      status: "accepted",
      requesterId: "user3",
      requesterName: "Omar Khaled",
      requesterAvatar: "https://bit.ly/ryan-florence",
      createdAt: "2025-03-18T09:15:00",
      applications: [
        {
          id: "app2",
          userId: "user1",
          userName: "Ahmed Ali",
          userAvatar: "https://bit.ly/dan-abramov",
          reason: "This time works better for me as I have another class right after.",
          createdAt: "2025-03-19T10:15:00",
          status: "accepted"
        }
      ],
    },
  ]);

  // Filter requests
  const myRequests = requests.filter(req => req.requesterId === currentUserId);
  const availableRequests = requests.filter(req => req.requesterId !== currentUserId && req.status === "pending");
  const historyRequests = requests.filter(req => (req.requesterId !== currentUserId && req.status !== "pending"));

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      id: `${requests.length + 1}`,
      ...formData,
      status: "pending",
      requesterId: currentUserId,
      requesterName: "Ahmed Ali",
      requesterAvatar: "https://bit.ly/dan-abramov",
      createdAt: new Date().toISOString(),
    };

    setRequests(prev => [newRequest, ...prev]);

    toast({
      title: "Request created",
      description: "Your class exchange request has been submitted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setFormData({
      courseName: "",
      currentSection: "",
      desiredSection: "",
      currentDay: "",
      currentTime: "",
      desiredDay: "",
      desiredTime: "",
      reason: "",
    });

    onClose();
  };

  // Application state and modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isViewApplicationsModalOpen, setIsViewApplicationsModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [applicationReason, setApplicationReason] = useState("");
  const [currentRequestApplications, setCurrentRequestApplications] = useState([]);

  // Handle request actions
  const handleApplyToRequest = (requestId) => {
    // Find the request
    const request = requests.find(req => req.id === requestId);
    
    // Check if user has already applied
    if (request && request.applications?.some(app => app.userId === currentUserId)) {
      toast({
        title: "Already applied",
        description: "You have already applied to this request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setCurrentRequestId(requestId);
    setApplicationReason("");
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    const newApplication = {
      id: `app${Math.floor(Math.random() * 1000)}`,
      userId: currentUserId,
      userName: "Ahmed Ali",
      userAvatar: "https://bit.ly/dan-abramov",
      reason: applicationReason,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    setRequests(prev => prev.map(req => {
      if (req.id === currentRequestId) {
        return {
          ...req,
          applications: [...(req.applications || []), newApplication]
        };
      }
      return req;
    }));

    setIsApplyModalOpen(false);
    setApplicationReason("");
    setCurrentRequestId(null);

    toast({
      title: "Application submitted",
      description: "Your application has been submitted to the request owner.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewApplications = (requestId) => {
    const request = requests.find(req => req.id === requestId);
    if (request) {
      setCurrentRequestId(requestId);
      setCurrentRequestApplications(request.applications || []);
      setIsViewApplicationsModalOpen(true);
    }
  };

  const handleAcceptApplication = (applicationId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === currentRequestId) {
        // Update the request status to accepted
        const updatedReq = { ...req, status: "accepted" };
        
        // Update the specific application status to accepted
        updatedReq.applications = (req.applications || []).map(app => {
          if (app.id === applicationId) {
            return { ...app, status: "accepted" };
          }
          // Mark other applications as declined
          return { ...app, status: app.status === "pending" ? "declined" : app.status };
        });
        
        return updatedReq;
      }
      return req;
    }));

    setIsViewApplicationsModalOpen(false);
    setCurrentRequestId(null);
    setCurrentRequestApplications([]);

    toast({
      title: "Application accepted",
      description: "You have accepted the application for your class exchange request.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeclineApplication = (applicationId) => {
    setRequests(prev => prev.map(req => {
      if (req.id === currentRequestId) {
        // Update the specific application status to declined
        const updatedApplications = (req.applications || []).map(app => {
          if (app.id === applicationId) {
            return { ...app, status: "declined" };
          }
          return app;
        });
        
        return { ...req, applications: updatedApplications };
      }
      return req;
    }));

    toast({
      title: "Application declined",
      description: "You have declined the application for your class exchange request.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancelRequest = (requestId) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: "cancelled" } : req
    ));

    toast({
      title: "Request cancelled",
      description: "Your class exchange request has been cancelled.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6 }}>
      <Container maxW="7xl">
        {/* Header Section */}
        <Flex mb={8} align="center">
          <IconButton
            icon={<FiChevronLeft />}
            onClick={handleGoBack}
            aria-label="Go back"
            variant="ghost"
            color={textColor}
            size="lg"
            mr={3}
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          />
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={textColor}>Class Exchange Requests</Heading>
            <Text fontSize="sm" color={mutedText}>
              Manage your class time exchange requests
            </Text>
          </VStack>
        </Flex>

        {/* Main Content */}
        <Box bg={cardBg} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
          <Flex p={6} borderBottomWidth="1px" borderColor={borderColor}>
            <Button
              leftIcon={<FiPlus />}
              onClick={onOpen}
              colorScheme="yellow"
              size="sm"
              ml="auto"
            >
              New Request
            </Button>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="yellow">
            <TabList px={6} pt={4}>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                Available ({availableRequests.length})
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                My Requests ({myRequests.length})
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                History
              </Tab>
            </TabList>

            <TabPanels p={6}>
              {/* Available Requests Panel */}
              <TabPanel p={0}>
                {availableRequests.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)"
                    }}
                    gap={6}
                  >
                    {availableRequests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        currentUserId={currentUserId}
                        onApply={handleApplyToRequest}
                        onViewApplications={handleViewApplications}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No available requests at this time</Text>
                  </Box>
                )}
              </TabPanel>
              
              {/* My Requests Panel */}
              <TabPanel p={0}>
                {myRequests.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)"
                    }}
                    gap={6}
                  >
                    {myRequests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        currentUserId={currentUserId}
                        onCancel={handleCancelRequest}
                        onViewApplications={handleViewApplications}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No personal requests found</Text>
                  </Box>
                )}
              </TabPanel>

              {/* History Panel */}
              <TabPanel p={0}>
                {historyRequests.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)"
                    }}
                    gap={6}
                  >
                    {historyRequests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        currentUserId={currentUserId}
                      />
                    ))}
                  </Grid>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No historical requests found</Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>

      {/* Create Request Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>Create Exchange Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Course</FormLabel>
                  <Select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="Select course"
                    color={textColor}
                  >
                    <option value="CS 101">CS 101 - Introduction to Computer Science</option>
                    <option value="MATH 202">MATH 202 - Calculus II</option>
                    <option value="PHYS 201">PHYS 201 - Physics I</option>
                    <option value="ENG 301">ENG 301 - Technical Writing</option>
                  </Select>
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Current Section</FormLabel>
                    <Input
                      name="currentSection"
                      value={formData.currentSection}
                      onChange={handleInputChange}
                      placeholder="e.g., A, B, C"
                      color={textColor}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Desired Section</FormLabel>
                    <Input
                      name="desiredSection"
                      value={formData.desiredSection}
                      onChange={handleInputChange}
                      placeholder="e.g., B, C, D"
                      color={textColor}
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Current Day</FormLabel>
                    <Select
                      name="currentDay"
                      value={formData.currentDay}
                      onChange={handleInputChange}
                      placeholder="Select day"
                      color={textColor}
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Current Time</FormLabel>
                    <Input
                      name="currentTime"
                      value={formData.currentTime}
                      onChange={handleInputChange}
                      type="time"
                      color={textColor}
                    />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel color={textColor}>Desired Day</FormLabel>
                    <Select
                      name="desiredDay"
                      value={formData.desiredDay}
                      onChange={handleInputChange}
                      placeholder="Select day"
                      color={textColor}
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color={textColor}>Desired Time</FormLabel>
                    <Input
                      name="desiredTime"
                      value={formData.desiredTime}
                      onChange={handleInputChange}
                      type="time"
                      color={textColor}
                    />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel color={textColor}>Reason (Optional)</FormLabel>
                  <Textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Explain why you need to exchange class times..."
                    color={textColor}
                    resize="vertical"
                    rows={2}
                  />
                </FormControl>
              </Stack>

              <Flex justify="flex-end" mt={6} gap={3}>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  colorScheme="yellow"
                >
                  Create Request
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Apply to Request Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>Apply for Class Exchange</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={mutedText}>
                Submit your application to exchange class times with the requester. The requester will review all applications and select one to accept.
              </Text>

              <FormControl isRequired>
                <FormLabel color={textColor}>Why do you want to exchange?</FormLabel>
                <Textarea
                  value={applicationReason}
                  onChange={(e) => setApplicationReason(e.target.value)}
                  placeholder="Explain why this exchange works for you..."
                  color={textColor}
                  resize="vertical"
                  rows={3}
                />
              </FormControl>
            </VStack>

            <Flex justify="flex-end" mt={6} gap={3}>
              <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
              <Button
                type="button"
                colorScheme="green"
                isDisabled={!applicationReason.trim()}
                onClick={handleSubmitApplication}
              >
                Submit Application
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Applications Modal */}
      <Modal 
        isOpen={isViewApplicationsModalOpen} 
        onClose={() => setIsViewApplicationsModalOpen(false)} 
        size="xl"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>Applications for Your Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentRequestApplications.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {currentRequestApplications.map(app => (
                  <Card 
                    key={app.id} 
                    p={4} 
                    borderRadius="md" 
                    borderWidth="1px"
                    borderColor={borderColor}
                    position="relative"
                  >
                    {app.status !== "pending" && (
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme={app.status === "accepted" ? "green" : "red"}
                        variant="solid"
                        borderRadius="md"
                        px={2}
                        textTransform="capitalize"
                        fontSize="xs"
                      >
                        {app.status}
                      </Badge>
                    )}
                    <Flex mb={3}>
                      <Avatar size="sm" src={app.userAvatar} name={app.userName} mr={3} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textColor}>{app.userName}</Text>
                        <Text fontSize="xs" color={mutedText}>
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </Flex>
                    <Box
                      p={3}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="md"
                      mb={3}
                    >
                      <Text fontSize="sm" color={mutedText}>
                        {app.reason}
                      </Text>
                    </Box>
                    {app.status === "pending" && (
                      <Flex justifyContent="flex-end" gap={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleAcceptApplication(app.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeclineApplication(app.id)}
                        >
                          Decline
                        </Button>
                      </Flex>
                    )}
                  </Card>
                ))}
              </VStack>
            ) : (
              <Box
                p={8}
                textAlign="center"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor={borderColor}
                borderRadius="lg"
              >
                <Text color={mutedText}>No applications received yet</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsViewApplicationsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Requests;