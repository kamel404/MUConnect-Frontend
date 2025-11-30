import { Box, Container, VStack, Text, Heading, Grid } from "@chakra-ui/react";
import { FiUsers, FiBookOpen, FiBell, FiCalendar, FiCpu } from "react-icons/fi";
import { FaCalculator } from "react-icons/fa";
import FeatureCard from "../ui/FeatureCard";

const Features = () => (
  <Box py={[12, 20]} bg="white">
    <Container maxW="container.lg">
      <VStack spacing={3} mb={[8, 12]}>
        <Text color="blue.500" fontWeight="bold" fontSize={["sm", "md"]}>WHAT YOU GET</Text>
        <Heading textAlign="center" size={["xl", "2xl"]} color="blue.900" maxW="2xl">
          Solve Your Biggest Student Challenges
        </Heading>
        <Text textAlign="center" fontSize={["md", "lg"]} color="gray.600" maxW="3xl">
          From finding study materials to swapping sections, MU Connect has everything you need in one place.
        </Text>
      </VStack>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={[4, 8]}>
        <FeatureCard 
          icon={FiBookOpen} 
          title="Study Resources"
          description="Access lecture notes, past exams, and student-shared materials for all your courses"
          color="blue" 
        />
        <FeatureCard 
          icon={FiBell} 
          title="Section Swapping"
          description="Stuck with a bad schedule? Post a section swap request and find matches instantly"
          color="purple"
        />
        <FeatureCard 
          icon={FiUsers} 
          title="Study Groups"
          description="Find study partners, join group discussions, and collaborate on assignments"
          color="teal" 
        />
        <FeatureCard 
          icon={FaCalculator} 
          title="Grade Calculator"
          description="Calculate what you need to score on finals and track your semester progress"
          color="orange" 
        />
        <FeatureCard 
          icon={FiCpu} 
          title="AI Study Tools"
          description="Generate instant summaries and practice quizzes from your study materials to boost your learning"
          color="red" 
        />
        <FeatureCard 
          icon={FiCalendar} 
          title="Campus Events"
          description="Discover club activities, academic events, and never miss important deadlines"
          color="green" 
        />
      </Grid>
    </Container>
  </Box>
);

export default Features;