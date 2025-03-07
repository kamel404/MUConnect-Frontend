import { VStack, Heading, Text } from "@chakra-ui/react";

const FooterColumn = ({ title, items }) => (
  <VStack align={["center", "start"]} spacing={3}>
    <Heading size="sm" mb={2}>{title}</Heading>
    {items.map((item) => (
      <Text key={item} fontSize="sm" _hover={{ color: 'blue.300' }}>
        {item}
      </Text>
    ))}
  </VStack>
);

export default FooterColumn;