import { Card, Box, Heading, Text, CloseButton } from "@chakra-ui/react";

const HeroSection = ({ onClose }) => (
  <Card mb={8} bgGradient="linear(to-r, brand.navy, brand.gold)" color="white" borderRadius="2xl" shadow="lg" position="relative">
    <CloseButton
      position="absolute"
      top={2}
      right={2}
      size="lg"
      color="white"
      onClick={onClose}
      _hover={{ bg: 'whiteAlpha.300' }}
      aria-label="Close hero section"
    />
    <Box p={{ base: 6, md: 10 }} textAlign="center">
      <Heading size="xl" mb={3} letterSpacing="tight">
        Al Maaref University Resource & Student Affairs Hub
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} mb={2}>
        Share lecture notes, past exams, quizzes, official announcements, and solve student issues. Keep posts academic and professional.
      </Text>
      <Text fontSize="sm" opacity={0.85}>
        This platform is <b>not</b> for social or unrelated content. Posts are reviewed to maintain a professional and academic environment.
      </Text>
    </Box>
  </Card>
);

export default HeroSection;
