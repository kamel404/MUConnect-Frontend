import { Box, Container, VStack, Text, Heading, Grid } from "@chakra-ui/react";
import TestimonialCard from "../ui/TestimonialCard";
import StudentAvatar1 from "../../assets/maaref-logo.png";
import StudentAvatar2 from "../../assets/maaref-logo.png";

const Testimonials = () => (
  <Box bg="blue.50" py={[12, 20]}>
    <Container maxW="container.lg">
      <VStack spacing={3} mb={[8, 12]}>
        <Text color="blue.500" fontWeight="bold" fontSize={["sm", "md"]}>SUCCESS STORIES</Text>
        <Heading textAlign="center" size={["xl", "2xl"]} color="blue.900">
          Stories from Our Community
        </Heading>
      </VStack>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={[4, 8]}>
        <TestimonialCard 
          name="Ali Ghoul" 
          role="Mechanical Engineering Student" 
          text="Found past exams and study notes that saved me hours of preparation. The quiz questions were exactly what I needed!" 
          avatar={StudentAvatar1}
          rating={5}
        />
        <TestimonialCard 
          name="Mahdi Alayan" 
          role="Computer Science Student" 
          text="Posted a section swap request at 10 PM and had 3 matches by morning. Saved my entire semester schedule!" 
          avatar={StudentAvatar2}
          rating={5}
        />
      </Grid>
    </Container>
  </Box>
);

export default Testimonials;