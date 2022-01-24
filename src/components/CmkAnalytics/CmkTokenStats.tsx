import {
  Box,
  BoxProps,
  Center,
  HStack,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import { useCmkAnalyticsData } from '~/hooks/useAnalyticsData';
import { shortenNumber } from '~/utils/formatTokenAmount';

import CmkMarketStats from './CmkMarketStats';
import HistoricalChart from './HistoricalChart';
import PieChart from './PieChart';

type TabKey = 'PRICE' | 'HOLDERS' | 'VOLUME';

export default function CmkTokenStats() {
  const cmkAnalytics = useCmkAnalyticsData();
  const [tabKey, setTabKey] = useState<TabKey>('PRICE');

  const tabChartProps = useMemo(() => {
    switch (tabKey) {
      case 'PRICE':
        return {
          title: 'CMK Price ($)',
          line: {
            name: 'CMK Price',
            // color: '#ff0000',
            data:
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.usdc_price),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => '$' + val.toFixed(2),
        };
      case 'HOLDERS':
        return {
          title: 'CMK Holders',
          line: {
            name: 'CMK Holders',
            // color: '#ff0000',
            data:
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.total_holders),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => val.toFixed(0),
        };
      case 'VOLUME':
        return {
          title: 'CMK 24H Volume',
          line: {
            name: 'CMK 24H Volume',
            // color: '#ff0000',
            data:
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.volume_24h) * Number(val.usdc_price),
              })) ?? [],
          },
          loading: false,
          formatValue: (val: any) => '$' + shortenNumber(val, 2),
        };
    }
  }, [cmkAnalytics.data, tabKey]);

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

  if (cmkAnalytics.loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack align="stretch" spacing="20">
      <Box>
        <Box borderBottom="1px" borderColor="purple.500" mx="4" my="8" px="4">
          <HStack spacing="1">
            <Box {...tabProps('PRICE')}>Price</Box>
            <Box {...tabProps('HOLDERS')}>Holders</Box>
            <Box {...tabProps('VOLUME')}>Volume</Box>
          </HStack>
        </Box>
        <HistoricalChart {...tabChartProps} />
      </Box>
      {cmkAnalytics.data && (
        <PieChart data={cmkAnalytics.data[cmkAnalytics.data.length - 1]} />
      )}
      <CmkMarketStats data={cmkAnalytics.data ?? []} />
    </VStack>
  );
}
