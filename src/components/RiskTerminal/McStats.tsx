import { Box, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { useLcrData } from '~/hooks/useTerminalData';
import { AssetKey, AssetStatsMap } from '~/types/terminal';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { ASSETS } from './constants';
import CurrentStats from './CurrentStats';
import HistoricalChart from './HistoricalChart';
import StatContainer from './StatContainer';

interface McStatsProps {
  activeAssets: Array<AssetKey>;
  data: Record<AssetKey, ReturnType<typeof useLcrData>>;
}

export default function TlStats({ activeAssets, data }: McStatsProps) {
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
      if (data[asset.key].loading) continue;

      const dataPoints = data[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      lines.push({
        name: asset.title,
        color: asset.color.toString(),
        data: dataPoints
          .map((dp) => ({
            timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
            value: Number(dp['market_cap']),
          }))
          .reverse(),
      });
    }

    return lines;
  }, [activeAssets, data]);

  const currentStats = useMemo(() => {
    const tls: AssetStatsMap = {};

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (data[asset.key].loading) continue;

      const dataPoints = data[asset.key].data;
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
        {
          key: 'Market Cap',
          value: `$${shortenNumber(latestStat.marketCap ?? 0, 1)}`,
          isPrimary: true,
        },
      ];
    }

    return tls;
  }, [activeAssets, data]);

  return (
    <>
      <StatContainer title="Market Cap">
        <Box>
          <Text textAlign="center" color="gray.600" fontSize="lg" mt="2" mb="4">
            Current market capitalization of the protocol&apos;s native token
          </Text>
          <CurrentStats
            loading={Object.keys(currentStats).length === 0}
            activeAssets={activeAssets}
            stats={currentStats}
          />
        </Box>
      </StatContainer>
      <StatContainer title="Historic Market Cap">
        <HistoricalChart
          lines={chartLines}
          loading={!!Object.values(data).find(({ loading }) => loading)}
          formatValue={(val: number) => '$' + shortenNumber(val, 1)}
        />
      </StatContainer>
    </>
  );
}
