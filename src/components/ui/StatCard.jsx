import { Box, Text } from "@chakra-ui/react";

const StatCard = ({ number, label }) => (
  <Box>
    <Text fontSize={["3xl", "5xl"]} fontWeight="black" mb={2}>{number}</Text>
    <Text color="blue.200" fontWeight="medium" fontSize={["sm", "md"]}>{label}</Text>
  </Box>
);

export default StatCard;