import { Card, Box, Flex, Avatar, Input, Text } from "@chakra-ui/react";

const ResourcePostInput = ({ openPostModal, cardBg, borderColor, accentColor, mutedText }) => (
  <Card mb={6} bg={cardBg} cursor="pointer" onClick={openPostModal} border="2px solid" borderColor={accentColor} shadow="md">
    <Box p={{ base: 4, md: 6 }}>
      <Flex gap={4} direction={{ base: "column", md: "row" }} align="center">
        <Avatar size="md" src="https://bit.ly/dan-abramov" />
        <Input
          placeholder="Upload a document, share a quiz, or post a student-related question..."
          isReadOnly
          _placeholder={{ color: mutedText, fontWeight: 500 }}
          cursor="pointer"
          borderColor={borderColor}
          _hover={{ borderColor: accentColor }}
        />
      </Flex>
      <Text fontSize="xs" color={mutedText} mt={2} ml={{ md: 16 }}>
        Note that posts are under professional and academic environment.
      </Text>
    </Box>
  </Card>
);

export default ResourcePostInput;
