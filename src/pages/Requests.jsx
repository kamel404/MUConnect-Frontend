import {
  fetchAllRequests,
  fetchMyRequests,
  fetchMyApplications,
  createSectionRequest,
  applyToRequest,
  fetchApplicationsForRequest,
  updateSectionRequest,
  approveApplication,
  deleteSectionRequest,
  deleteApplication,
  fetchRequestById,
  updateApplicationStatus
} from '../services/requestService.js';
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
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FiCalendar, FiClock, FiPlus, FiCheck, FiX, FiChevronLeft, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Default avatar for users
const DEFAULT_AVATAR = "https://bit.ly/dan-abramov";

// Helper function to map API application data to UI format
const mapApiApplicationData = (app) => {
  if (!app) return {};
  return {
    id: app.id,
    userId: app.user_id,
    userName: app.user && app.user.first_name && app.user.last_name
      ? `${app.user.first_name} ${app.user.last_name}`
      : (app.user && app.user.username) || app.userName || "You",
    userAvatar: (app.user && app.user.avatar) || app.userAvatar || DEFAULT_AVATAR,
    reason: app.reason,
    createdAt: app.created_at || app.createdAt,
    status: app.status,
    request: app.request // for myApplications, attach the related request object
  };
};

// Helper function to map API data to UI format
const mapApiRequest = (apiRequest, currentUser) => {
  if (!apiRequest) return {};
  const requester = apiRequest.requester || currentUser || {};
  return {
    id: apiRequest.id,
    courseName: apiRequest.course_name,
    currentSection: apiRequest.current_section,
    desiredSection: apiRequest.desired_section,
    currentDay: apiRequest.current_day,
    currentTime: apiRequest.current_time,
    desiredDay: apiRequest.desired_day,
    desiredTime: apiRequest.desired_time,
    reason: apiRequest.reason,
    status: apiRequest.status,
    requesterId: requester.id,
    requesterName: requester.first_name && requester.last_name
      ? `${requester.first_name} ${requester.last_name}`
      : requester.name || "You",
    requesterAvatar: requester.avatar || DEFAULT_AVATAR,
    createdAt: apiRequest.created_at,
    applications: Array.isArray(apiRequest.applications)
      ? apiRequest.applications.map(app => ({
          id: app && app.id,
          requestId: app && app.request_id,
          userId: app && app.user_id,
          status: app && app.status,
          reason: app && app.reason,
          createdAt: app && app.created_at,
          user: app && app.user
            ? {
                id: app.user.id,
                name: app.user.first_name && app.user.last_name
                  ? `${app.user.first_name} ${app.user.last_name}`
                  : app.user.username || "Unknown",
                avatar: app.user.avatar || DEFAULT_AVATAR,
                ...app.user,
              }
            : {},
        }))
      : [],
  };
};

