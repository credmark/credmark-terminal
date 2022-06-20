import {
  Box,
  Container,
  HStack,
  Icon,
  Img,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import MdArrowForward from '@mui/icons-material/ArrowForward';
import React from 'react';

import { BorderedCard } from '~/components/base';
import {
  StakePanel,
  UnstakePanel,
  GlobalStakeInfo,
  XCmkFaq,
} from '~/components/pages/Stake';

export default function StakePage() {
  return (
    <Container maxW="container.lg">
      <VStack
        h="100%"
        position="relative"
        px="8"
        py="16"
        spacing="4"
        align="stretch"
      >
        <HStack spacing="4" justify="center">
          <Img src="/img/cmk.svg" h="72px" />
          <Icon as={MdArrowForward} boxSize="10" color="purple.500" />
          <Img src="/img/xcmk.svg" h="72px" />
        </HStack>
        <VStack spacing="4" w="100%">
          <Text color="purple.500" textAlign="center" px="2">
            <strong>By staking, you convert CMK to xCMK.</strong>
            <br />
            <br />
            xCMK gives staking rewards from the rewards pool,
            <br /> and allows for revenue sharing.
          </Text>
          <Box pb="8">
            <XCmkFaq />
          </Box>
          <BorderedCard
            py="8"
            px="16"
            minW={{ sm: undefined, md: 'container.sm' }}
          >
            <Tabs variant="solid-rounded" colorScheme="green">
              <TabList as={HStack} spacing="2" justifyContent="center">
                <Tab
                  _selected={{ bg: 'green.500', color: 'purple.500' }}
                  _hover={{ shadow: 'lg' }}
                  // _active={{ color: 'purple.500' }}
                  fontWeight="400"
                  bg="gray.100"
                  color="black"
                  w="120px"
                >
                  STAKE
                </Tab>
                <Tab
                  _selected={{ bg: 'green.500', color: 'purple.500' }}
                  _hover={{ shadow: 'lg' }}
                  fontWeight="400"
                  bg="gray.100"
                  color="black"
                  w="120px"
                >
                  UNSTAKE
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <StakePanel />
                </TabPanel>
                <TabPanel>
                  <UnstakePanel />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </BorderedCard>
          <GlobalStakeInfo />
        </VStack>
      </VStack>
    </Container>
  );
}
