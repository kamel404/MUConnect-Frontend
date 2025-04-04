import {
  Stack,
  Text,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCalendar, FiUsers } from "react-icons/fi";

const StudyGroupPost = ({ post }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Stack spacing={4}>
      <Text fontWeight="600" color={textColor}>
        {post?.content || "No content"}
      </Text>
      <Flex align="center" gap={2}>
        <Icon as={FiCalendar} color="blue.500" />
        <Text fontSize="sm">
          {post.formattedDate || "Date not specified"}
          {post.formattedTime ? ` at ${post.formattedTime}` : ""}
        </Text>
      </Flex>
      <Badge width="fit-content" colorScheme="blue" px={2} py={1}>
        <Flex align="center" gap={2}>
          <FiUsers /> {post?.members || 0} Members
        </Flex>
      </Badge>
    </Stack>
  );
};

export default StudyGroupPost;
