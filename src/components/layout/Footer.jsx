import { Box, Container, Grid, VStack, Flex, Image, Heading, Text, Icon } from "@chakra-ui/react";
import { FiTwitter, FiFacebook, FiInstagram } from "react-icons/fi";
import FooterColumn from "../ui/FooterColumn";
import MaarefLogo from "../../assets/maaref-logo.png";

const Footer = () => (
  <Box bg="blue.900" color="white" py={[8, 12]}>
    <Container maxW="container.lg">
      <Grid 
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} 
        gap={[8, 8]} 
        pb={[4, 8]}
        textAlign={["center", "left"]}
      >
        <VStack align={["center", "start"]} spacing={4}>
          <Flex align="center" gap={2} direction={["column", "row"]}>
            <Image src={MaarefLogo} boxSize="40px" />
            <Heading size="md">MU Connect</Heading>
          </Flex>
          <Text opacity={0.9} fontSize="sm">Connecting every learner at Maaraf University</Text>
          <Flex gap={4} mt={4}>
            <Icon as={FiTwitter} boxSize={5} />
            <Icon as={FiFacebook} boxSize={5} />
            <Icon as={FiInstagram} boxSize={5} />
          </Flex>
        </VStack>
        
        <FooterColumn 
          title="Product" 
          items={['Overview', 'Features', 'Pricing', 'Roadmap']} 
        />
        <FooterColumn 
          title="Support" 
          items={['Help Center', 'Contact Us', 'Status', 'Feedback']} 
        />
        <FooterColumn 
          title="Legal" 
          items={['Terms', 'Privacy', 'Cookies', 'Accessibility']} 
        />
      </Grid>
      
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