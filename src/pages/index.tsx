import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { MdAnalytics, MdHistory, MdLock, MdQueryStats } from 'react-icons/md';

import CodeTerminal from '~/components/ApiPortal/CodeTerminal';
import FeatureBox from '~/components/ApiPortal/FeatureBox';
import {
  CmkLogoIcon,
  MdDiamondIcon,
  MdRocketLaunchIcon,
} from '~/components/Icons';

export default function HomePage() {
  return (
    <VStack spacing="8" pb="20">
      <Box w="full" bg="white" p={'5'} roundedBottomLeft="sm" shadow="md">
        <Stack direction="row" spacing="8">
          <Text fontSize="2xl" fontWeight="thin">
            Your Credmark Membership NFT
          </Text>
          <Button colorScheme="purple" variant="outline">
            Coming Soon...
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
              Earn &amp; boost staking rewards for your CMK
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

      <Container maxW="container.lg">
        <Flex>
          <Box py="8" zIndex="1">
            <FeatureBox
              maxW="360px"
              title="API Gateway"
              subtitle="High Integrity Risk and Data Models"
              features={[
                {
                  icon: MdAnalytics,
                  text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
                },
                {
                  icon: MdHistory,
                  text: 'Completed historical data',
                },
                {
                  icon: MdQueryStats,
                  text: 'Direct query of output  from risk models',
                },
              ]}
              actionButton={{
                href: '/api-access/tiers',
                label: 'Get Access',
                icon: MdLock,
              }}
            />
          </Box>
          <Box
            zIndex="0"
            ml="-40"
            flex="1"
            bgImg="/img/terminal-graph.svg"
            bgPosition="bottom"
            bgSize="cover"
            bgColor="white"
            shadow="md"
          ></Box>
        </Flex>
      </Container>

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

        <FeatureBox
          w="360px"
          ml="-40"
          title="API Gateway"
          subtitle="High Integrity Risk and Data Models"
          features={[
            {
              icon: MdAnalytics,
              text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
            },
            {
              icon: MdHistory,
              text: 'Completed historical data',
            },
            {
              icon: MdQueryStats,
              text: 'Direct query of output  from risk models',
            },
          ]}
          actionButton={{
            href: '/api-access/tiers',
            label: 'Get Access',
            icon: MdLock,
          }}
        />
      </Flex>

      <Container maxW="container.lg">
        <Stack direction={{ base: 'column', md: 'row' }} spacing="8">
          <FeatureBox
            flex="1"
            title="API Gateway"
            subtitle="High Integrity Risk and Data Models"
            features={[
              {
                icon: MdAnalytics,
                text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
              },
              {
                icon: MdHistory,
                text: 'Completed historical data',
              },
              {
                icon: MdQueryStats,
                text: 'Direct query of output  from risk models',
              },
            ]}
            actionButton={{
              href: '/api-access/tiers',
              label: 'Get Access',
              icon: MdLock,
            }}
          />
          <FeatureBox
            flex="1"
            title="API Gateway"
            subtitle="High Integrity Risk and Data Models"
            features={[
              {
                icon: MdAnalytics,
                text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
              },
              {
                icon: MdHistory,
                text: 'Completed historical data',
              },
              {
                icon: MdQueryStats,
                text: 'Direct query of output  from risk models',
              },
            ]}
            actionButton={{
              href: '/api-access/tiers',
              label: 'Get Access',
              icon: MdLock,
            }}
          />
        </Stack>
      </Container>
    </VStack>
  );
}
