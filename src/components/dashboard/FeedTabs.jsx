import { Box, Flex } from "@chakra-ui/react";

const FeedTabs = ({ primaryColor, accentColor, highlightBg, mutedText }) => (
  <Box mb={6}>
    <Flex gap={2}>
      <Box
        as="button"
        px={4}
        py={2}
        bg={primaryColor}
        color="white"
        borderRadius="full"
        fontWeight="bold"
        shadow="sm"
        _hover={{ bg: accentColor, color: primaryColor }}
      >
        Resources & Documents
      </Box>
      <Box
        as="button"
        px={4}
        py={2}
        bg={highlightBg}
        color={primaryColor}
        borderRadius="full"
        fontWeight="medium"
        shadow="sm"
        _hover={{ bg: accentColor, color: primaryColor }}
      >
        Student Affairs
      </Box>
      <Box
        as="button"
        px={4}
        py={2}
        bg="transparent"
        color={mutedText}
        borderRadius="full"
        fontWeight="medium"
        _hover={{ bg: highlightBg, color: primaryColor }}
      >
        All Posts
      </Box>
    </Flex>
  </Box>
);

export default FeedTabs;
