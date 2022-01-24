import {
  Box,
  BoxProps,
  Center,
  HStack,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import { useStakedCmkAnalyticsData } from '~/hooks/useAnalyticsData';
import { shortenNumber } from '~/utils/formatTokenAmount';

import HistoricalChart from './HistoricalChart';

type TabKey = 'AMOUNT' | 'WALLET' | 'AVERAGE' | 'APR';

export default function StakingStats() {
  const stakedCmkAnalytics = useStakedCmkAnalyticsData();

  const [tabKey, setTabKey] = useState<TabKey>('AMOUNT');

  const tabChartProps = useMemo(() => {
    switch (tabKey) {
      case 'AMOUNT':
        return {
          title: 'Total Staked CMK',
          line: {
            name: 'Total staked CMK',
            // color: '#ff0000',
            data:
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.amount_staked_usdc),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => '$' + shortenNumber(val, 2),
        };
      case 'WALLET':
        return {
          title: 'Total Staked CMK Wallets',
          line: {
            name: 'Total staked CMK Wallets',
            // color: '#ff0000',
            data:
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.total_holders),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => val.toFixed(0),
        };
      case 'AVERAGE':
        return {
          title: 'Avg CMK Staked',
          line: {
            name: 'Avg CMK Staked',
            // color: '#ff0000',
            data:
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value:
                  Number(val.amount_staked_usdc) / Number(val.total_holders),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => '$' + shortenNumber(val, 2),
        };
      case 'APR':
        return {
          title: 'xCMK APR',
          line: {
            name: 'xCMK APR',
            // color: '#ff0000',
            data:
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.staking_apr_percent),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => val.toFixed(2) + '%',
        };
    }
  }, [stakedCmkAnalytics.data, tabKey]);

  function tabProps(tab: TabKey) {
    const props: BoxProps = {
      px: 4,
      py: 1,
      roundedTop: 'md',
      cursor: 'pointer',
      transitionDuration: 'normal',
      transitionProperty: 'common',
      onClick: () => setTabKey(tab),
    };

    if (tabKey === tab) {
      props.bg = 'purple.500';
      props.color = 'white';
    } else {
      props._hover = {
        color: 'purple.500',
        bg: 'purple.50',
      };
    }

    return props;
  }

  if (stakedCmkAnalytics.loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack align="stretch">
      <Box borderBottom="1px" borderColor="purple.500" mx="4" my="8" px="4">
        <HStack spacing="1">
          <Box {...tabProps('AMOUNT')}>Staked Amount</Box>
          <Box {...tabProps('WALLET')}>Wallets</Box>
          <Box {...tabProps('AVERAGE')}>Average Staked</Box>
          <Box {...tabProps('APR')}>APR</Box>
        </HStack>
      </Box>
      <HistoricalChart {...tabChartProps} />
    </VStack>
  );
}
