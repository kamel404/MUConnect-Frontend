import {
  Stack,
  Text,
  Flex,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCalendar, FiMapPin } from "react-icons/fi";

const EventPost = ({ post }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Stack spacing={4}>
      <Text fontWeight="600" color={textColor}>
        {post?.content || "No content"}
      </Text>
      <Flex direction="column" gap={2}>
        {post?.event && (
          <>
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} color="purple.500" />
              <Text fontSize="sm">
                {post.formattedDate || "Date TBD"}{" "}
                {post.formattedTime ? `at ${post.formattedTime}` : ""}
              </Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Icon as={FiMapPin} color="purple.500" />
              <Text fontSize="sm">{post.event.location || "Location TBD"}</Text>
            </Flex>
          </>
        )}
        {post?.date && !post.event && (
          <>
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} color="purple.500" />
              <Text fontSize="sm">
                {post.date} {post.time || ""}
              </Text>
            </Flex>
            {post.location && (
              <Flex align="center" gap={2}>
                <Icon as={FiMapPin} color="purple.500" />
                <Text fontSize="sm">{post.location}</Text>
              </Flex>
            )}
          </>
        )}
      </Flex>
      <Button colorScheme="purple" width="fit-content">
        RSVP Now
      </Button>
    </Stack>
  );
};

export default EventPost;
