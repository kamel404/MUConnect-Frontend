import { Box, Container, VStack, Text, Heading, Flex, Avatar, Icon, useColorModeValue } from "@chakra-ui/react";
import { FiCode, FiHeart } from "react-icons/fi";

const Testimonials = () => {
  const bgColor = "gray.50";
  const cardBg = "white";
  const textColor = "gray.700";
  const accentColor = "blue.500";

  return (
    <Box bg="gray.50" py={[16, 24]} position="relative">
      {/* Subtle decorative elements */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        width="150px"
        height="150px"
        borderRadius="full"
        bg="blue.50"
        opacity={0.5}
      />
      <Box
        position="absolute"
        bottom="15%"
        left="8%"
        width="120px"
        height="120px"
        borderRadius="full"
        bg="purple.50"
        opacity={0.5}
      />

      <Container maxW="container.md" position="relative" zIndex={1}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={3}>
            <Text color={accentColor} fontWeight="semibold" fontSize={["sm", "md"]} letterSpacing="wide">
              A MESSAGE FROM THE CREATOR
            </Text>
            <Heading textAlign="center" size={["xl", "2xl"]} color="gray.800" fontWeight="800">
              Built with Purpose
            </Heading>
          </VStack>

          {/* Message Card */}
          <Box
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="2xl"
            p={[6, 10]}
            w="full"
            transform="translateY(0)"
            transition="all 0.3s"
            _hover={{ transform: "translateY(-5px)", boxShadow: "3xl" }}
          >
            <Flex direction={{ base: "column", md: "row" }} align="center" gap={6}>
              {/* Avatar Section */}
              <VStack spacing={3} flexShrink={0}>
                <Avatar
                  size="2xl"
                  name="Kamel Faour"
                  src="https://cdn.mu-connect.me/avatars/default.png"
                  border="4px solid"
                  borderColor={accentColor}
                  boxShadow="lg"
                />
                <VStack spacing={0}>
                  <Text fontWeight="bold" fontSize="lg" color={textColor}>
                    Kamel Faour
                  </Text>
                  <Flex align="center" gap={1} mt={1}>
                    <Icon as={FiCode} boxSize={3} color={accentColor} />
                    <Text fontSize="xs" color={textColor}>
                      Maaref University Graduate
                    </Text>
                  </Flex>
                </VStack>
              </VStack>

              {/* Message Section */}
              <VStack align="start" spacing={4} flex={1}>
                <Text fontSize={["md", "lg"]} color={textColor} lineHeight="tall" fontStyle="italic">
                  "MU Connect was born from a simple observation: students needed a better way to collaborate,
                  share knowledge, and support each other. What started as a capstone project has grown into
                  a platform that brings our university community closer together."
                </Text>

                <Box
                  w="full"
                  h="1px"
                  bg="gray.200"
                  my={2}
                />
              </VStack>
            </Flex>
          </Box>

          {/* Bottom tagline */}
          <Text color={textColor} fontSize={["sm", "md"]} textAlign="center" maxW="600px" fontWeight="medium">
            Thank you for being part of this journey. Together, we're building a stronger, more connected university.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Testimonials;