import { Box, Container, Stack, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  MdApi,
  MdAttachMoney,
  MdBolt,
  MdCode,
  MdHistory,
  MdInsights,
  MdOutlineAnalytics,
  MdOutlineDataExploration,
  MdOutlineFileDownload,
  MdOutlineVerified,
  MdQueryStats,
} from 'react-icons/md';

import { Card } from '~/components/base';
import { MdDecentralizedIcon } from '~/components/icons';
import { FeatureCard } from '~/components/pages/Landing';
import SEOHeader from '~/components/shared/SEOHeader';

export default function HomePage() {
  return (
    <>
      <SEOHeader title="App" />
      <VStack spacing="20" py="20">
        <Container maxW="container.lg">
          <Box position="relative">
            <Card
              position="absolute"
              top="0"
              right="0"
              bottom="0"
              w="80%"
              flex="1"
              bgImg="/img/terminal-graph.svg"
              bgPosition="bottom"
              bgSize="cover"
              shadow="md"
            />
            <Box py="8" position="relative">
              <FeatureCard
                maxW="360px"
                title="Credmark Terminal"
                subtitle="Visualize DeFi Analytics with Intuitive Graphs"
                features={[
                  {
                    icon: MdInsights,
                    text: 'Visualized crypto analytics',
                  },
                  {
                    icon: MdOutlineDataExploration,
                    text: 'Market data & risk metrics for various protocols',
                  },
                  {
                    icon: MdHistory,
                    text: 'Historic data up to 90 days',
                  },
                  {
                    icon: MdOutlineFileDownload,
                    text: 'Export data to CSV',
                  },
                ]}
                actionButton={{
                  href: '/terminal/dex/uniswap-v2',
                  label: 'View Terminal',
                }}
              />
            </Box>
          </Box>
        </Container>

        <Container maxW="container.xl">
          <Stack direction={{ base: 'column', lg: 'row' }} spacing="8">
            <FeatureCard
              w={{ base: '360px', md: '480px', lg: 'auto' }}
              alignSelf={{ base: 'center', lg: 'stretch' }}
              flex="1"
              title="API Gateway"
              subtitle="High Integrity Risk and Data Models"
              features={[
                {
                  icon: MdOutlineAnalytics,
                  text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
                },
                {
                  icon: MdHistory,
                  text: 'Completed historical data',
                },
                {
                  icon: MdQueryStats,
                  text: 'Direct query of output from risk models',
                },
              ]}
              actionButton={{
                href: 'https://gateway.credmark.com/api',
                isExternal: true,
                label: 'Get Access',
                icon: MdApi,
              }}
            />
            <FeatureCard
              w={{ base: '360px', md: '480px', lg: 'auto' }}
              alignSelf={{ base: 'center', lg: 'stretch' }}
              flex="1"
              title="Model Framework"
              subtitle="Rapid Prototyping and Deployment"
              features={[
                {
                  icon: MdDecentralizedIcon,
                  text: 'Abstracts away the complexity of web3 coding',
                },
                {
                  icon: MdHistory,
                  text: 'Complete real-time and historical data',
                },
                {
                  icon: MdBolt,
                  text: 'Model search engine with example scripts to start immediately',
                },
              ]}
              actionButton={{
                href: 'https://github.com/credmark/credmark-models-py',
                isExternal: true,
                label: 'Get Access',
                icon: MdCode,
              }}
            />
            <FeatureCard
              w={{ base: '360px', md: '480px', lg: 'auto' }}
              alignSelf={{ base: 'center', lg: 'stretch' }}
              flex="1"
              title="Model Validation"
              subtitle="Earn Rewards for Model Assessment"
              features={[
                {
                  icon: MdQueryStats,
                  text: 'Perform quality assessment and curation of new models',
                },
                {
                  icon: MdOutlineVerified,
                  text: 'Vote on new model submissions for implementation',
                },
                {
                  icon: MdAttachMoney,
                  text: 'Be rewarded to do the work of validating models',
                },
              ]}
              actionButton={{
                label: 'Coming Soon...',
                isDisabled: true,
              }}
            />
          </Stack>
        </Container>
      </VStack>
    </>
  );
}
