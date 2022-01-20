import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Center,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { CmkAnalyticsDataPoint } from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

import HistoricalChart from './HistoricalChart';

interface MarketInfo {
  app: 'uniswap_v3' | 'sushiswap';
  address: string;
  label: string;
}

const MARKETS: MarketInfo[] = [
  {
    app: 'uniswap_v3',
    address: '0xf7a716e2df2bde4d0ba7656c131b06b1af68513c',
    label: 'Uniswap -> CMK/USDC',
  },
  {
    app: 'uniswap_v3',
    address: '0x59e1f901b5c33ff6fae15b61684ebf17cca7b9b3',
    label: 'Uniswap -> CMK/ETH',
  },
  {
    app: 'sushiswap',
    address: '0x3349217670f9aa55c5640a2b3d806654d27d0569',
    label: 'Sushiswap -> CMK/WETH',
  },
  {
    app: 'sushiswap',
    address: '0xb7b42c9145435ef2432620af3bf82b7734704c75',
    label: 'Sushiswap -> CMK/USDC',
  },
];

interface CmkMarketStatsProps {
  data: CmkAnalyticsDataPoint[];
}

export default function CmkMarketStats({ data }: CmkMarketStatsProps) {
  function getMarketLink(market: MarketInfo) {
    if (market.app === 'sushiswap') {
      return `https://analytics.sushi.com/pairs/${market.address}`;
    } else if (market.app === 'uniswap_v3') {
      return `https://info.uniswap.org/#/pools/${market.address}`;
    }
  }

  return (
    <Box>
      <Center mb="8">
        <Text
          textAlign="center"
          fontSize="xl"
          bg="purple.500"
          color="white"
          px="4"
          rounded="md"
        >
          CMK Markets
        </Text>
      </Center>
      <Accordion allowMultiple>
        {MARKETS.map((m) => (
          <AccordionItem key={m.address}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {m.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pt={10} pb={20}>
              <Link href={getMarketLink(m)} isExternal>
                <Button
                  mb="8"
                  colorScheme="purple"
                  variant="outline"
                  rightIcon={<Icon as={FaExternalLinkAlt} />}
                >
                  View on {m.app}
                </Button>
              </Link>
              <HistoricalChart
                title={m.label + ' 24H Volume'}
                line={{
                  name: m.label + ' 24H Volume',
                  // color: '#ff0000',
                  data:
                    data.map((val) => ({
                      timestamp: new Date(val.ts * 1000),
                      value:
                        Number(
                          val.markets.find(
                            (vm) =>
                              vm.address.toLowerCase() ===
                              m.address.toLowerCase(),
                          )?.volume_24h ?? '0',
                        ) * Number(val.usdc_price),
                    })) ?? [],
                }}
                loading={false}
                formatValue={(val) => '$' + shortenNumber(val, 0)}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
