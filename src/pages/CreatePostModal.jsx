import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  Text,
  Avatar,
  IconButton,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Select,
  Box,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { FiUsers, FiBook, FiCalendar, FiImage, FiMapPin, FiUpload } from "react-icons/fi";
import { useState } from "react";

const CreatePostModal = ({ isOpen, onClose, addNewPost, user }) => {
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  const [postContent, setPostContent] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [additionalData, setAdditionalData] = useState({});

  const handleSubmit = () => {
    addNewPost(postContent, selectedType, additionalData);
    onClose();
    setPostContent("");
    setSelectedType(null);
    setAdditionalData({});
  };

  const renderAdditionalFields = () => {
    const commonProps = {
      borderRadius: "lg",
      borderColor: borderColor,
      _focus: { borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` },
    };

    switch (selectedType) {
      case "Study Group":
        return (
          <FormControl mt={3}>
            <FormLabel display="flex" alignItems="center" gap={2}>
              <Icon as={FiCalendar} /> Study Date
            </FormLabel>
            <Input
              type="datetime-local"
              onChange={(e) => setAdditionalData({ date: e.target.value })}
              {...commonProps}
            />
          </FormControl>
        );
      case "Course Material":
        return (
          <FormControl mt={3}>
            <FormLabel display="flex" alignItems="center" gap={2}>
              <Icon as={FiBook} /> Related Course
            </FormLabel>
            <Select
              placeholder="Select course"
              onChange={(e) => setAdditionalData({ course: e.target.value })}
              {...commonProps}
            >
              <option value="Computer Science 101">CS 101</option>
              <option value="Mathematics 202">MATH 202</option>
              <option value="Physics 301">PHYS 301</option>
            </Select>
          </FormControl>
        );
      case "Event":
        return (
          <Box>
            <FormControl mt={3}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FiCalendar} /> Event Date
              </FormLabel>
              <Input
                type="datetime-local"
                onChange={(e) => setAdditionalData(prev => ({ ...prev, date: e.target.value }))}
                {...commonProps}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                <Icon as={FiMapPin} /> Location
              </FormLabel>
              <Input
                placeholder="Enter location"
                onChange={(e) => setAdditionalData(prev => ({ ...prev, location: e.target.value }))}
                {...commonProps}
              />
            </FormControl>
          </Box>
        );
      case "Media":
        return (
          <FormControl mt={3}>
            <FormLabel display="flex" alignItems="center" gap={2}>
              <Icon as={FiUpload} /> Upload Media
            </FormLabel>
            <Box
              border="2px dashed"
              borderColor={borderColor}
              borderRadius="lg"
              p={6}
              textAlign="center"
              cursor="pointer"
              _hover={{ borderColor: accentColor }}
            >
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setAdditionalData({ file: e.target.files[0] })}
                opacity={0}
                position="absolute"
                cursor="pointer"
              />
              <Text fontSize="sm" color="gray.500">
                Click to upload or drag and drop
              </Text>
            </Box>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const iconOptions = [
    { type: "Study Group", icon: FiUsers, title: "Group" },
    { type: "Course Material", icon: FiBook, title: "Material" },
    { type: "Event", icon: FiCalendar, title: "Event" },
    { type: "Media", icon: FiImage, title: "Media" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} overflow="hidden">
        <ModalHeader borderBottomWidth="1px" py={3}>
          <Flex align="center">
            <Avatar
              name={user?.name}
              src={user?.avatar}
              size="md"
              mr={3}
              border="2px solid"
              borderColor={accentColor}
            />
            <Text fontSize="lg" fontWeight="bold">
              Create Post
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton size="lg" mt={1} />
        
        <ModalBody py={4}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <Textarea
                placeholder="Share your knowledge..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                size="lg"
                borderRadius="lg"
                minHeight="120px"
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
              <Flex justify="flex-end" mt={2}>
                <Badge colorScheme="gray" fontSize="xs">
                  {postContent.length}/500
                </Badge>
              </Flex>
            </FormControl>

            <Divider borderColor={borderColor} />

            <HStack spacing={3} justify="space-evenly">
              {iconOptions.map((item) => (
                <Flex key={item.type} direction="column" align="center" gap={1}>
                  <IconButton
                    icon={<item.icon />}
                    aria-label={item.type}
                    borderRadius="full"
                    size="lg"
                    colorScheme={selectedType === item.type ? "blue" : "gray"}
                    variant={selectedType === item.type ? "solid" : "ghost"}
                    onClick={() => setSelectedType(prev => prev === item.type ? null : item.type)}
                    _hover={{ transform: "scale(1.1)" }}
                    transition="all 0.2s"
                    position="relative"
                  />
                  {selectedType === item.type && (
                    <Badge
                      colorScheme="blue"
                      variant="solid"
                      borderRadius="full"
                      fontSize="8px"
                      boxSize="16px"
                      position="relative"
                      top="-12px"
                    >
                      ✓
                    </Badge>
                  )}
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    {item.title}
                  </Text>
                </Flex>
              ))}
            </HStack>

            {selectedType && (
              <Box
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={borderColor}
                bg={hoverBg}
              >
                {renderAdditionalFields()}
              </Box>
            )}

            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSubmit}
              isDisabled={!postContent.trim()}
              _hover={{ transform: "translateY(-1px)", shadow: "md" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
            >
              Publish Post
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePostModal;