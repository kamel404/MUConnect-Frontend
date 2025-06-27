import { Box, Container, VStack, Text, Heading, Grid } from "@chakra-ui/react";
import { FiUsers, FiBookOpen, FiBell, FiCalendar, FiPieChart } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
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
          title="Peer Collaboration"
          description="Group discussions, file sharing, and real-time whiteboard sessions"
          color="blue" 
        />
        <FeatureCard 
          icon={FiBookOpen} 
          title="Course Resources"
          description="Organized lecture notes, past exams, and curated study guides"
          color="teal"
        />
        <FeatureCard 
          icon={FiBell} 
          title="Section Requests"
          description="Post your desired section swap and get matched with classmates instantly"
          color="purple"
        />
        <FeatureCard 
          icon={FaCalculator} 
          title="Grade Calculator"
          description="Estimate required scores and track your progress"
          color="orange" 
        />
        <FeatureCard 
          icon={FiCalendar} 
          title="Events & Deadlines"
          description="Stay updated with courses and campus activities"
          color="green" 
        />
        <FeatureCard 
          icon={FiPieChart} 
          title="Degree Planner"
          description="Visualize requirements and plan your academic journey"
          color="red" 
        />
      </Grid>
    </Container>
  </Box>
);

export default Features;