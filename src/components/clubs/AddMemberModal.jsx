import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Image,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { addClubMember } from '../../services/clubService';

const AddMemberModal = ({ isOpen, onClose, clubId, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter member name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!picture) {
      toast({
        title: 'Error',
        description: 'Please select a member picture',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('picture', picture);

      await addClubMember(clubId, formData);
      
      toast({
        title: 'Success',
        description: 'Member added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setName('');
      setPicture(null);
      setPicturePreview(null);
      onMemberAdded();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add member',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPicture(null);
    setPicturePreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>Add New Member</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Member Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter member name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Member Picture</FormLabel>
                <Box
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={4}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: 'blue.500' }}
                  onClick={() => document.getElementById('member-picture-input').click()}
                >
                  {picturePreview ? (
                    <Image
                      src={picturePreview}
                      alt="Preview"
                      maxH="200px"
                      mx="auto"
                      borderRadius="md"
                    />
                  ) : (
                    <VStack spacing={2}>
                      <FiUpload size={40} />
                      <Text fontSize="sm">Click to upload member picture</Text>
                    </VStack>
                  )}
                </Box>
                <Input
                  id="member-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  display="none"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText="Adding..."
            >
              Add Member
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddMemberModal;
