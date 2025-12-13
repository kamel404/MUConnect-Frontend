import { Box, Container, VStack, Flex, Image, Heading, Text, Icon } from "@chakra-ui/react";
import { FiTwitter, FiFacebook, FiInstagram } from "react-icons/fi";
import MaarefLogo from "../../assets/maaref-logo.png";

const Footer = () => (
  <Box bg="blue.900" color="white" py={[8, 12]}>
    <Container maxW="container.lg">
      <VStack spacing={6} pb={[4, 8]}>
        <VStack align="center" spacing={4}>
          <Flex align="center" gap={2} direction={["column", "row"]}>
            <Image src={MaarefLogo} boxSize="40px" />
            <Heading size="md">MU Connect</Heading>
          </Flex>
          <Text opacity={0.9} fontSize="sm">Connecting every learner at Maaraf University</Text>
        </VStack>
      </VStack>
      
      <Text 
        textAlign="center" 
        pt={[4, 8]} 
        borderTop="1px" 
        borderColor="blue.700" 
        opacity={0.8}
        fontSize="sm"
      >
        © 2025 MU Connect
      </Text>
    </Container>
  </Box>
);

export default Footer;