import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Heading,
  Stack,
  Grid,
  Box,
  Text,
  Badge,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";

const CreateGroupModal = ({ 
  isOpen, 
  onClose, 
  newGroup, 
  onInputChange, 
  onCreateGroup, 
  subjects 
}) => {
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  
  const filteredSubjects = subjects.filter(s => s !== "All");
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={dividerColor} pb={4}>
          <Heading size="md">Create a New Study Group</Heading>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Group Name</FormLabel>
              <Input 
                name="name" 
                value={newGroup.name} 
                onChange={onInputChange} 
                placeholder="e.g., Calculus II Problem Solvers"
                borderRadius="md"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Course Code</FormLabel>
              <Input 
                name="course" 
                value={newGroup.course} 
                onChange={onInputChange} 
                placeholder="e.g., MATH 152"
                borderRadius="md"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Subject</FormLabel>
              <Select 
                name="subject" 
                value={newGroup.subject} 
                onChange={onInputChange}
                borderRadius="md"
              >
                {filteredSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Description</FormLabel>
              <Textarea 
                name="description" 
                value={newGroup.description} 
                onChange={onInputChange} 
                placeholder="Describe the purpose, goals, and activities of your study group..."
                borderRadius="md"
                minHeight="120px"
              />
            </FormControl>
            
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Meeting Times</FormLabel>
                <Input 
                  name="meetings" 
                  value={newGroup.meetings} 
                  onChange={onInputChange} 
                  placeholder="e.g., Mon 5 PM, Thu 5 PM"
                  borderRadius="md"
                />
                <Text fontSize="sm" color={mutedText} mt={1}>
                  Separate multiple meeting times with commas
                </Text>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Location</FormLabel>
                <Input 
                  name="location" 
                  value={newGroup.location} 
                  onChange={onInputChange} 
                  placeholder="e.g., Library, Room 203"
                  borderRadius="md"
                />
              </FormControl>
            </Grid>
            
            <Box pt={2}>
              <Text fontWeight="medium" mb={2}>Group Capacity</Text>
              <Flex align="center">
                <Text color={mutedText} mr={2}>Default: 15 members</Text>
                <Badge colorScheme="blue">You can change this later</Badge>
              </Flex>
            </Box>
          </Stack>
        </ModalBody>
        
        <ModalFooter borderTopWidth="1px" borderColor={dividerColor} pt={4}>
          <Button variant="ghost" mr={3} onClick={onClose} borderRadius="md">
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiCheck />} 
            onClick={onCreateGroup}
            isDisabled={!newGroup.name || !newGroup.course || !newGroup.description || !newGroup.meetings || !newGroup.location}
            borderRadius="md"
          >
            Create Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGroupModal;
