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
const RequestCard = ({ request, currentUserId, onAccept, onDecline, onCancel }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const isMyRequest = request.requesterId === currentUserId;
  const statusColor = {
    pending: "orange",
    accepted: "green",
    declined: "red",
    cancelled: "gray",
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
                <Text fontSize="sm" color={textColor}>{request.currentTime}</Text>
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
                <Text fontSize="sm" color={textColor}>{request.desiredTime}</Text>
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
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => onCancel(request.id)}
                >
                  Cancel
                </Button>
              ) : (
                <>
                  <IconButton
                    icon={<FiCheck />}
                    size="sm"
                    colorScheme="green"
                    variant="solid"
                    aria-label="Accept request"
                    onClick={() => onAccept(request.id)}
                  />
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    aria-label="Decline request"
                    onClick={() => onDecline(request.id)}
                  />
                </>
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
      currentTime: "10:00 AM - 11:30 AM",
      desiredDay: "Wednesday",
      desiredTime: "2:00 PM - 3:30 PM",
      reason: "I have a schedule conflict with another course on Mondays.",
      status: "pending",
      requesterId: "user1",
      requesterName: "Ahmed Ali",
      requesterAvatar: "https://bit.ly/dan-abramov",
      createdAt: "2025-03-20T10:30:00",
    },
    {
      id: "2",
      courseName: "MATH 202",
      currentSection: "C",
      desiredSection: "D",
      currentDay: "Tuesday",
      currentTime: "1:00 PM - 2:30 PM",
      desiredDay: "Thursday",
      desiredTime: "1:00 PM - 2:30 PM",
      reason: "The current time slot conflicts with my part-time job.",
      status: "pending",
      requesterId: "user2",
      requesterName: "Nada Ahmed",
      requesterAvatar: "https://bit.ly/kent-c-dodds",
      createdAt: "2025-03-21T14:45:00",
    },
    {
      id: "3",
      courseName: "PHYS 201",
      currentSection: "B",
      desiredSection: "A",
      currentDay: "Thursday",
      currentTime: "8:00 AM - 9:30 AM",
      desiredDay: "Tuesday",
      desiredTime: "11:00 AM - 12:30 PM",
      reason: "The early morning time is difficult for me as I commute from far.",
      status: "accepted",
      requesterId: "user3",
      requesterName: "Omar Khaled",
      requesterAvatar: "https://bit.ly/ryan-florence",
      createdAt: "2025-03-18T09:15:00",
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

  // Handle request actions
  const handleAcceptRequest = (requestId) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: "accepted" } : req
    ));

    toast({
      title: "Request accepted",
      description: "You have accepted the class exchange request.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDeclineRequest = (requestId) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: "declined" } : req
    ));

    toast({
      title: "Request declined",
      description: "You have declined the class exchange request.",
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
                My Requests ({myRequests.length})
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                Available ({availableRequests.length})
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                History
              </Tab>
            </TabList>

            <TabPanels p={6}>
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
                  </Box>
                )}
              </TabPanel>

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
                        onAccept={handleAcceptRequest}
                        onDecline={handleDeclineRequest}
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
                      placeholder="e.g., 10:00 AM - 11:30 AM"
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
                      placeholder="e.g., 2:00 PM - 3:30 PM"
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
    </Box>
  );
};

export default Requests;