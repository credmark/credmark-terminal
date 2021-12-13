import {
  Box,
  BoxProps,
  CloseButton,
  Collapse,
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
import { useRouter } from 'next/router';
import React from 'react';
import { IoArrowForward } from 'react-icons/io5';

import GlobalStakeInfo from './GlobalStakeInfo';
import StakePanel from './StakePanel';
import UnstakePanel from './UnstakePanel';

export default function StakeBox(boxProps: BoxProps) {
  const router = useRouter();
  const isOpen = router.pathname === '/' && router.query.stake === 'true';

  function onOpen() {
    if (isOpen) return;
    router.push('/?stake=true');
  }

  function onClose(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    router.push('/');
  }

  return (
    <VStack
      flex="1"
      position="relative"
      px="8"
      py={isOpen ? 16 : 4}
      bg="white"
      shadow={isOpen ? 'xl' : 'lg'}
      rounded="3xl"
      spacing="4"
      cursor={isOpen ? undefined : 'pointer'}
      _hover={
        isOpen
          ? {}
          : {
              shadow: '2xl',
            }
      }
      _active={
        isOpen
          ? {}
          : {
              transform: 'scale(0.98)',
              shadow: 'md',
            }
      }
      transitionProperty="width,height,box-shadow"
      transitionDuration="normal"
      onClick={onOpen}
      align="stretch"
      {...boxProps}
    >
      {isOpen && (
        <CloseButton onClick={onClose} position="absolute" top="4" right="4" />
      )}
      <HStack spacing="4" justify="center">
        <Collapse in={isOpen}>
          <HStack spacing="4">
            <Img src="/img/cmk.png" h="72px" />
            <Icon as={IoArrowForward} boxSize={12} color="purple.500" />
          </HStack>
        </Collapse>
        <Img src="/img/xcmk.png" h="72px" />
      </HStack>
      <Collapse in={!isOpen}>
        <Text
          fontFamily="Credmark Regular"
          textAlign="center"
          bgGradient="linear(180deg, #DE1A60, #750963)"
          bgClip="text"
          lineHeight="1"
        >
          <Text as="span" fontSize="3xl" lineHeight="1.2">
            STAKE CMK
          </Text>
          <br />
          <Text as="span" fontSize="md">
            EARN REWARDS AND
          </Text>
          <br />
          <Text as="span" fontSize="md">
            ACCESS RISK TERMINAL
          </Text>
        </Text>
      </Collapse>
      <Collapse in={isOpen}>
        <VStack spacing="8" w="100%">
          <Text color="purple.500" textAlign="center" px="2">
            <strong>By staking, you convert CMK to xCMK.</strong>
            <br />
            xCMK gives staking rewards from the rewards pool, grants you access
            to the Risk Terminal, and allows for revenue sharing.
          </Text>
          <Box bg="gray.50" rounded="xl" p="8" w="100%">
            <Tabs variant="unstyled" colorScheme="gray">
              <TabList as={HStack} spacing="2" justifyContent="center">
                <Tab
                  _selected={{ color: 'gray.700' }}
                  _hover={{ color: 'gray.700', shadow: 'lg' }}
                  _active={{ color: 'purple.500' }}
                  fontWeight="bold"
                  color="gray.200"
                  bg="white"
                  py="1"
                  w="120px"
                  rounded="xl"
                  border="2px"
                  borderColor="gray.100"
                >
                  STAKE
                </Tab>
                <Tab
                  _selected={{ color: 'gray.700' }}
                  _hover={{ color: 'gray.700', shadow: 'lg' }}
                  _active={{ color: 'purple.500' }}
                  fontWeight="bold"
                  color="gray.200"
                  bg="white"
                  py="1"
                  w="120px"
                  rounded="xl"
                  border="2px"
                  borderColor="gray.100"
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
          </Box>
          <GlobalStakeInfo />
        </VStack>
      </Collapse>
    </VStack>
  );
}
