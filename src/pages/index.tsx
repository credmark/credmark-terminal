import { Box, Container, Stack, VStack } from '@chakra-ui/react';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DataThresholdingOutlinedIcon from '@mui/icons-material/DataThresholdingOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import React from 'react';

import { Card } from '~/components/base';
import { MdDecentralizedIcon } from '~/components/icons';
import { FeatureCard } from '~/components/pages/Landing';
import SEOHeader from '~/components/shared/SEOHeader';

export default function HomePage() {
  return (
    <>
      <SEOHeader
        title="Credmark Terminal - Actionable DeFi Data"
        titleTemplate=""
      />
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
                    icon: InsightsOutlinedIcon,
                    text: 'Visualized crypto analytics',
                  },
                  {
                    icon: AnalyticsOutlinedIcon,
                    text: 'Market data & risk metrics for various protocols',
                  },
                  {
                    icon: HistoryOutlinedIcon,
                    text: 'Historic data up to 90 days',
                  },
                  {
                    icon: FileDownloadOutlinedIcon,
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
                  icon: DataThresholdingOutlinedIcon,
                  text: 'Fine-tuned data aggregation and nomination for 1st, 2nd and 3rd order Data',
                },
                {
                  icon: HistoryOutlinedIcon,
                  text: 'Completed historical data',
                },
                {
                  icon: QueryStatsOutlinedIcon,
                  text: 'Direct query of output from risk models',
                },
              ]}
              actionButton={{
                href: '/api-keys',
                label: 'Get Access',
                icon: ApiOutlinedIcon,
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
                  icon: HistoryOutlinedIcon,
                  text: 'Complete real-time and historical data',
                },
                {
                  icon: BoltOutlinedIcon,
                  text: 'Model search engine with example scripts to start immediately',
                },
              ]}
              actionButton={{
                href: 'https://github.com/credmark/credmark-models-py',
                isExternal: true,
                label: 'Get Access',
                icon: CodeOutlinedIcon,
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
                  icon: QueryStatsOutlinedIcon,
                  text: 'Perform quality assessment and curation of new models',
                },
                {
                  icon: VerifiedOutlinedIcon,
                  text: 'Vote on new model submissions for implementation',
                },
                {
                  icon: AttachMoneyOutlinedIcon,
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
