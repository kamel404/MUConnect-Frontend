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
          Transformative Learning Experiences
        </Heading>
      </VStack>
      
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={[4, 8]}>
        <TestimonialCard 
          name="Ahmed Ali" 
          role="Computer Science Senior" 
          text="The collaborative tools helped our team win the national hackathon!" 
          avatar={StudentAvatar1}
          rating={5}
        />
        <TestimonialCard 
          name="Sara Mohamed" 
          role="Engineering Graduate" 
          text="Found internship opportunities through the community network" 
          avatar={StudentAvatar2}
          rating={5}
        />
      </Grid>
    </Container>
  </Box>
);

export default Testimonials;