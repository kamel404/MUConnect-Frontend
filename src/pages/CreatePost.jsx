import {
    Button,
    Flex,
    Avatar,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Textarea,
    Select,
    useColorModeValue,
    Box,
    Input,
    FormControl,
    FormLabel,
    Stack,
    IconButton,
    Tag,
    Checkbox,
    Grid,
    GridItem,
    HStack
} from "@chakra-ui/react";
import {
    FiPlus,
    FiCalendar,
    FiFile,
    FiImage,
    FiX,
    FiBattery
} from "react-icons/fi";
import { useState } from "react";

const CreatePost = ({ onCreatePost, courses }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeModal, setActiveModal] = useState(null);
    const [postContent, setPostContent] = useState("");
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || "");

    // Document state
    const [files, setFiles] = useState([]);

    // Media state
    const [mediaFiles, setMediaFiles] = useState([]);

    // Event state
    const [eventDetails, setEventDetails] = useState({
        title: "",
        date: "",
        location: ""
    });

    // Poll state
    const [poll, setPoll] = useState({
        question: "",
        options: ["", ""],
        deadline: ""
    });

    const textColor = useColorModeValue("gray.800", "white");
    const modalBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const hoverBg = useColorModeValue("gray.50", "gray.600");

    const handleFileUpload = (e, type) => {
        const newFiles = Array.from(e.target.files);
        if (type === 'document') {
            setFiles([...files, ...newFiles]);
        } else {
            setMediaFiles([...mediaFiles, ...newFiles]);
        }
    };

    const removeFile = (index, type) => {
        if (type === 'document') {
            setFiles(files.filter((_, i) => i !== index));
        } else {
            setMediaFiles(mediaFiles.filter((_, i) => i !== index));
        }
    };

    const addPollOption = () => {
        setPoll({ ...poll, options: [...poll.options, ""] });
    };

    const handlePollOptionChange = (index, value) => {
        const newOptions = [...poll.options];
        newOptions[index] = value;
        setPoll({ ...poll, options: newOptions });
    };

    const handleSubmit = (type) => {
        const basePost = {
            content: postContent,
            course: courses.find(c => c.id === selectedCourse)?.name || "",
            type
        };

        let postData;

        switch (type) {
            case 'document':
                postData = { ...basePost, files };
                break;
            case 'media':
                postData = { ...basePost, media: mediaFiles };
                break;
            case 'event':
                postData = { ...basePost, ...eventDetails };
                break;
            case 'poll':
                postData = { ...basePost, ...poll };
                break;
            default:
                postData = basePost;
        }

        onCreatePost(postData);
        closeAll();
    };

    const closeAll = () => {
        setPostContent("");
        setFiles([]);
        setMediaFiles([]);
        setEventDetails({ title: "", date: "", location: "" });
        setPoll({ question: "", options: ["", ""], deadline: "" });
        setActiveModal(null);
        onClose();
    };

    return (
        <>
            {/* Post Trigger Button */}
            <Flex
                p={4}
                mb={4}
                bg={useColorModeValue("white", "gray.700")}
                borderRadius="md"
                boxShadow="sm"
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                onClick={onOpen}
            >
                <Avatar size="md" src="https://bit.ly/dan-abramov" mr={4} />
                <Text color={useColorModeValue("gray.500", "gray.400")}>
                    What's on your mind, Ahmed?
                </Text>
            </Flex>

            {/* Main Modal */}
            <Modal isOpen={isOpen} onClose={closeAll} size="xl">
                <ModalOverlay />
                <ModalContent bg={modalBg}>
                    <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
                        Create Post
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody py={4}>
                        <Flex mb={4}>
                            <Avatar size="md" src="https://bit.ly/dan-abramov" mr={3} />
                            <Box>
                                <Text fontWeight="600" color={textColor}>Ahmed Ali</Text>
                                <Select
                                    size="sm"
                                    w="fit-content"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        </Flex>

                        <Textarea
                            placeholder="Share your thoughts..."
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            minH="100px"
                            border="none"
                            fontSize="lg"
                            _focus={{ boxShadow: "none" }}
                        />

                        <Grid templateColumns="repeat(3, 1fr)" gap={2} mt={4}>
                            <PostTypeButton
                                icon={<FiFile />}
                                label="Document"
                                onClick={() => setActiveModal('document')}
                            />
                            <PostTypeButton
                                icon={<FiImage />}
                                label="Image/Video"
                                onClick={() => setActiveModal('media')}
                            />
                            <PostTypeButton
                                icon={<FiCalendar />}
                                label="Event"
                                onClick={() => setActiveModal('event')}
                            />
                            <PostTypeButton
                                icon={<FiBattery />}
                                label="Poll"
                                onClick={() => setActiveModal('poll')}
                            />
                        </Grid>
                    </ModalBody>

                    <ModalFooter borderTop="1px solid" borderColor={borderColor}>
                        <Button variant="ghost" mr={3} onClick={closeAll}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => handleSubmit('general')}
                            isDisabled={!postContent.trim()}
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Document Modal */}
            <Modal isOpen={activeModal === 'document'} onClose={() => setActiveModal(null)}>
                <ModalOverlay />
                <ModalContent bg={modalBg}>
                    <ModalHeader>Add Documents</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload(e, 'document')}
                        />
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={() => setActiveModal(null)}>
                                Back
                            </Button>
                            <Button colorScheme="blue" onClick={() => handleSubmit('document')}>
                                Add Documents
                            </Button>
                        </ModalFooter>
                        <Stack mt={4}>
                            {files.map((file, index) => (
                                <HStack key={index} justify="space-between">
                                    <Text>{file.name}</Text>
                                    <IconButton
                                        icon={<FiX />}
                                        size="sm"
                                        onClick={() => removeFile(index, 'document')}
                                    />
                                </HStack>
                            ))}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Media Modal */}
            <Modal isOpen={activeModal === 'media'} onClose={() => setActiveModal(null)}>
                <ModalOverlay />
                <ModalContent bg={modalBg}>
                    <ModalHeader>Add Media</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            type="file"
                            multiple
                            accept="image/*, video/*"
                            onChange={(e) => handleFileUpload(e, 'media')}
                        />
                        <Grid templateColumns="repeat(3, 1fr)" gap={4} mt={4}>
                            {mediaFiles.map((file, index) => (
                                <Box key={index} position="relative">
                                    <Box
                                        as="img"
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        w="100%"
                                        h="100px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                    <IconButton
                                        icon={<FiX />}
                                        size="sm"
                                        position="absolute"
                                        top={1}
                                        right={1}
                                        onClick={() => removeFile(index, 'media')}
                                    />
                                </Box>
                            ))}
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={() => setActiveModal(null)}>
                            Back
                        </Button>
                        <Button colorScheme="blue" onClick={() => handleSubmit('media')}>
                            Add Media
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Event Modal */}
            <Modal isOpen={activeModal === 'event'} onClose={() => setActiveModal(null)}>
                <ModalOverlay />
                <ModalContent bg={modalBg}>
                    <ModalHeader>Create Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Event Title</FormLabel>
                            <Input
                                value={eventDetails.title}
                                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Date & Time</FormLabel>
                            <Input
                                type="datetime-local"
                                value={eventDetails.date}
                                onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Location</FormLabel>
                            <Input
                                value={eventDetails.location}
                                onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={() => setActiveModal(null)}>
                            Back
                        </Button>
                        <Button colorScheme="blue" onClick={() => handleSubmit('event')}>
                            Create Event
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Poll Modal */}
            <Modal isOpen={activeModal === 'poll'} onClose={() => setActiveModal(null)}>
                <ModalOverlay />
                <ModalContent bg={modalBg}>
                    <ModalHeader>Create Poll</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Poll Question</FormLabel>
                            <Input
                                value={poll.question}
                                onChange={(e) => setPoll({ ...poll, question: e.target.value })}
                            />
                        </FormControl>

                        <FormLabel>Options</FormLabel>
                        <Stack mb={4}>
                            {poll.options.map((option, index) => (
                                <Input
                                    key={index}
                                    value={option}
                                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                    mb={2}
                                    placeholder={`Option ${index + 1}`}
                                />
                            ))}
                            <Button leftIcon={<FiPlus />} onClick={addPollOption}>
                                Add Option
                            </Button>
                        </Stack>

                        <FormControl>
                            <FormLabel>Deadline</FormLabel>
                            <Input
                                type="datetime-local"
                                value={poll.deadline}
                                onChange={(e) => setPoll({ ...poll, deadline: e.target.value })}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={() => setActiveModal(null)}>
                            Back
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => handleSubmit('poll')}
                            isDisabled={poll.options.some(opt => !opt.trim())}
                        >
                            Create Poll
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const PostTypeButton = ({ icon, label, onClick }) => (
    <Button
        variant="outline"
        height="100px"
        flexDirection="column"
        onClick={onClick}
        _hover={{ bg: 'gray.50' }}
    >
        <Box fontSize="2xl" mb={2}>{icon}</Box>
        <Text fontSize="sm">{label}</Text>
    </Button>
);

export default CreatePost;