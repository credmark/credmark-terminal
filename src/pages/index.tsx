import {
  HStack,
  Text,
  VStack,
  Box,
  Button,
  Img,
  Stack,
  Flex,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import Carousel from '~/components/ApiPortal/Carousel';
import CodeTerminal from '~/components/ApiPortal/CodeTerminal';

const sections = [
  {
    id: 0,
    icon: '/img/apiPortal/earn.svg',
    text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
  },
  {
    id: 1,
    icon: '/img/apiPortal/clock.svg',
    text: 'Completed historical data',
  },
  {
    id: 2,
    icon: '/img/apiPortal/direct.svg',
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
        icon: '/img/apiPortal/analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: '/img/apiPortal/circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: '/img/apiPortal/clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: '/img/apiPortal/download.svg',
      },
    ],
    isAccess: true,
    isBackground: true,
  },

  {
    title: 'Model Development',
    description: 'Advanced Insights into Defi Data',
    lists: [
      {
        text: 'Visualize Insights into Defi Data',
        icon: '/img/apiPortal/analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: '/img/apiPortal/circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: '/img/apiPortal/clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: '/img/apiPortal/download.svg',
      },
    ],
    isAccess: false,
    isBackground: false,
  },
  {
    title: 'Model Validation',
    description: 'Advanced Insights into Defi Data',
    lists: [
      {
        text: 'Visualize Insights into Defi Data',
        icon: '/img/apiPortal/analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: '/img/apiPortal/circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: '/img/apiPortal/clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: '/img/apiPortal/download.svg',
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
            <Img src="/img/apiPortal/credmark.svg" h="24px" />
            <Text fontSize="14" fontWeight={'400'}>
              Access the Credmark ecosystem in a unique way
            </Text>
          </HStack>
          <HStack>
            <Img src="/img/apiPortal/rocket.svg" h="24px" />
            <Text fontSize="14" fontWeight={'400'}>
              Earn & boost staking rewards for your CMK
            </Text>
          </HStack>
          <HStack mb="4">
            <Img src="/img/apiPortal/diamond.svg" h="24px" />
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
          <VStack my="8" align="stretch">
            {sections.map((section) => {
              return (
                <HStack key={section.id} spacing="2">
                  <Img src={section.icon} />
                  <Text fontSize="sm" lineHeight="1.1">
                    {section.text}
                  </Text>
                </HStack>
              );
            })}
          </VStack>

          <NextLink href="/api-access/tiers" passHref>
            <Link _hover={{ textDecoration: 'none' }}>
              <Button colorScheme="pink">
                <Img src="/img/apiPortal/white_lock.svg" mr="1" />
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
