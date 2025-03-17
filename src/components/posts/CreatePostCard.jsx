import React from 'react';
import { Card, CardBody, Flex, Avatar, Input, useColorModeValue, useBreakpointValue } from "@chakra-ui/react";

const CreatePostCard = ({ onClick, avatarUrl = "https://bit.ly/dan-abramov" }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Card mb={6} bg={cardBg} cursor="pointer" onClick={onClick}>
      <CardBody>
        <Flex gap={4} direction={isMobile ? "column" : "row"} align="center">
          <Avatar size="md" src={avatarUrl} />
          <Input
            placeholder="What's on your mind?"
            isReadOnly
            _placeholder={{ color: mutedText }}
            cursor="pointer"
          />
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CreatePostCard;
