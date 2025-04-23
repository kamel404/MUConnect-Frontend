import {
  Box,
  Heading,
  Text,
  Card,
  Stack,
  Switch,
  Flex,
  Button,
  Divider,
  useColorMode,
  useColorModeValue,
  IconButton,
  Select,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  HStack,
  Tooltip
} from "@chakra-ui/react";
import { 
  FiSun, 
  FiMoon, 
  FiArrowLeft, 
  FiBell, 
  FiGlobe, 
  FiLock, 
  FiMail, 
  FiSliders 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const settingsBg = useColorModeValue("gray.50", "gray.750");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box py={4} px={{ base: 4, md: 0 }}>
      <Card bg={cardBg} mb={6} borderRadius="xl" overflow="hidden">
        <Box px={6} py={4} borderBottom="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={4}>
              <IconButton
                icon={<FiArrowLeft />}
                aria-label="Go back"
                onClick={handleGoBack}
                variant="ghost"
                size="md"
                _hover={{ bg: `${accentColor}20` }}
              />
              <Heading size="lg" color={textColor}>Settings</Heading>
            </Flex>
          </Flex>
        </Box>
        
        <Box p={6}>
          <Stack spacing={8}>
            {/* Appearance Settings */}
            <Box>
              <Heading size="md" mb={4} color={textColor}>
                Appearance
              </Heading>
              <Card p={5} bg={settingsBg} borderRadius="xl">
                <Stack spacing={6}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        {colorMode === "light" ? (
                          <FiSun size={20} color={accentColor} />
                        ) : (
                          <FiMoon size={20} color={accentColor} />
                        )}
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Dark Mode
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          {colorMode === "light" 
                            ? "Switch to dark theme" 
                            : "Switch to light theme"}
                        </Text>
                      </Box>
                    </Flex>
                    <Switch
                      isChecked={colorMode === "dark"}
                      onChange={toggleColorMode}
                      colorScheme="blue"
                      size="lg"
                    />
                  </Flex>
                  
                  <Divider borderColor={borderColor} />
                  
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        <FiSliders size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Text Size
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Adjust the size of text
                        </Text>
                      </Box>
                    </Flex>
                    <Select maxW="140px" size="sm" defaultValue="medium">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </Select>
                  </Flex>
                </Stack>
              </Card>
            </Box>
            
            {/* Notifications Settings */}
            <Box>
              <Heading size="md" mb={4} color={textColor}>
                Notifications
              </Heading>
              <Card p={5} bg={settingsBg} borderRadius="xl">
                <Stack spacing={6}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        <FiBell size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Push Notifications
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Receive push notifications
                        </Text>
                      </Box>
                    </Flex>
                    <Switch defaultChecked colorScheme="blue" size="lg" />
                  </Flex>
                  
                  <Divider borderColor={borderColor} />
                  
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        <FiMail size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Email Notifications
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Receive email updates
                        </Text>
                      </Box>
                    </Flex>
                    <Switch defaultChecked colorScheme="blue" size="lg" />
                  </Flex>
                </Stack>
              </Card>
            </Box>
            
            {/* Privacy Settings */}
            <Box>
              <Heading size="md" mb={4} color={textColor}>
                Privacy
              </Heading>
              <Card p={5} bg={settingsBg} borderRadius="xl">
                <Stack spacing={6}>
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        <FiGlobe size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Profile Visibility
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Control who can see your profile
                        </Text>
                      </Box>
                    </Flex>
                    <RadioGroup defaultValue="public">
                      <HStack spacing={5}>
                        <Radio value="public" colorScheme="blue">Public</Radio>
                        <Radio value="private" colorScheme="blue">Private</Radio>
                      </HStack>
                    </RadioGroup>
                  </Flex>
                  
                  <Divider borderColor={borderColor} />
                  
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        boxSize={10}
                        borderRadius="md"
                        bg={colorMode === "light" ? "gray.100" : "gray.600"}
                      >
                        <FiLock size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="medium" color={textColor}>
                          Two-Factor Authentication
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          Add an extra layer of security
                        </Text>
                      </Box>
                    </Flex>
                    <Switch colorScheme="blue" size="lg" />
                  </Flex>
                </Stack>
              </Card>
            </Box>
            
            {/* Account Actions */}
            <Flex gap={4} mt={4} justify="flex-end">
              <Button 
                colorScheme="blue" 
                size="md" 
                _hover={{ bg: 'blue.500', boxShadow: `0 0 0 3px ${accentColor}40` }}
              >
                Save Changes
              </Button>
            </Flex>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default Settings;
