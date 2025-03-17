import { Card, CardBody, Stack, Text, Flex, Icon, Button, useColorModeValue } from "@chakra-ui/react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";

const EventPost = ({ post }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Card bg={cardBg} borderLeft="4px" borderColor="purple.500">
      <PostHeader post={post} />
      <CardBody>
        <Stack spacing={4}>
          <Text fontWeight="600" color={textColor}>
            {post.content}
          </Text>
          <Flex direction="column" gap={2}>
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} color="purple.500" />
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
            <Flex align="center" gap={2}>
              <Icon as={FiMapPin} color="purple.500" />
              <Text fontSize="sm">{post.location}</Text>
            </Flex>
          </Flex>
          <Button colorScheme="purple" width="fit-content">
            RSVP Now
          </Button>
        </Stack>
      </CardBody>
      <PostActions post={post} />
    </Card>
  );
};

export default EventPost;
