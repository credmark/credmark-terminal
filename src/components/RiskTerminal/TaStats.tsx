import { Box, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import type { useVarData } from '~/hooks/useTerminalData';
import { AssetKey, AssetStatsMap } from '~/types/terminal';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { ASSETS } from './constants';
import CurrentStats from './CurrentStats';
import HistoricalChart from './HistoricalChart';
import StatContainer from './StatContainer';

interface TaStatsProps {
  activeAssets: Array<AssetKey>;
  data: Record<AssetKey, ReturnType<typeof useVarData>>;
}

export default function TaStats({ activeAssets, data }: TaStatsProps) {
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
            value: Number(dp['total_assets']),
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
        totalAssets: dataPoints[0]['total_assets'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > latestStat.ts) {
          latestStat.totalAssets = dp['total_assets'];
          latestStat.ts = dp.ts;
        }
      }

      tls[asset.key] = [
        {
          key: 'Total Assets',
          value: `$${shortenNumber(latestStat.totalAssets, 1)}`,
          isPrimary: true,
        },
      ];
    }

    return tls;
  }, [activeAssets, data]);

  return (
    <>
      <StatContainer title="Total Assets">
        <Box>
          <Text textAlign="center" color="gray.600" fontSize="lg" mt="2" mb="4">
            Total Dollar value of tokens borrowed from the protocol
          </Text>
          <CurrentStats
            loading={Object.keys(currentStats).length === 0}
            activeAssets={activeAssets}
            stats={currentStats}
          />
        </Box>
      </StatContainer>
      <StatContainer title="Historic Total Assets">
        <HistoricalChart
          lines={chartLines}
          loading={!!Object.values(data).find(({ loading }) => loading)}
          formatValue={(val: number) => '$' + shortenNumber(val, 1)}
        />
      </StatContainer>
    </>
  );
}
