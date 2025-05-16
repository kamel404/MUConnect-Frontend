import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Flex,
  Stack,
  Tag,
  HStack,
  Button,
  Divider,
  useColorModeValue
} from "@chakra-ui/react";
import { FiUsers, FiClock, FiMapPin, FiArrowRight, FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const StudyGroupCard = ({ group, onJoinLeave }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  return (
    <MotionCard
      bg={cardBg}
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md" color={textColor}>{group.name}</Heading>
          <Tag colorScheme="blue">{group.course}</Tag>
        </Flex>
      </CardHeader>
      
      <CardBody>
        <Text color={textColor} mb={3} noOfLines={2}>
          {group.description}
        </Text>
        
        <HStack spacing={2} mb={4} flexWrap="wrap">
          {group.tags.map((tag, index) => (
            <Tag key={index} size="sm" colorScheme="gray" borderRadius="full">
              {tag}
            </Tag>
          ))}
        </HStack>
        
        <Divider my={4} borderColor={dividerColor} />
        
        <Stack spacing={3}>
          <Flex align="center" color={mutedText}>
            <FiUsers style={{ marginRight: "8px" }} />
            <Text>{group.members} / {group.capacity} Members</Text>
          </Flex>
          <Flex align="center" color={mutedText}>
            <FiClock style={{ marginRight: "8px" }} />
            <Text>Meetings: {group.meetings.join(", ")}</Text>
          </Flex>
          <Flex align="center" color={mutedText}>
            <FiMapPin style={{ marginRight: "8px" }} />
            <Text noOfLines={1}>{group.location}</Text>
          </Flex>
        </Stack>
      </CardBody>
      
      <CardFooter 
        pt={0}
        borderTop="1px solid"
        borderColor={dividerColor}
      >
        <Flex justify="space-between" align="center" w="full">
          <Button
            as={Link}
            to={`/study-groups/${group.id}`}
            rightIcon={<FiArrowRight />}
            variant="ghost"
            size="sm"
            borderRadius="full"
            _hover={{ bg: hoverBg }}
          >
            View Details
          </Button>
          
          <Button 
            colorScheme={group.isJoined ? "red" : "blue"}
            variant={group.isJoined ? "outline" : "solid"}
            size="sm"
            borderRadius="full"
            onClick={() => onJoinLeave(group.id)}
            leftIcon={group.isJoined ? undefined : <FiPlus />}
          >
            {group.isJoined ? "Leave Group" : "Join Group"}
          </Button>
        </Flex>
      </CardFooter>
    </MotionCard>
  );
};

export default StudyGroupCard;
