import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
    Badge,
    Grid,
    Avatar,
    Input,
    InputGroup,
    InputLeftElement,
    Tag,
    IconButton,
    Divider,
    CardFooter
  } from "@chakra-ui/react";
  import { FiSearch, FiPlus, FiUsers, FiClock, FiMessageSquare, FiArrowLeft } from "react-icons/fi";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  
  const StudyGroupsPage = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentColor = useColorModeValue("blue.500", "blue.300");
  
    // Sample study groups data
    const [groups, setGroups] = useState([
      {
        id: 1,
        name: "Digital Logic Study Group",
        course: "CS 301",
        members: 12,
        active: "2h ago",
        description: "Weekly problem solving sessions for Computer Architecture",
        meetings: ["Mon 3 PM", "Wed 3 PM"]
      },
      {
        id: 2,
        name: "Linear Algebra Masters",
        course: "MATH 202",
        members: 8,
        active: "5h ago",
        description: "Collaborative learning group for matrix operations",
        meetings: ["Tue 10 AM", "Thu 10 AM"]
      }
    ]);
  
    return (
      <Flex minH="100vh" p={8} bg={useColorModeValue("gray.50", "gray.800")}>
        
        <Box maxW="container.lg" mx="auto" w="full">
          <Flex justify="space-between" align="center" mb={8}>
          <Flex align="center" gap={4}>
          <IconButton
                icon={<FiArrowLeft />}
                aria-label="Go back"
                onClick={() => navigate(-1)}
                variant="ghost"
                title="Go back" 
            />
            <Heading size="xl" color={textColor}>Study Groups</Heading>
          </Flex>
            <Button leftIcon={<FiPlus />} colorScheme="blue">
              Create New Group
            </Button>
          </Flex>
  
          <InputGroup mb={8}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color={mutedText} />
            </InputLeftElement>
            <Input placeholder="Search study groups..." />
          </InputGroup>
  
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {groups.map(group => (
              <Card key={group.id} bg={cardBg}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md" color={textColor}>{group.name}</Heading>
                    <Tag colorScheme="blue">{group.course}</Tag>
                  </Flex>
                </CardHeader>
                
                <CardBody>
                  <Text color={textColor}>{group.description}</Text>
                  
                  <Divider my={4} />
                  
                  <Stack spacing={3}>
                    <Flex align="center" color={mutedText}>
                      <FiUsers style={{ marginRight: "8px" }} />
                      <Text>{group.members} Members</Text>
                    </Flex>
                    <Flex align="center" color={mutedText}>
                      <FiClock style={{ marginRight: "8px" }} />
                      <Text>Regular Meetings: {group.meetings.join(", ")}</Text>
                    </Flex>
                    <Flex align="center" color={mutedText}>
                      <FiMessageSquare style={{ marginRight: "8px" }} />
                      <Text>Last active {group.active}</Text>
                    </Flex>
                  </Stack>
                </CardBody>
  
                <CardFooter>
                  <Flex justify="space-between" w="full">
                    <Button variant="outline" leftIcon={<FiUsers />}>
                      View Members
                    </Button>
                    <Button colorScheme="blue">
                      Join Group
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Box>
      </Flex>
    );
  };
  
  export default StudyGroupsPage;