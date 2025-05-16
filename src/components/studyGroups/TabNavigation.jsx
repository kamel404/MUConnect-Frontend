import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex } from "@chakra-ui/react";

const TabNavigation = ({ activeTab, onTabChange, allTabContent, myTabContent, children }) => {
  return (
    <Tabs colorScheme="blue" mb={6} variant="soft-rounded" index={activeTab} onChange={onTabChange}>
      <Flex 
        justify="space-between" 
        align="center" 
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={4}
      >
        <TabList>
          <Tab>All Groups</Tab>
          <Tab>My Groups</Tab>
        </TabList>
        
        {children}
      </Flex>
      
      <TabPanels>
        <TabPanel px={0}>
          {allTabContent}
        </TabPanel>
        
        <TabPanel px={0}>
          {myTabContent}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabNavigation;
