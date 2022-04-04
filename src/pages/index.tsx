import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  MdAnalytics,
  MdAutoAwesome,
  MdBolt,
  MdDeviceHub,
  MdFileDownload,
  MdHistory,
  MdInsights,
  MdLock,
  MdOutlineDataExploration,
  MdQueryStats,
} from 'react-icons/md';

import Carousel from '~/components/ApiPortal/Carousel';
import CodeTerminal from '~/components/ApiPortal/CodeTerminal';
import {
  CmkLogoIcon,
  MdDiamondIcon,
  MdRocketLaunchIcon,
} from '~/components/Icons';

const SECTIONS = [
  {
    id: 0,
    icon: MdAnalytics,
    text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
  },
  {
    id: 1,
    icon: MdHistory,
    text: 'Completed historical data',
  },
  {
    id: 2,
    icon: MdQueryStats,
    text: 'Direct query of output  from risk models',
  },
];

const items = [
  {
    title: 'Risk Terminal',
    description: 'Advanced Insights into Defi Data',
    lists: [
      {
        text: 'Visualize Insights into Defi Data',
        icon: MdInsights,
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: MdOutlineDataExploration,
      },
      {
        text: 'Historic data upto 90 days',
        icon: MdHistory,
      },
      {
        text: 'Export data to CSV',
        icon: MdFileDownload,
      },
    ],
    isAccess: true,
    isBackground: true,
  },
  {
    title: 'Model Development',
    description: 'Lorem ipsum dolor sit amet',
    lists: [
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipis',
        icon: MdBolt,
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        icon: MdRocketLaunchIcon,
      },
      {
        text: 'Lorem ipsum dolor sit amet',
        icon: MdAutoAwesome,
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur',
        icon: MdDeviceHub,
      },
    ],
    isAccess: false,
    isBackground: false,
  },
  {
    title: 'Model Validation',
    description: 'Lorem ipsum dolor sit amet',
    lists: [
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipis',
        icon: MdBolt,
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        icon: MdRocketLaunchIcon,
      },
      {
        text: 'Lorem ipsum dolor sit amet',
        icon: MdAutoAwesome,
      },
      {
        text: 'Lorem ipsum dolor sit amet, consectetur',
        icon: MdDeviceHub,
      },
    ],
    isAccess: false,
    isBackground: false,
  },
];

export default function HomePage() {
  return (
    <VStack spacing="8">
      <Box w="full" bg="white" p={'5'} roundedBottomLeft="sm" shadow="md">
        <Stack direction="row" spacing="8">
          <Text fontSize="2xl" fontWeight="thin">
            Your Credmark Membership NFT
          </Text>
          <Button colorScheme="purple" variant="outline">
            Mint Your NFT
          </Button>
        </Stack>

        <HStack align="center" mt={4} spacing="8">
          <HStack>
            <CmkLogoIcon color="purple.500" boxSize="5" />
            <Text fontSize="sm">
              Access the Credmark ecosystem in a unique way
            </Text>
          </HStack>
          <HStack>
            <MdRocketLaunchIcon color="purple.500" boxSize="5" />
            <Text fontSize="14" fontWeight={'400'}>
              Earn & boost staking rewards for your CMK
            </Text>
          </HStack>
          <HStack mb="4">
            <MdDiamondIcon color="purple.500" boxSize="5" />
            <Text fontSize="14" fontWeight={'400'}>
              Get your personal access NFT
            </Text>
          </HStack>
        </HStack>
      </Box>

      <Flex p={8} pos={'relative'}>
        <Box
          bg="black"
          w={{ base: '100%', md: '50rem' }}
          borderRadius="5"
          color="white"
          px="8"
        >
          <CodeTerminal speed={100} />
        </Box>

        <Box
          shadow="xl"
          rounded="sm"
          bg="white"
          w="360px"
          ml="-40"
          alignSelf="center"
          px="6"
          py="8"
        >
          <Text fontSize={'xl'} fontWeight={'bold'}>
            API Gateway
          </Text>
          <Text color="gray.700" fontWeight={300}>
            High Integrity Risk and Data Models
          </Text>
          <VStack my="8" align="stretch" spacing="3">
            {SECTIONS.map((section) => {
              return (
                <HStack key={section.id} spacing="3">
                  <Icon as={section.icon} boxSize="6" color="purple.500" />
                  <Text fontSize="sm" lineHeight="1.1">
                    {section.text}
                  </Text>
                </HStack>
              );
            })}
          </VStack>

          <NextLink href="/api-access/tiers" passHref>
            <Link _hover={{ textDecoration: 'none' }}>
              <Button colorScheme="pink" leftIcon={<Icon as={MdLock} />}>
                Get Access
              </Button>
            </Link>
          </NextLink>
        </Box>
      </Flex>
      <Box w="full">
        <Carousel items={items} />
      </Box>
    </VStack>
  );
}
