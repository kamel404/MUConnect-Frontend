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
  Container,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect, memo, useRef } from "react";
import { fetchEvents, fetchEventById, registerForEvent, unregisterFromEvent, fetchMyEvents, createEvent, updateEvent, deleteEvent, toggleSaveEvent } from "../services/eventsService";
import { FiCalendar, FiMapPin, FiBell, FiMoreVertical, FiShare2, FiEdit, FiTrash2, FiChevronLeft, FiSearch, FiBookmark, FiFilter, FiChevronDown, FiUser, FiCheck, FiClock, FiPlus, FiTag, FiImage, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContext } from "react";
import {useAuth} from "../context/AuthContext";

const MotionCard = motion(Card);

const EventsPage = () => {
  const userRole = localStorage.getItem('role');
  const canCreateEvent = userRole === 'admin' || userRole === 'moderator';
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("purple.500", "purple.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Event details modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Create event modal controls
  const { 
    isOpen: isCreateModalOpen, 
    onOpen: onCreateModalOpen, 
    onClose: onCreateModalClose 
  } = useDisclosure();
  
  // Edit event modal controls
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("All");
  
  // Registration states
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  // Saved events state
  const [savedEvents, setSavedEvents] = useState([]);
  
  // Events data state
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch registered events
  useEffect(() => {
    const getMyEvents = async () => {
      try {
        const data = await fetchMyEvents();
        const ids = (data.data || []).map(ev => ev.id);
        setRegisteredEvents(ids);
      } catch (err) {
        // Optionally show a toast or set error
      }
    };
    getMyEvents();
  }, []);

  // Fetch events from API
  useEffect(() => {
    const getEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prepare params for backend
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (timeFilter && timeFilter !== "All") {
          // Backend expects time filter as a string ("today", "this_week", "this_month")
          if (timeFilter === "Today") params.time_filter = "today";
          else if (timeFilter === "This Week") params.time_filter = "this_week";
          else if (timeFilter === "This Month") params.time_filter = "this_month";
        }
        const data = await fetchEvents(params);
        const mappedEvents = (data.data || []).map(ev => ({
          id: ev.id,
          title: ev.title,
          date: ev.event_datetime,
          location: ev.location,
          organizer: ev.organizer,
          description: ev.description,
          attendees: ev.attendees_count || 0, // use attendees_count from API
          media: ev.media,
          mediaType: ev.image_path ? (ev.image_path.endsWith('.mp4') ? 'video' : 'image') : undefined,
          speakers: ev.speaker_names
            ? ev.speaker_names.split(',').map(name => ({ name: name.trim(), title: "" }))
            : [],
        }));
        setEventsData(mappedEvents);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [searchQuery, timeFilter]);

  // No in-memory filtering needed; eventsData is already filtered from backend
  const filteredEvents = eventsData;
  
  // Handle event registration/unregistration
  const handleRegister = async (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setUnregistering(true);
      try {
        await unregisterFromEvent(eventId);
        setRegisteredEvents(prev => prev.filter(id => id !== eventId));
        toast({
          title: "Registration canceled",
          description: "You've been removed from the event",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Failed to unregister",
          description: err.message || "Could not unregister from event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setUnregistering(false);
        onClose();
      }
    } else {
      setRegistering(true);
      try {
        await registerForEvent(eventId);
        setRegisteredEvents(prev => [...prev, eventId]);
        toast({
          title: "Registration successful!",
          description: "You're now registered for this event",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: "Failed to register",
          description: err.message || "Could not register for event.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setRegistering(false);
        onClose();
      }
    }
  };
  
  // Toggle save/unsave event
  const handleToggleSave = async (eventId) => {
    try {
      await toggleSaveEvent(eventId);
      setSavedEvents(prevSaved => {
        const isSaved = prevSaved.includes(eventId);
        const updated = isSaved ? prevSaved.filter(id => id !== eventId) : [...prevSaved, eventId];
        toast({
          title: isSaved ? "Event unsaved" : "Event saved",
          description: isSaved ? "Removed from your bookmarks" : "Added to your bookmarks",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return updated;
      });
    } catch (err) {
      toast({
        title: "Failed to toggle save",
        description: err?.message || "Could not update bookmark.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handle adding a new event from the create event modal
  const handleAddEvent = async (newEvent) => {
    setCreatingEvent(true);
    try {
      await createEvent(newEvent);
      // Refetch events
      const data = await fetchEvents();
      const mappedEvents = (data.data || []).map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.event_datetime,
        location: ev.location,
        organizer: ev.organizer,
        description: ev.description,
        attendees: ev.attendees_count || 0,
        maxAttendees: ev.max_attendees || 0,
        media: ev.media,
        mediaType: ev.image_path ? (ev.image_path.endsWith('.mp4') ? 'video' : 'image') : undefined,
        speakers: ev.speaker_names
          ? ev.speaker_names.split(',').map(name => ({ name: name.trim(), title: "" }))
          : [],
      }));
      setEventsData(mappedEvents);
      toast({
        title: "Event created!",
        description: "Your event has been successfully created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to create event",
        description: err.message || "Could not create event.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreatingEvent(false);
    }
  };

  // Handler to open edit modal
  const openEditModal = (event) => {
    setEventToEdit(event);
    setEditModalOpen(true);
  };

  // Handler to close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEventToEdit(null);
  };

  // Handler for updating event
  const handleUpdateEvent = async (eventId, updatedData) => {
    try {
      await updateEvent(eventId, updatedData);
      // Refresh events list
      const data = await fetchEvents();
      const mappedEvents = (data.data || []).map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.event_datetime,
        location: ev.location,
        organizer: ev.organizer,
        description: ev.description,
        attendees: ev.attendees_count || 0,
        maxAttendees: ev.max_attendees || 0,
        media: ev.media,
        mediaType: ev.image_path ? (ev.image_path.endsWith('.mp4') ? 'video' : 'image') : undefined,
        speakers: ev.speaker_names
          ? ev.speaker_names.split(',').map(name => ({ name: name.trim(), title: "" }))
          : [],
      }));
      setEventsData(mappedEvents);
      toast({
        title: "Event updated!",
        description: "The event has been updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      closeEditModal();
    } catch (err) {
      toast({
        title: "Failed to update event",
        description: err?.message || "Could not update event.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Handler for deleting event
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      // Refresh events list
      const data = await fetchEvents();
      const mappedEvents = (data.data || []).map(ev => ({
        id: ev.id,
        title: ev.title,
        date: ev.event_datetime,
        location: ev.location,
        organizer: ev.organizer,
        description: ev.description,
        attendees: ev.attendees_count || 0,
        maxAttendees: ev.max_attendees || 0,
        media: ev.media,
        mediaType: ev.image_path ? (ev.image_path.endsWith('.mp4') ? 'video' : 'image') : undefined,
        speakers: ev.speaker_names
          ? ev.speaker_names.split(',').map(name => ({ name: name.trim(), title: "" }))
          : [],
      }));
      setEventsData(mappedEvents);
      toast({
        title: "Event deleted!",
        description: "The event has been removed.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Failed to delete event",
        description: err?.message || "Could not delete event.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Open event details modal
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    onOpen();
  };
  
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const EventCard = ({ event }) => (
    <MotionCard
      onClick={() => openEventDetails(event)}
      cursor="pointer"
      key={event.id}
      bg={cardBg}
      position="relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      boxShadow="md"
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardBody p={0}>
        <Stack spacing={0}>
          {/* Media Section */}
          <Box 
            position="relative"
            height="180px"
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
              top={3}
              left={3}
              bg="rgba(0,0,0,0.7)"
              py={1}
              px={2}
              borderRadius="md"
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
            
            {/* Bookmark Icon */}
            <IconButton
              aria-label={savedEvents.includes(event.id) ? "Unsave event" : "Bookmark event"}
              icon={<FiBookmark fill={savedEvents.includes(event.id) ? "currentColor" : "none"} />}
              position="absolute"
              top={3}
              right={12}
              colorScheme="purple"
              variant="ghost"
              size="lg"
              borderRadius="full"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSave(event.id);
              }}
            />

            {/* Options Menu */}
            <Menu placement="bottom-end">
              <MenuButton
                as={IconButton}
                aria-label="Event options"
                icon={<FiMoreVertical />}
                position="absolute"
                top={3}
                right={3}
                size="lg"
                variant="ghost"
                borderRadius="full"
                zIndex={1}
                onClick={e => e.stopPropagation()}
              />
              <MenuList minW="140px" zIndex={2}>
                {/* Share is always visible */}
                <MenuItem
                  icon={<FiShare2 />}
                  onClick={e => {
                    e.stopPropagation();
                    const eventUrl = `${window.location.origin}/events/${event.id}`;
                    navigator.clipboard.writeText(eventUrl);
                    toast({
                      title: "Link copied!",
                      description: "Event link copied to clipboard.",
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                >
                  Share
                </MenuItem>
                {/* Edit/Delete: only for moderator/admin */}
                {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'moderator') && (
                  <>
                    <MenuItem
                      icon={<FiEdit />}
                      onClick={e => {
                        e.stopPropagation();
                        openEditModal(event);
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<FiTrash2 />}
                      color="red.500"
                      onClick={async e => {
                        e.stopPropagation();
                        await handleDeleteEvent(event.id);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>

          </Box>

          <Stack p={4} spacing={3}>
            <Heading size="md" color={textColor} noOfLines={1}>
              {event.title}
            </Heading>
            
            <Flex direction="column" gap={2}>
              <Flex align="center" gap={2}>
                <Icon as={FiMapPin} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={mutedText} noOfLines={1}>
                  {event.location}
                </Text>
              </Flex>
              
              <Flex align="center" gap={2}>
                <Icon as={FiCalendar} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={mutedText}>
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </Flex>
            </Flex>
            
            {registeredEvents.includes(event.id) && (
              <Badge colorScheme="green" alignSelf="flex-start" px={2} py={1} borderRadius="full">
                <Flex align="center" gap={1}>
                  <Icon as={FiCheck} />
                  <Text>Registered</Text>
                </Flex>
              </Badge>
            )}
          </Stack>
        </Stack>
      </CardBody>
    </MotionCard>
  );

// Edit Event Modal (reuses CreateEventForm logic)
const EditEventForm = memo(({ isOpen, onClose, event, onEventUpdate }) => {
  // Local form state initialized with event data
  const [form, setForm] = useState({
    title: event?.title || "",
    date: event ? event.date?.split("T")[0] : "",
    time: event ? (event.date ? new Date(event.date).toISOString().slice(11,16) : "") : "",
    location: event?.location || "",
    organizer: event?.organizer || "",
    description: event?.description || "",
    speakerNames: event?.speakers?.map(s => s.name).join(", ") || "",
    mediaUrl: event?.media || "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState(event?.media || null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || "",
        date: event.date?.split("T")[0] || "",
        time: event.date ? new Date(event.date).toISOString().slice(11,16) : "",
        location: event.location || "",
        organizer: event.organizer || "",
        description: event.description || "",
        speakerNames: event.speakers?.map(s => s.name).join(", ") || "",
        mediaUrl: event.media || "",
        imageFile: null
      });
      setImagePreview(event.media || null);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(prev => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };
  const handleImageClick = () => fileInputRef.current.click();
  const handleCancel = () => { setErrors({}); onClose(); };
  const handleSubmit = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.organizer.trim()) newErrors.organizer = "Organizer is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const updatedEvent = {
      title: form.title,
      event_datetime: `${form.date} ${form.time}:00`,
      location: form.location,
      organizer: form.organizer,
      description: form.description,
      speaker_names: form.speakerNames,
      image_path: form.imageFile // File object if changed
    };
    onEventUpdate(event.id, updatedEvent);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent bg={cardBg} borderRadius="xl">
        <ModalHeader color={textColor}>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <FormControl isRequired isInvalid={errors.title}>
              <FormLabel>Event Title</FormLabel>
              <Input name="title" value={form.title} onChange={handleChange} placeholder="Enter event title" />
              {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.date}>
              <FormLabel>Date</FormLabel>
              <Input name="date" type="date" value={form.date} onChange={handleChange} />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.time}>
              <FormLabel>Time</FormLabel>
              <Input name="time" type="time" value={form.time} onChange={handleChange} />
              {errors.time && <FormErrorMessage>{errors.time}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiMapPin} color={mutedText} /></InputLeftElement>
                <Input name="location" value={form.location} onChange={handleChange} placeholder="Event location" />
              </InputGroup>
              {errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={errors.organizer}>
              <FormLabel>Organizer</FormLabel>
              <Input name="organizer" value={form.organizer} onChange={handleChange} placeholder="Organizing department or group" />
              {errors.organizer && <FormErrorMessage>{errors.organizer}</FormErrorMessage>}
            </FormControl>
            <FormControl gridColumn={{ md: "span 2" }} isRequired isInvalid={errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Provide details about your event" rows={5} />
              {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
            </FormControl>
            <FormControl gridColumn={{ md: "span 2" }}>
              <FormLabel>Speaker Names</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none"><Icon as={FiUserPlus} color={mutedText} /></InputLeftElement>
                <Input name="speakerNames" value={form.speakerNames} onChange={handleChange} placeholder="Names separated by commas" />
              </InputGroup>
              <FormHelperText>If applicable, add featured speakers</FormHelperText>
            </FormControl>
            <FormControl gridColumn={{ md: "span 2" }}>
              <FormLabel>Event Image</FormLabel>
              <Box position="relative">
                {imagePreview ? (
                  <Box position="relative" onClick={handleImageClick} cursor="pointer" borderRadius="md" overflow="hidden" mb={3}>
                    <Image src={imagePreview} alt="Event preview" height="200px" width="100%" objectFit="cover" />
                    <Box position="absolute" top={0} left={0} right={0} bottom={0} bg="blackAlpha.400" display="flex" alignItems="center" justifyContent="center" opacity={0} transition="opacity 0.2s" _hover={{ opacity: 1 }}>
                      <Text color="white" fontWeight="bold">Change Image</Text>
                    </Box>
                  </Box>
                ) : (
                  <Button leftIcon={<FiImage />} onClick={handleImageClick} width="100%" height="200px" variant="outline" mb={3} py={10}>
                    <VStack spacing={2}>
                      <Text>Click to upload event image</Text>
                      <Text fontSize="xs" color={mutedText}>JPEG, PNG or GIF, recommended size 1200×630px</Text>
                    </VStack>
                  </Button>
                )}
                <Input type="file" accept="image/*" display="none" ref={fileInputRef} onChange={handleImageChange} />
              </Box>
              <FormHelperText>A default image will be used if not provided</FormHelperText>
            </FormControl>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleCancel}>Cancel</Button>
          <Button colorScheme="purple" onClick={handleSubmit} leftIcon={<FiEdit />}>Update Event</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});


const CreateEventForm = memo(({ isOpen, onClose, onEventCreate }) => {
  // Local form state
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    description: "",
    speakerNames: "",
    mediaUrl: ""
  });
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  // Local validation state
  const [errors, setErrors] = useState({});
  
  // Theme values
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  
  // Get user from AuthContext
  const { user } = useAuth(); // user.id will be used for event creation

// Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(prev => ({
      ...prev,
      imageFile: file // store the File object for backend
    }));
    // For preview only
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setForm(prev => ({
        ...prev,
        mediaUrl: reader.result // keep for preview only
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // Open file selector
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Reset form
  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      organizer: "",
      description: "",
      speakerNames: "",
      mediaUrl: ""
    });
    setImagePreview(null);
    setErrors({});
  };
  
  // Close modal and reset form
  const handleCancel = () => {
    resetForm();
    onClose();
  };
  
  // Validate and submit form
  const handleSubmit = () => {
    // Validate form fields
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.organizer.trim()) newErrors.organizer = "Organizer is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Build event object for backend
    const eventData = {
      user_id: user?.id, // <-- from AuthContext
      title: form.title,
      event_datetime: `${form.date} ${form.time}:00`, // MySQL DATETIME format
      location: form.location,
      organizer: form.organizer,
      description: form.description,
      speaker_names: form.speakerNames, // comma-separated string
      image_path: form.imageFile // send the File object
    };
    
    // Send event to parent component
    onEventCreate(eventData);
    
    // Reset form and close modal
    resetForm();
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent bg={cardBg} borderRadius="xl">
        <ModalHeader color={textColor}>Create New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <FormControl isRequired isInvalid={errors.title}>
              <FormLabel>Event Title</FormLabel>
              <Input 
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
              {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.date}>
              <FormLabel>Date</FormLabel>
              <Input 
                name="date"
                type="date" 
                value={form.date}
                onChange={handleChange}
              />
              {errors.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.time}>
              <FormLabel>Time</FormLabel>
              <Input 
                name="time"
                type="time" 
                value={form.time}
                onChange={handleChange}
              />
              {errors.time && <FormErrorMessage>{errors.time}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.location}>
              <FormLabel>Location</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMapPin} color={mutedText} />
                </InputLeftElement>
                <Input 
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Event location"
                />
              </InputGroup>
              {errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage>}
            </FormControl>
            
            <FormControl isRequired isInvalid={errors.organizer}>
              <FormLabel>Organizer</FormLabel>
              <Input 
                name="organizer"
                value={form.organizer}
                onChange={handleChange}
                placeholder="Organizing department or group"
              />
              {errors.organizer && <FormErrorMessage>{errors.organizer}</FormErrorMessage>}
            </FormControl>
            
            <FormControl gridColumn={{ md: "span 2" }} isRequired isInvalid={errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Provide details about your event"
                rows={5}
              />
              {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
            </FormControl>
            

            
            <FormControl gridColumn={{ md: "span 2" }}>
              <FormLabel>Speaker Names</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiUserPlus} color={mutedText} />
                </InputLeftElement>
                <Input 
                  name="speakerNames"
                  value={form.speakerNames}
                  onChange={handleChange}
                  placeholder="Names separated by commas"
                />
              </InputGroup>
              <FormHelperText>If applicable, add featured speakers</FormHelperText>
            </FormControl>
            
            <FormControl gridColumn={{ md: "span 2" }}>
              <FormLabel>Event Image</FormLabel>
              <Box position="relative">
                {imagePreview ? (
                  <Box 
                    position="relative" 
                    onClick={handleImageClick}
                    cursor="pointer"
                    borderRadius="md"
                    overflow="hidden"
                    mb={3}
                  >
                    <Image 
                      src={imagePreview} 
                      alt="Event preview" 
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />
                    <Box 
                      position="absolute"
                      top={0} 
                      left={0} 
                      right={0} 
                      bottom={0}
                      bg="blackAlpha.400"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0}
                      transition="opacity 0.2s"
                      _hover={{ opacity: 1 }}
                    >
                      <Text color="white" fontWeight="bold">Change Image</Text>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    leftIcon={<FiImage />}
                    onClick={handleImageClick}
                    width="100%"
                    height="200px"
                    variant="outline"
                    mb={3}
                    py={10}
                  >
                    <VStack spacing={2}>
                      <Text>Click to upload event image</Text>
                      <Text fontSize="xs" color={mutedText}>JPEG, PNG or GIF, recommended size 1200×630px</Text>
                    </VStack>
                  </Button>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  display="none"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </Box>
              <FormHelperText>A default image will be used if not provided</FormHelperText>
            </FormControl>
          </Grid>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            leftIcon={<FiPlus />}
          >
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
  
  // Modal for event details
  const EventDetailsModal = () => {
    if (!selectedEvent) return null;
    
    const eventDate = new Date(selectedEvent.date);
    const isRegistered = registeredEvents.includes(selectedEvent.id);
    // No isFull logic needed since maxAttendees is not used
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>{selectedEvent.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box position="relative" mb={6}>
              <Image
                src={selectedEvent.media}
                alt={selectedEvent.title}
                w="100%"
                h="250px"
                objectFit="cover"
                borderRadius="lg"
              />
            </Box>
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
              <Box>
                <Heading size="md" mb={3} color={textColor}>About This Event</Heading>
                <Text color={textColor} mb={4}>
                  {selectedEvent.description}
                </Text>
                
                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <Box mt={5}>
                    <Heading size="sm" mb={3} color={textColor}>Featured Speakers</Heading>
                    <VStack align="start" spacing={3}>
                      {selectedEvent.speakers.map((speaker, index) => (
                        <HStack key={index} spacing={3}>
                          <Avatar size="sm" name={speaker.name} />
                          <Box>
                            <Text fontWeight="bold" fontSize="sm">{speaker.name}</Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
              
              <Box>
                <VStack align="start" spacing={4} p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                  <Heading size="sm" color={textColor}>Event Details</Heading>
                  
                  <HStack>
                    <Icon as={FiCalendar} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Date & Time</Text>
                      <Text fontSize="sm">
                        {eventDate.toLocaleDateString("en-US", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                      <Text fontSize="sm">
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiMapPin} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Location</Text>
                      <Text fontSize="sm">{selectedEvent.location}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiClock} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Organizer</Text>
                      <Text fontSize="sm">{selectedEvent.organizer}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            </Grid>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme={isRegistered ? "red" : "purple"}
              onClick={() => handleRegister(selectedEvent.id)}
              isLoading={registering}
            >
              {isRegistered ? "Cancel Registration" : "Register Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box minH="100vh" bg={bgColor} py={6} px={{ base: 4, md: 6 }}>
      <Container maxW="1200px">
        {/* Header */}
        <Flex mb={8} align="center" justify="space-between">
          <Flex align="center">
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
              <Heading size="lg" color={textColor}>Campus Events</Heading>
              <Text fontSize="sm" color={mutedText}>
                Discover and register for upcoming events
              </Text>
            </VStack>
          </Flex>
          
          {canCreateEvent && (
            <Button
              onClick={onCreateModalOpen}
              colorScheme="purple"
              leftIcon={<FiPlus />}
              size={isMobile ? "sm" : "md"}
              display={{ base: "none", md: "flex" }}
            >
              Create Event
            </Button>
          )}
        </Flex>
        
        {/* Filter Section */}
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="sm" mb={8} borderWidth="1px" borderColor={borderColor}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} justify="space-between" align={{ base: "stretch", md: "center" }}>
            <InputGroup maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={mutedText} />
              </InputLeftElement>
              <Input 
                placeholder="Search for events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                focusBorderColor={accentColor}
              />
            </InputGroup>
            
            <HStack spacing={3}>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline" size="md">
                  <Flex align="center">
                    <Icon as={FiCalendar} mr={2} />
                    <Text>{timeFilter}</Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    onClick={() => setTimeFilter("All")}
                    fontWeight={timeFilter === "All" ? "bold" : "normal"}
                  >
                    All
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("Today")}
                    fontWeight={timeFilter === "Today" ? "bold" : "normal"}
                  >
                    Today
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("This Week")}
                    fontWeight={timeFilter === "This Week" ? "bold" : "normal"}
                  >
                    This Week
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("This Month")}
                    fontWeight={timeFilter === "This Month" ? "bold" : "normal"}
                  >
                    This Month
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>
        
        {/* Event Tabs */}
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList mb={6}>
            <Tab _selected={{ bg: `${accentColor}20`, color: accentColor, fontWeight: "semibold" }}>All Events ({filteredEvents.length})</Tab>
            <Tab _selected={{ bg: `${accentColor}20`, color: accentColor, fontWeight: "semibold" }}>
              My Events ({registeredEvents.length})
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0}>
              {loading ? (
  <Grid 
    templateColumns={{ 
      base: "1fr", 
      md: "repeat(2, 1fr)", 
      lg: "repeat(3, 1fr)",
      xl: "repeat(4, 1fr)" 
    }}
    gap={6}
  >
    {[...Array(6)].map((_, idx) => (
      <Skeleton key={idx} height="300px" borderRadius="xl" />
    ))}
  </Grid>
) : filteredEvents.length > 0 ? (
  <Grid 
    templateColumns={{ 
      base: "1fr", 
      md: "repeat(2, 1fr)", 
      lg: "repeat(3, 1fr)",
      xl: "repeat(4, 1fr)" 
    }}
    gap={6}
  >
    {filteredEvents.map((event) => (
      <EventCard key={event.id} event={event} />
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
    <Text color={mutedText}>No Events Found!</Text>
  </Box>
)}
            </TabPanel>
            
            <TabPanel p={0}>
              {registeredEvents.length > 0 ? (
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)" 
                  }}
                  gap={6}
                >
                  {eventsData.filter(event => registeredEvents.includes(event.id))
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
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
                  <Text color={mutedText}>You haven't registered for any events yet</Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      
      {/* Floating Create Button (Mobile) */}
      <IconButton
        position="fixed"
        bottom="24px"
        right="24px"
        aria-label="Create event"
        icon={<FiPlus />}
        colorScheme="purple"
        isRound
        boxShadow="lg"
        size="lg"
        onClick={onCreateModalOpen}
        display={{ base: "flex", md: "none" }}
        zIndex={2}
      />
      
      {/* Event Details Modal */}
      <EventDetailsModal />
      
      {/* Edit Event Modal */}
      {isEditModalOpen && (
        <EditEventForm
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          event={eventToEdit}
          onEventUpdate={handleUpdateEvent}
        />
      )}
      
      {/* Create Event Modal */}
      <CreateEventForm 
        isOpen={isCreateModalOpen} 
        onClose={onCreateModalClose} 
        onEventCreate={handleAddEvent}
      />
    </Box>
  );
};

export default EventsPage;