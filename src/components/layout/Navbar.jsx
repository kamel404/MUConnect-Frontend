import { Flex, Image, Heading, Button, Stack } from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { useBreakpointValue } from "@chakra-ui/react";
import MaarefLogo from "../../assets/maaref-logo.png";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="nav"
      bg="white"
      boxShadow="sm"
      p={[3, 4]}
      justify="space-between"
      align="center"
      px={[4, 8]}
      position="sticky"
      top="0"
      zIndex="banner"
    >
      <Flex align="center" gap={[2, 3]}>
        <Image src={MaarefLogo} boxSize={["35px", "45px"]} borderRadius="md" />
        <Heading size={["md", "lg"]} bgGradient="linear(to-r, blue.600, blue.400)" bgClip="text">
          MU Hub
        </Heading>
      </Flex>
      
      {isMobile ? (
        <Button variant="outline" colorScheme="blue" size="sm">Menu</Button>
      ) : (
        <Stack direction="row" spacing={[4, 8]} align="center">
          <Button variant="ghost" colorScheme="blue" fontSize={["sm", "md"]}>About</Button>
          <Button variant="ghost" colorScheme="blue" fontSize={["sm", "md"]}>Features</Button>
          <Button colorScheme="blue" size={["sm", "md"]} rightIcon={<FiUsers />}>
            Join Community
          </Button>
        </Stack>
      )}
    </Flex>
  );
};

export default Navbar;