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
  Button,
  Heading,
  Stack,
  Grid,
  Box,
  Text,
  Flex,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Checkbox
} from "@chakra-ui/react";
import { FiCheck, FiChevronDown} from "react-icons/fi";

const CreateGroupModal = ({
  isOpen,
  onClose,
  newGroup,
  onInputChange,
  onCreateGroup,
  courses = [],
  coursesLoading = false,
  currentCoursePage = 1,
  totalCoursePages = 1,
  onCoursePageChange = () => {}
}) => {
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
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
              <FormLabel fontWeight="medium">Course</FormLabel>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  w="100%"
                  textAlign="left"
                  fontWeight="normal"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {(newGroup.course_id && courses.length > 0 && courses.find(c => c.id === Number(newGroup.course_id)))
                    ? `${courses.find(c => c.id === Number(newGroup.course_id)).code} - ${courses.find(c => c.id === Number(newGroup.course_id)).title}`
                    : "Select course"}
                </MenuButton>
                <MenuList maxH="320px" overflowY="auto" minW="400px">
                  {coursesLoading ? (
                    <Flex justify="center" align="center" h="100px">
                      <Spinner />
                    </Flex>
                  ) : (
                    courses.map((course) => (
                      <MenuItem key={course.id} onClick={() => onInputChange({ target: { name: 'course_id', value: course.id } })}>
                        <Box>
                          <Text fontWeight="medium">{course.code} - {course.title}</Text>
                          <Text fontSize="sm" color={mutedText}>{course.major?.name}</Text>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                  {totalCoursePages > 1 && (
                    <Box borderTop="1px solid" borderColor={dividerColor} mt={2} pt={2} px={2}>
                      <Flex justify="space-between" align="center">
                        <Button
                          size="xs"
                          onClick={e => { e.stopPropagation(); onCoursePageChange(currentCoursePage - 1); }}
                          isDisabled={currentCoursePage <= 1 || coursesLoading}
                          variant="outline"
                          borderRadius="md"
                        >
                          Prev
                        </Button>
                        <Text fontSize="xs" color={mutedText} mx={2}>
                          Page {currentCoursePage} of {totalCoursePages}
                        </Text>
                        <Button
                          size="xs"
                          onClick={e => { e.stopPropagation(); onCoursePageChange(currentCoursePage + 1); }}
                          isDisabled={currentCoursePage >= totalCoursePages || coursesLoading}
                          variant="outline"
                          borderRadius="md"
                        >
                          Next
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </MenuList>
              </Menu>
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
                <FormLabel fontWeight="medium">Meeting Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="meeting_time"
                  value={newGroup.meeting_time}
                  onChange={onInputChange}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="medium">Location</FormLabel>
                <Input
                  name="location"
                  value={newGroup.location}
                  onChange={onInputChange}
                  placeholder="e.g., Library Room 201"
                  borderRadius="md"
                  isDisabled={newGroup.isOnline}
                />
              </FormControl>
            </Grid>

            <FormControl>
              <Checkbox
                name="isOnline"
                isChecked={newGroup.isOnline}
                onChange={onInputChange}
              >
                This is an online meeting
              </Checkbox>
            </FormControl>
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
            isDisabled={
              !newGroup.name ||
              !newGroup.course_id ||
              !newGroup.description ||
              !newGroup.meeting_time ||
              (!newGroup.isOnline && !newGroup.location)
            }
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
