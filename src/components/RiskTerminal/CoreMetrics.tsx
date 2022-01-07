import { Box, BoxProps, HStack } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';

import type { useLcrData, useVarData } from '~/hooks/useTerminalData';
import {
  AssetKey,
  AssetStatsMap,
  LcrDataPoint,
  VarDataPoint,
} from '~/types/terminal';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { ASSETS } from './constants';
import CurrentStats from './helpers/CurrentStats';
import HistoricalChart from './helpers/HistoricalChart';
import StatContainer from './helpers/StatContainer';

interface CoreMetricsProps {
  activeAssets: Array<AssetKey>;
  lcrData: Record<AssetKey, ReturnType<typeof useLcrData>>;
  varData: Record<AssetKey, ReturnType<typeof useVarData>>;
}

type MetricKey = 'TA' | 'TL' | 'MC';

export default function CoreMetrics({
  activeAssets,
  lcrData,
  varData,
}: CoreMetricsProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('TL');

  const chartLines = useMemo(() => {
    const lines: Array<{
      name: string;
      color: string;
      data: Array<{
        timestamp: Date;
        value: number;
      }>;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      const data = activeMetric === 'MC' ? lcrData : varData;
      if (data[asset.key].loading) {
        continue;
      }

      const dataPoints = data[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      let lineData: Array<{
        timestamp: Date;
        value: number;
      }> = [];

      switch (activeMetric) {
        case 'MC': // Market Cap
          lineData = (dataPoints as LcrDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value: Number(dp['market_cap']),
            }))
            .reverse();
          break;
        case 'TA': // Total Assets
          lineData = (dataPoints as VarDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value: Number(dp['total_assets']),
            }))
            .reverse();
          break;
        case 'TL': // Total Liabilities
          lineData = (dataPoints as VarDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value: Number(dp['total_liabilities']),
            }))
            .reverse();
          break;
      }

      lines.push({
        name: `${asset.title} - ${
          { MC: 'Market Cap', TA: 'Total Assets', TL: 'Total Liabilities' }[
            activeMetric
          ]
        }`,
        color: asset.color.toString(),
        data: lineData,
      });
    }

    return lines;
  }, [activeAssets, activeMetric, lcrData, varData]);

  const currentStats = useMemo(() => {
    const tls: AssetStatsMap = {};

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (varData[asset.key].loading) continue;

      const dataPoints = varData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const latestStat = {
        name: asset.title,
        totalAssets: dataPoints[0]['total_assets'],
        totalLiabilities: dataPoints[0]['total_liabilities'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > latestStat.ts) {
          latestStat.totalAssets = dp['total_assets'];
          latestStat.totalLiabilities = dp['total_liabilities'];
          latestStat.ts = dp.ts;
        }
      }

      tls[asset.key] = [
        ...(tls[asset.key] ?? []),
        {
          key: 'Total Liabilities',
          value: `$${shortenNumber(latestStat.totalLiabilities, 1)}`,
          tooltip: 'Total Dollar value of tokens deposited into the protocol.',
        },
        {
          key: 'Total Assets',
          value: `$${shortenNumber(latestStat.totalAssets, 1)}`,
          tooltip: 'Total Dollar value of tokens borrowed from the protocol.',
        },
      ];
    }

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (lcrData[asset.key].loading) continue;

      const dataPoints = lcrData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const latestStat = {
        name: asset.title,
        marketCap: dataPoints[0]['market_cap'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > latestStat.ts) {
          latestStat.marketCap = dp['market_cap'];
          latestStat.ts = dp.ts;
        }
      }

      tls[asset.key] = [
        ...(tls[asset.key] ?? []),
        {
          key: 'Market Cap',
          value: `$${shortenNumber(latestStat.marketCap ?? 0, 1)}`,
          tooltip:
            "Current market capitalization of the protocol's native token.",
        },
      ];
    }

    return tls;
  }, [activeAssets, lcrData, varData]);

  function tabProps(metric: MetricKey) {
    const props: BoxProps = {
      px: 4,
      py: 1,
      roundedTop: 'md',
      cursor: 'pointer',
      transitionDuration: 'normal',
      transitionProperty: 'common',
      onClick: () => setActiveMetric(metric),
    };

    if (activeMetric === metric) {
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

  return (
    <>
      <StatContainer title="Core Metrics">
        <Box>
          <CurrentStats
            loading={Object.keys(currentStats).length === 0}
            activeAssets={activeAssets}
            stats={currentStats}
          />
        </Box>
      </StatContainer>
      <StatContainer title="Historic Core Metrics">
        <Box borderBottom="1px" borderColor="purple.500" mx="4" my="8" px="4">
          <HStack spacing="1">
            <Box {...tabProps('TL')}>Total Liabilities</Box>
            <Box {...tabProps('TA')}>Total Assets</Box>
            <Box {...tabProps('MC')}>Market Cap</Box>
          </HStack>
        </Box>
        <HistoricalChart
          lines={chartLines}
          loading={
            !!Object.values(lcrData).find(({ loading }) => loading) ||
            !!Object.values(varData).find(({ loading }) => loading)
          }
          formatValue={(val: number) => '$' + shortenNumber(val, 1)}
        />
      </StatContainer>
    </>
  );
}
