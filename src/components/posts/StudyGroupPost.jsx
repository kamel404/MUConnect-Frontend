import { Card, CardBody, Stack, Text, Flex, Icon, Badge, useColorModeValue } from "@chakra-ui/react";
import { FiCalendar, FiUsers } from "react-icons/fi";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";

const StudyGroupPost = ({ post }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Card bg={cardBg} borderLeft="4px" borderColor="blue.500">
      <PostHeader post={post} />
      <CardBody>
        <Stack spacing={4}>
          <Text fontWeight="600" color={textColor}>
            {post.content}
          </Text>
          <Flex align="center" gap={2}>
            <Icon as={FiCalendar} color="blue.500" />
            <Text fontSize="sm">
              {new Date(post.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </Flex>
          <Badge width="fit-content" colorScheme="blue" px={2} py={1}>
            <Flex align="center" gap={2}>
              <FiUsers /> {post.members} Members
            </Flex>
          </Badge>
        </Stack>
      </CardBody>
      <PostActions post={post} />
    </Card>
  );
};

export default StudyGroupPost;
