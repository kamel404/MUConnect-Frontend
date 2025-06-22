import { Box, Container, Grid } from "@chakra-ui/react";
import StatCard from "../ui/StatCard";

const Stats = () => (
  <Box bg="blue.900" color="white" py={[12, 20]}>
    <Container maxW="container.lg">
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={[4, 8]} textAlign="center">
        <StatCard number="15K+" label="Active Students" />
        <StatCard number="4.8/5" label="Avg. Rating" />
        <StatCard number="120" label="Daily Study Groups" />
        <StatCard number="25K+" label="Shared Resources" />
      </Grid>
    </Container>
  </Box>
);

export default Stats;