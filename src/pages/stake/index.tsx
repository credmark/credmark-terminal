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

import { Card } from '~/components/base';
import {
  GlobalStakeInfo,
  StakePanel,
  UnstakePanel,
  WalletStatus,
  XCmkFaq,
} from '~/components/pages/Stake';
import SEOHeader from '~/components/shared/SEOHeader';

export default function StakePage() {
  return (
    <>
      <SEOHeader title="Stake" />
      <Container maxW="container.lg">
        <WalletStatus />
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
            <Icon as={MdArrowForward} boxSize="10" />
            <Img src="/img/xcmk.svg" h="72px" />
          </HStack>
          <VStack spacing="4" w="100%">
            <Text textAlign="center" px="2">
              <strong>By staking, you convert CMK to xCMK.</strong>
              <br />
              <br />
              xCMK gives staking rewards from the rewards pool,
              <br /> and allows for revenue sharing.
            </Text>
            <Box pb="8">
              <XCmkFaq />
            </Box>
            <Card py="8" px="16" minW={{ sm: undefined, md: 'container.sm' }}>
              <Tabs variant="solid-rounded" colorScheme="green">
                <TabList as={HStack} spacing="2" justifyContent="center">
                  <Tab
                    _selected={{
                      bg: 'green.500',
                      color: 'purple.800',
                      fontWeight: 700,
                    }}
                    _hover={{ shadow: 'lg' }}
                    // _active={{ color: 'green.500' }}
                    fontWeight="400"
                    bg="gray.100"
                    color="black"
                    w="120px"
                  >
                    STAKE
                  </Tab>
                  <Tab
                    _selected={{
                      bg: 'green.500',
                      color: 'purple.800',
                      fontWeight: 700,
                    }}
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
            </Card>
            <GlobalStakeInfo />
          </VStack>
        </VStack>
      </Container>
    </>
  );
}
