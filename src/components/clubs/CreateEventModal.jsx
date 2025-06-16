import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { createClubEvent } from '../../services/clubService';

const CreateEventModal = ({ isOpen, onClose, club, onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [eventDatetime, setEventDatetime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [speakerNames, setSpeakerNames] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!club) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('event_datetime', eventDatetime);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('speaker_names', speakerNames);
    if (image) {
      formData.append('image_path', image);
    }

    try {
      await createClubEvent(club.id, formData);
      toast({ 
        title: 'Event created.', 
        description: `The event for ${club.name} has been successfully created.`,
        status: 'success', 
        duration: 5000, 
        isClosable: true 
      });
      onEventCreated();
      onClose();
    } catch (error) {
      toast({ 
        title: 'Creation failed.', 
        description: error.message || "Could not create the event.", 
        status: 'error', 
        duration: 5000, 
        isClosable: true 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Create Event for {club?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Date and Time</FormLabel>
              <Input type="datetime-local" value={eventDatetime} onChange={(e) => setEventDatetime(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter event location" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details" />
            </FormControl>
            <FormControl>
              <FormLabel>Speaker Names</FormLabel>
              <Input value={speakerNames} onChange={(e) => setSpeakerNames(e.target.value)} placeholder="e.g., John Doe, Jane Smith" />
            </FormControl>
            <FormControl>
              <FormLabel>Event Image</FormLabel>
              <Input type="file" onChange={handleFileChange} accept="image/*" />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventModal;
