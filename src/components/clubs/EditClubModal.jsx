import React, { useState, useEffect } from 'react';
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
  VStack,
  useToast,
} from '@chakra-ui/react';
import { updateClub } from '../../services/clubService';

/**
 * EditClubModal
 * Allows admins / moderators to update an existing club.
 * Accepts FormData in order to support optional logo change.
 */
const EditClubModal = ({ isOpen, onClose, club, onClubUpdated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // initialise state when club changes or modal opens
  useEffect(() => {
    if (club) {
      setName(club.name || '');
      setDescription(club.description || '');
      setLogo(null); // start fresh for each open
    }
  }, [club, isOpen]);

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!club) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      await updateClub(club.id, formData);
      toast({
        title: 'Club updated',
        description: 'The club has been successfully updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClubUpdated();
      onClose();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not update the club.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Edit Club</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Club Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Club Logo (optional)</FormLabel>
              <Input type="file" onChange={handleFileChange} accept="image/*" />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditClubModal;