// Request card component
const RequestCard = ({ request, userId, onApply, onCancel, onDelete, onViewApplications, onUpdateApplication, onUpdateApplicationStatus }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const isMyRequest = request.requesterId === userId;
  
  // Check if current user has already applied to this request
  const hasApplied = request.applications?.some(app => app.userId === userId);
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
            <Text fontSize="sm" color={mutedText} noOfLines={2}>
              {request.reason}
            </Text>

            {/* Applicants List for My Requests */}
            {onUpdateApplicationStatus && request.applications && request.applications.length > 0 && (
              <Box pt={4} mt={4} borderTopWidth="1px" borderColor={borderColor}>
                <Heading size="sm" mb={3} color={textColor}>Applicants</Heading>
                <VStack spacing={4} align="stretch">
                  {request.applications.map(app => (
                    <Flex key={app.id} justify="space-between" align="center">
                      <Flex align="center">
                        <Avatar size="sm" name={app.user.username} src={app.user.avatar} />
                        <Box ml={3}>
                          <Text fontWeight="bold" color={textColor}>{app.user.username}</Text>
                          <Text fontSize="sm" color={mutedText}>{app.reason}</Text>
                        </Box>
                      </Flex>
                      <Box textAlign="right">
                        {app.status === 'pending' ? (
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="green" onClick={() => onUpdateApplicationStatus(app.id, 'approved')}>Approve</Button>
                            <Button size="xs" colorScheme="red" onClick={() => onUpdateApplicationStatus(app.id, 'declined')}>Decline</Button>
                          </HStack>
                        ) : (
                          <Badge colorScheme={app.status === 'approved' ? 'green' : 'red'}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        )}
      </CardBody>

      <CardFooter pt={3}>
        <Flex w="100%" justify="space-between" align="center">
          <HStack spacing={2}>
            {/* Fix: define requesterAvatar and requesterName from request object */}
            <Avatar
              size="xs"
              src={request.requesterAvatar}
              name={request.requesterName}
            />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {isMyRequest ? "You" : request.requesterName}
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
                      ? `View Applicants (${request.applications.length})` 
                      : "No Applicants"}
                  </Button>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="More actions"
                      icon={<FiChevronLeft style={{ transform: 'rotate(-90deg)' }} />} // vertical dots
                      size="sm"
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem icon={<FiX/>} onClick={() => onCancel(request.id)}>
                        Cancel
                      </MenuItem>
                      <MenuItem icon={<FiTrash/>} color="red.500" onClick={() => onDelete(request.id)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
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
                  (typeof onApply === "function" && !isMyRequest) && (
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
                )
              )}
            </HStack>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
};

// Application card for My Applications tab
const ApplicationCard = ({ application, onWithdraw }) => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const cancelRef = useRef();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  
  const statusColor = {
    pending: "orange",
    accepted: "green",
    declined: "red",
    cancelled: "gray",
  };
  
  const request = application.request;

  // Use mapped request fields from mapApiRequest
  const courseName = request?.courseName || `Request #${application.request_id}`;
  const currentSection = request?.currentSection || '-';
  const desiredSection = request?.desiredSection || '-';
  const currentDay = request?.currentDay || '-';
  const desiredDay = request?.desiredDay || '-';
  const currentTime = request?.currentTime || '-';
  const desiredTime = request?.desiredTime || '-';
  const requesterAvatar = request?.requesterAvatar || DEFAULT_AVATAR;
  const requesterName = request?.requesterName || '-';
  

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
      <Badge
        position="absolute"
        top={2}
        right={2}
        colorScheme={statusColor[application.status]}
        variant="solid"
        borderRadius="md"
        px={2}
        textTransform="capitalize"
        fontSize="xs"
      >
        {application.status}
      </Badge>

      <CardHeader pb={3}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="sm" color={textColor}>
              {courseName}
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              Applied: {new Date(application.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Flex>
      </CardHeader>

      <CardBody py={0}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} py={3}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>Current Section</Text>
            <Tag size="md" colorScheme="blue" variant="subtle" minW="max-content">
              {currentSection || "-"}
            </Tag>
            <Text fontSize="sm" color={mutedText} mt={2}>Current Day</Text>
            <Text fontSize="sm" color={textColor}>{currentDay}</Text>
            <Text fontSize="sm" color={mutedText} mt={2}>Current Time</Text>
            <Text fontSize="sm" color={textColor}>{currentTime}</Text>
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>Desired Section</Text>
            <Tag size="md" colorScheme="green" variant="subtle" minW="max-content">
              {desiredSection || "-"}
            </Tag>
            <Text fontSize="sm" color={mutedText} mt={2}>Desired Day</Text>
            <Text fontSize="sm" color={textColor}>{desiredDay}</Text>
            <Text fontSize="sm" color={mutedText} mt={2}>Desired Time</Text>
            <Text fontSize="sm" color={textColor}>{desiredTime}</Text>
          </VStack>
        </Grid>
        
        <Box mt={2} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>Your Reason:</Text>
          <Text fontSize="sm" color={mutedText}>
            {application.reason}
          </Text>
        </Box>
      </CardBody>

      <CardFooter pt={3}>
        <Flex w="100%" justify="space-between" align="center">
          <HStack spacing={2}>
            <Avatar
              size="xs"
              src={requesterAvatar}
              name={requesterName}
            />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {requesterName}
            </Text>
          </HStack>
          {onWithdraw && application.status === "pending" && (
            <>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => setIsWithdrawDialogOpen(true)}
                aria-label="Withdraw Application"
              >
                Withdraw
              </Button>
              <AlertDialog
                isOpen={isWithdrawDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsWithdrawDialogOpen(false)}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Withdraw Application
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to withdraw this application? This action cannot be undone.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={() => setIsWithdrawDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" ml={3} onClick={() => { setIsWithdrawDialogOpen(false); onWithdraw(application.id); }}>
                        Confirm
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
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

  // Replace with actual user ID from context
  const { user } = useAuth();

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

  // API state
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Application state and modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isViewApplicationsModalOpen, setIsViewApplicationsModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [applicationReason, setApplicationReason] = useState("");
  const [currentRequestApplications, setCurrentRequestApplications] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [availableRes, myRequestsRes, myApplicationsRes] = await Promise.all([
          fetchAllRequests(),
          fetchMyRequests(),
          fetchMyApplications()
        ]);
        
        // Map API data to UI format
        setAvailableRequests(Array.isArray(availableRes) ? availableRes.map(mapApiRequest) : []);

        // DEBUG: Log raw 'my-requests' data
        console.log('Raw my-requests data:', myRequestsRes);

        let mappedMyRequests = [];
        if (Array.isArray(myRequestsRes)) {
          mappedMyRequests = myRequestsRes.map(req => mapApiRequest(req, user));
        } else {
          console.error('myRequestsRes is not an array:', myRequestsRes);
        }

        // DEBUG: Log mapped 'my-requests' data
        console.log('Mapped my-requests data:', mappedMyRequests);

        setMyRequests(mappedMyRequests);
        
        // Map applications with their requests (fetch missing request details if needed)
        const requestIds = Array.isArray(myApplicationsRes) ? myApplicationsRes.map(app => app && app.request_id).filter(Boolean) : [];
        // Fetch all missing requests in parallel
        const requestDetails = await Promise.all(requestIds.map(id => fetchRequestById(id).catch(() => null)));
        const requestDetailsMap = {};
        requestDetails.forEach((req, idx) => {
          if (req && req.id) requestDetailsMap[req.id] = req;
        });
        const mappedApps = Array.isArray(myApplicationsRes) ? myApplicationsRes.map(app => {
          const mappedApp = mapApiApplicationData(app);
          // Prefer app.request if present, else use fetched details
          const reqData = app && app.request ? mapApiRequest(app.request) : (app && requestDetailsMap[app.request_id] ? mapApiRequest(requestDetailsMap[app.request_id]) : undefined);
          return {
            ...mappedApp,
            request: reqData
          };
        }) : [];
        setMyApplications(mappedApps);
      } catch (error) {
        // Improved error logging
        console.error('Error in fetchData:', error);
        toast({
          title: "Failed to load data",
          description: error.message || "Please try again later",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newRequest = await createSectionRequest({
        course_name: formData.courseName,
        current_section: formData.currentSection,
        desired_section: formData.desiredSection,
        current_day: formData.currentDay,
        current_time: formData.currentTime,
        desired_day: formData.desiredDay,
        desired_time: formData.desiredTime,
        reason: formData.reason
      });
      
      setMyRequests(prev => [mapApiRequest(newRequest, user), ...prev]);
      
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
    } catch (error) {
      toast({
        title: "Failed to create request",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Withdraw Application
  const handleWithdrawApplication = async (applicationId) => {
    try {
      await deleteApplication(applicationId);
      setMyApplications(prev => prev.filter(app => app.id !== applicationId));
      toast({
        title: "Application withdrawn",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to withdraw application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete Request
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request? This cannot be undone.")) return;
    try {
      await deleteSectionRequest(requestId);
      setMyRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: "Request deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete request",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle request actions
  const handleApplyToRequest = (requestId) => {
    setCurrentRequestId(requestId);
    setApplicationReason("");
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    try {
      await applyToRequest(currentRequestId, { reason: applicationReason });
      
      // Update UI optimistically
      setAvailableRequests(prev => 
        prev.map(req => 
          req.id === currentRequestId 
            ? { 
                ...req, 
                applications: [
                  ...(req.applications || []), 
                  {
                    id: Date.now().toString(), // Temporary ID
                    userId: user.id,
                    userName: "You",
                    userAvatar: DEFAULT_AVATAR,
                    reason: applicationReason,
                    createdAt: new Date().toISOString(),
                    status: "pending"
                  }
                ]
              } 
            : req
        )
      );
      
      toast({
        title: "Application submitted",
        description: "Your application has been submitted to the request owner.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      setIsApplyModalOpen(false);
      setApplicationReason("");
      setCurrentRequestId(null);
    } catch (error) {
      toast({
        title: "Failed to submit application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewApplications = async (requestId) => {
    try {
      const applications = await fetchApplicationsForRequest(requestId);
      setCurrentRequestId(requestId);
      setCurrentRequestApplications(applications.map(mapApiApplicationData));
      setIsViewApplicationsModalOpen(true);
    } catch (error) {
      toast({
        title: "Failed to load applications",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      await approveApplication(applicationId, { status: "accepted" });

      // Update UI optimistically
      const updatedApplications = currentRequestApplications.map(app =>
        app.id === applicationId
          ? { ...app, status: "accepted" }
          : { ...app, status: app.status === "pending" ? "declined" : app.status }
      );
      setCurrentRequestApplications(updatedApplications);

      setMyRequests(prev =>
        prev.map(req => {
          if (req.id === currentRequestId) {
            return {
              ...req,
              status: "accepted",
              applications: updatedApplications
            };
          }
          return req;
        })
      );

      setIsViewApplicationsModalOpen(false);

      toast({
        title: "Application accepted",
        description: "You have accepted the application for your class exchange request.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to accept application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeclineApplication = async (applicationId) => {
    try {
      await approveApplication(applicationId, { status: "declined" });

      // Update UI optimistically
      const updatedApplications = currentRequestApplications.map(app =>
        app.id === applicationId
          ? { ...app, status: "declined" }
          : app
      );
      setCurrentRequestApplications(updatedApplications);

      setMyRequests(prev =>
        prev.map(req => {
          if (req.id === currentRequestId) {
            return {
              ...req,
              applications: updatedApplications
            };
          }
          return req;
        })
      );

      toast({
        title: "Application declined",
        description: "You have declined the application for your class exchange request.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to decline application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await updateSectionRequest(requestId, { status: "cancelled" });
      
      // Update UI optimistically
      setMyRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: "cancelled" } 
            : req
        )
      );
      
      toast({
        title: "Request cancelled",
        description: "Your class exchange request has been cancelled.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to cancel request",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
                My Applications ({myApplications.length})
              </Tab>
            </TabList>

            <TabPanels p={6}>
              {/* Available Requests Panel */}
              <TabPanel p={0}>
                {isLoading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : availableRequests.length > 0 ? (
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
                        userId={user.id}
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
                {isLoading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : myRequests.length > 0 ? (
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
                        userId={user.id}
                        onCancel={handleCancelRequest}
                        onDelete={handleDeleteRequest}
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

              {/* My Applications Panel */}
              <TabPanel p={0}>
                {isLoading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : myApplications.length > 0 ? (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      xl: "repeat(3, 1fr)"
                    }}
                    gap={6}
                  >
                    {myApplications.map(application => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        onWithdraw={handleWithdrawApplication}
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
                    <Text color={mutedText}>No applications submitted yet</Text>
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
                      <Avatar size="sm" src={app.userAvatar} name={app.user?.name} mr={3} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textColor}>
                          {app.userName}
                        </Text>
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