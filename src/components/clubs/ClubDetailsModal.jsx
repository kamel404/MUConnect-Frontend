import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Box,
  Flex,
  Text,
  Image,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Spinner,
  useColorModeValue,
  Avatar,
  VStack,
  HStack,
  Divider,
  IconButton,
  useToast,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiUsers, FiCalendar, FiChevronLeft, FiChevronRight, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import { getClubDetails, deleteClubMember } from '../../services/clubService';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';

const MemberCarousel = ({ members, textColor, mutedText, accentColor, borderColor, formatDate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const cardBg = useColorModeValue('gray.50', 'gray.800');

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? members.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === members.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const currentMember = members[currentIndex];

  return (
    <Box position="relative" py={4}>
      {/* Member Card */}
      <Box
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        cursor="pointer"
      >
        <Card
          bg={cardBg}
          borderWidth="2px"
          borderColor={accentColor}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="xl"
          maxW="400px"
          mx="auto"
        >
          <CardBody p={8}>
            <VStack spacing={6}>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  src={currentMember.picture}
                  name={currentMember.name}
                  borderWidth="4px"
                  borderColor={accentColor}
                  boxShadow="lg"
                />
                <Badge
                  position="absolute"
                  bottom="-2"
                  right="-2"
                  colorScheme="blue"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {currentIndex + 1} / {members.length}
                </Badge>
              </Box>
              
              <VStack spacing={2} w="full">
                <Text
                  fontWeight="bold"
                  fontSize="2xl"
                  color={textColor}
                  textAlign="center"
                >
                  {currentMember.name}
                </Text>
                
                {/* Admin Actions */}
                {(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'moderator') && (
                  <HStack spacing={2} mt={2}>
                    <IconButton
                      icon={<FiEdit />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => window.handleEditMember(currentMember)}
                      aria-label="Edit member"
                    />
                    <IconButton
                      icon={<FiTrash />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => window.handleDeleteMember(currentMember)}
                      aria-label="Delete member"
                    />
                  </HStack>
                )}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>

      {/* Navigation Buttons */}
      {members.length > 1 && (
        <>
          <IconButton
            icon={<FiChevronLeft />}
            position="absolute"
            left={{ base: 0, md: -4 }}
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrevious}
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            size="lg"
            boxShadow="lg"
            aria-label="Previous member"
            zIndex={2}
          />
          <IconButton
            icon={<FiChevronRight />}
            position="absolute"
            right={{ base: 0, md: -4 }}
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNext}
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            size="lg"
            boxShadow="lg"
            aria-label="Next member"
            zIndex={2}
          />
        </>
      )}

      {/* Dots Indicator */}
      {members.length > 1 && (
        <HStack justify="center" spacing={2} mt={6}>
          {members.map((_, index) => (
            <Box
              key={index}
              w={currentIndex === index ? "24px" : "8px"}
              h="8px"
              borderRadius="full"
              bg={currentIndex === index ? accentColor : borderColor}
              transition="all 0.3s"
              cursor="pointer"
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </HStack>
      )}

      {/* Swipe Hint */}
      {members.length > 1 && (
        <Text
          textAlign="center"
          fontSize="xs"
          color={mutedText}
          mt={4}
          fontStyle="italic"
        >
          Swipe or use arrows to navigate
        </Text>
      )}
    </Box>
  );
};

const ClubDetailsModal = ({ isOpen, onClose, clubId }) => {
  const [clubDetails, setClubDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  
  const { isOpen: isAddMemberOpen, onOpen: onAddMemberOpen, onClose: onAddMemberClose } = useDisclosure();
  const { isOpen: isEditMemberOpen, onOpen: onEditMemberOpen, onClose: onEditMemberClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();
  const userRole = localStorage.getItem('role');
  const isAdminOrModerator = userRole === 'admin' || userRole === 'moderator';

  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.800, gray.900)'
  );

  useEffect(() => {
    if (isOpen && clubId) {
      fetchClubDetails();
    }
  }, [isOpen, clubId]);

  const fetchClubDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClubDetails(clubId);
      setClubDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch club details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    onEditMemberOpen();
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    onDeleteAlertOpen();
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteClubMember(clubId, memberToDelete.id);
      toast({
        title: 'Success',
        description: 'Member removed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteAlertClose();
      setMemberToDelete(null);
      fetchClubDetails(); // Refresh the club details
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Make handlers available globally for MemberCarousel
  useEffect(() => {
    window.handleEditMember = handleEditMember;
    window.handleDeleteMember = handleDeleteMember;
    
    return () => {
      delete window.handleEditMember;
      delete window.handleDeleteMember;
    };
  }, [clubId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent maxH="90vh">
        <ModalHeader
          bgGradient={bgGradient}
          borderTopRadius="md"
          pb={4}
        >
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Club Details
          </Text>
        </ModalHeader>
        <ModalCloseButton top={4} />
        
        <ModalBody p={6}>
          {loading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner size="xl" color={accentColor} thickness="4px" />
            </Flex>
          ) : error ? (
            <Box textAlign="center" py={10}>
              <Text color="red.500" fontSize="lg">{error}</Text>
            </Box>
          ) : clubDetails ? (
            <VStack spacing={6} align="stretch">
              {/* Club Header */}
              <Card bg={cardBg} boxShadow="md" borderRadius="xl" overflow="hidden">
                <CardBody p={0}>
                  <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6} p={6}>
                    <Image
                      src={clubDetails.logo}
                      alt={clubDetails.name}
                      boxSize={{ base: "120px", md: "150px" }}
                      objectFit="cover"
                      borderRadius="xl"
                      boxShadow="lg"
                    />
                    <VStack align={{ base: 'center', md: 'flex-start' }} flex={1} spacing={3}>
                      <Heading size="lg" color={textColor} textAlign={{ base: 'center', md: 'left' }}>
                        {clubDetails.name}
                      </Heading>
                      <Text color={mutedText} fontSize="md" textAlign={{ base: 'center', md: 'left' }}>
                        {clubDetails.description}
                      </Text>
                      <HStack spacing={4} flexWrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
                        <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="sm">
                          <HStack spacing={1}>
                            <FiUsers />
                            <Text>{clubDetails.members} members</Text>
                          </HStack>
                        </Badge>
                        {clubDetails.upcoming_event && (
                          <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="sm">
                            <HStack spacing={1}>
                              <FiCalendar />
                              <Text>Upcoming Event</Text>
                            </HStack>
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </Flex>
                </CardBody>
              </Card>

              {/* Upcoming Event Section */}
              {clubDetails.upcoming_event && (
                <Card bg={cardBg} boxShadow="md" borderRadius="xl">
                  <CardBody>
                    <Heading size="md" mb={4} color={textColor}>
                      Upcoming Event
                    </Heading>
                    <VStack align="stretch" spacing={2}>
                      <Text fontSize="lg" fontWeight="semibold" color={accentColor}>
                        {clubDetails.upcoming_event.title}
                      </Text>
                      <Text color={mutedText}>
                        {clubDetails.upcoming_event.description || 'No description available'}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Members Section */}
              <Card bg={cardBg} boxShadow="md" borderRadius="xl">
                <CardBody>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md" color={textColor}>
                      Meet the Members
                    </Heading>
                    {isAdminOrModerator && (
                      <Button
                        leftIcon={<FiPlus />}
                        colorScheme="blue"
                        size="sm"
                        onClick={onAddMemberOpen}
                      >
                        Add Member
                      </Button>
                    )}
                  </Flex>
                  <Divider mb={4} borderColor={borderColor} />
                  
                  {clubDetails.club_members && clubDetails.club_members.length > 0 ? (
                    <MemberCarousel 
                      members={clubDetails.club_members}
                      textColor={textColor}
                      mutedText={mutedText}
                      accentColor={accentColor}
                      borderColor={borderColor}
                      formatDate={formatDate}
                    />
                  ) : (
                    <Box textAlign="center" py={8}>
                      <FiUsers size={50} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                      <Text color={mutedText} fontSize="lg">
                        No members found
                      </Text>
                    </Box>
                  )}
                </CardBody>
              </Card>

             
            </VStack>
          ) : null}
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor={borderColor}>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
      
      {/* Member Management Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={onAddMemberClose}
        clubId={clubId}
        onMemberAdded={fetchClubDetails}
      />
      <EditMemberModal
        isOpen={isEditMemberOpen}
        onClose={onEditMemberClose}
        clubId={clubId}
        member={selectedMember}
        onMemberUpdated={fetchClubDetails}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove <strong>{memberToDelete?.name}</strong> from the club?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteMember} ml={3}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

export default ClubDetailsModal;
