import { Box, Container, Grid } from "@chakra-ui/react";
import StatCard from "../ui/StatCard";

const Stats = () => (
  <Box bg="blue.900" color="white" py={[12, 20]}>
    <Container maxW="container.lg">
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={[4, 8]} textAlign="center">
        <StatCard number="25K+" label="Study Resources Shared" />
        <StatCard number="500+" label="Section Swaps Completed" />
        <StatCard number="120+" label="Active Study Groups" />
        <StatCard number="15K+" label="Students Connected" />
      </Grid>
    </Container>
  </Box>
);

export default Stats;