import { Box, Container, VStack, Text, Heading, Grid } from "@chakra-ui/react";
import { FiUsers, FiBookOpen, FiBell } from "react-icons/fi";
import FeatureCard from "../ui/FeatureCard";

const Features = () => (
  <Box py={[12, 20]} bg="white">
    <Container maxW="container.lg">
      <VStack spacing={3} mb={[8, 12]}>
        <Text color="blue.500" fontWeight="bold" fontSize={["sm", "md"]}>CORE FEATURES</Text>
        <Heading textAlign="center" size={["xl", "2xl"]} color="blue.900" maxW="2xl">
          Everything You Need for Academic Success
        </Heading>
      </VStack>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={[4, 8]}>
        <FeatureCard 
          icon={FiUsers} 
          title="Smart Collaboration"
          description="Virtual study rooms with real-time document editing and video conferencing"
          color="blue" 
        />
        <FeatureCard 
          icon={FiBookOpen} 
          title="Knowledge Base"
          description="AI-powered search across 10,000+ academic resources and past papers"
          color="teal"
        />
        <FeatureCard 
          icon={FiBell} 
          title="Smart Alerts"
          description="ML-driven deadline predictions and personalized reminders"
          color="purple"
        />
      </Grid>
    </Container>
  </Box>
);

export default Features;