import { VStack, HStack, Img, Text, Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';
import { shortenNumber } from '~/utils/formatTokenAmount';

import CmkMarketStats from './CmkMarketStats';
import HistoricalChart from './HistoricalChart';
import PieChart from './PieChart';

export default function CmkAnalytics() {
  const cmkAnalytics = useCmkAnalyticsData();
  const stakedCmkAnalytics = useStakedCmkAnalyticsData();

  return (
    <VStack align="stretch" mt="-56px" spacing="20">
      <HStack
        // zIndex={disabled ? 3 : undefined}
        alignSelf="center"
        px="6"
        pt="2"
        pb="1"
        bg="white"
        shadow="lg"
        rounded="lg"
        mb="8"
        spacing="4"
      >
        <Img src="/img/cmk.svg" h="72px" mt="-20px" />
        <Text
          fontFamily="Credmark Regular"
          textAlign="center"
          bgGradient="linear(135deg, #08538C, #3B0065)"
          bgClip="text"
          lineHeight="1.2"
          fontSize="4xl"
          px="1"
        >
          Analytics
        </Text>
      </HStack>
      {cmkAnalytics.loading || stakedCmkAnalytics.loading ? (
        <Center>
          <Spinner></Spinner>
        </Center>
      ) : (
        <>
          <HistoricalChart
            title="CMK Price ($)"
            line={{
              name: 'CMK Price',
              // color: '#ff0000',
              data:
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.usdc_price),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => '$' + val.toFixed(2)}
          />
          <HistoricalChart
            title="CMK Holders"
            line={{
              name: 'CMK Holders',
              // color: '#ff0000',
              data:
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.total_holders),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => val.toFixed(0)}
          />
          <HistoricalChart
            title="CMK 24H Volume"
            line={{
              name: 'CMK 24H Volume',
              // color: '#ff0000',
              data:
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.volume_24h) * Number(val.usdc_price),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => '$' + shortenNumber(val, 2)}
          />
          {cmkAnalytics.data && (
            <PieChart data={cmkAnalytics.data[cmkAnalytics.data.length - 1]} />
          )}
          <CmkMarketStats data={cmkAnalytics.data ?? []} />
          <HistoricalChart
            title="Total Staked CMK"
            line={{
              name: 'Total staked CMK',
              // color: '#ff0000',
              data:
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.amount_staked_usdc),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => '$' + shortenNumber(val, 2)}
          />
          <HistoricalChart
            title="Total Staked CMK Wallets"
            line={{
              name: 'Total staked CMK Wallets',
              // color: '#ff0000',
              data:
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.total_holders),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => val.toFixed(0)}
          />
          <HistoricalChart
            title="Avg CMK Staked"
            line={{
              name: 'Avg CMK Staked',
              // color: '#ff0000',
              data:
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value:
                    Number(val.amount_staked_usdc) / Number(val.total_holders),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => '$' + shortenNumber(val, 2)}
          />
          <HistoricalChart
            title="xCMK APR"
            line={{
              name: 'xCMK APR',
              // color: '#ff0000',
              data:
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.staking_apr_percent),
                })) ?? [],
            }}
            loading={false}
            formatValue={(val) => val.toFixed(2) + '%'}
          />
        </>
      )}
    </VStack>
  );
}
