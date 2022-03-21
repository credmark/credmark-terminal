import { HStack, Text, VStack, Box, Button, Img } from '@chakra-ui/react';
import React from 'react';

import Carousel from '~/components/ApiPortal/Carousel/ChartsCarousel';

import CodeTerminal from './CodeTerminal';

const sections = [
  {
    id: 0,
    icon: 'earn.svg',
    text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
  },
  {
    id: 1,
    icon: 'clock.svg',
    text: 'Completed historical data',
  },
  {
    id: 2,
    icon: 'direct.svg',
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
        icon: 'analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: 'circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: 'clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: 'download.svg',
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
        icon: 'analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: 'circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: 'clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: 'download.svg',
      },
    ],
    isAccess: false,
    isBackground: false,
  },
  {
    title: 'Risk Terminal',
    description: 'Advanced Insights into Defi Data',
    lists: [
      {
        text: 'Visualize Insights into Defi Data',
        icon: 'analytics.svg',
      },
      {
        text: 'Market data & risk metrics for various Products',
        icon: 'circle_rise.svg',
      },
      {
        text: 'Historic data upto 90 days',
        icon: 'clock.svg',
      },
      {
        text: 'Export data to CSV',
        icon: 'download.svg',
      },
    ],
    isAccess: false,
    isBackground: false,
  },
];

export default function Home() {
  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <VStack bg={'#f8f8f9'} width="100%">
        <Box
          w="full"
          bg="white"
          color="black"
          borderWidth="1px"
          borderRadius="lg"
          p={'5'}
        >
          <HStack>
            <Text fontSize="24" mr={4}>
              Your Credmark Membership NFT
            </Text>
            <Button
              size={'md'}
              colorScheme="white"
              style={{ color: '#3B0065' }}
              variant="outline"
            >
              Mint Your NFT
            </Button>
          </HStack>
          <HStack pt={3}>
            <HStack mr="20px">
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
            <HStack>
              <Img src="/img/apiPortal/diamond.svg" h="24px" />
              <Text fontSize="14" fontWeight={'400'}>
                Get your personal access NFT
              </Text>
            </HStack>
          </HStack>
        </Box>
      </VStack>
      <VStack p={5} pos={'relative'}>
        <Box
          bg="black"
          w={{ base: '100%', md: '35rem' }}
          borderRadius="5"
          color="white"
        >
          <CodeTerminal speed={100} />
        </Box>

        <Box
          boxShadow="xl"
          rounded="md"
          bg="white"
          m={4}
          w={{ base: '100%', md: '20rem' }}
          pt={5}
          top={{ md: '4rem' }}
          right={{ md: '-150px' }}
          pos={{ sm: 'relative', md: 'absolute', lg: 'absolute' }}
          className="card-position"
        >
          <VStack p={'5'} pt={0} alignItems={'flex-start'}>
            <VStack alignItems={'flex-start'}>
              <Text fontSize={'xl'} fontWeight={'bold'} m={0} p={0}>
                API Gateway
              </Text>
              <Text
                color="gray.500"
                fontSize={'small'}
                isTruncated
                style={{ marginTop: '2px' }}
              >
                High Integrity Risk and Data Models
              </Text>
              {sections.map((section) => {
                return (
                  <HStack key={section.id} spacing="10px">
                    <Img src={'/img/apiPortal/' + section.icon} />
                    <Text fontSize={13}>{section.text}</Text>
                  </HStack>
                );
              })}
            </VStack>

            <VStack>
              <Button
                mt={'5'}
                color={'#fff'}
                backgroundColor={'#de1a60'}
                variant="solid"
              >
                Get Access
              </Button>
            </VStack>
          </VStack>
        </Box>
      </VStack>
      <Carousel item={items} />
    </VStack>
  );
}
