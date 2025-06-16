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
import { createClub } from '../../services/clubService';

const CreateClubModal = ({ isOpen, onClose, onClubCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      await createClub(formData);
      toast({ 
        title: 'Club created.', 
        description: "The new club has been successfully created.", 
        status: 'success', 
        duration: 5000, 
        isClosable: true 
      });
      onClubCreated(); // Callback to refresh the list
      onClose(); // Close the modal
    } catch (error) {
      toast({ 
        title: 'Creation failed.', 
        description: error.message || "Could not create the club.", 
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
        <ModalHeader>Create a New Club</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Club Name</FormLabel>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter club name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Tell us about the club"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Club Logo</FormLabel>
              <Input type="file" onChange={handleFileChange} accept="image/*" />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            type="submit" 
            isLoading={isLoading}
          >
            Create Club
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateClubModal;
