import { Box, Icon, Link, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import type { useLcrData } from '~/hooks/useTerminalData';
import { AssetKey, AssetStatsMap } from '~/types/terminal';

import { ASSETS, GRAPHS } from './constants';
import CurrentStats from './CurrentStats';
import HistoricalChart from './HistoricalChart';
import StatContainer from './StatContainer';

interface LcrStatsProps {
  activeAssets: Array<AssetKey>;
  data: Record<AssetKey, ReturnType<typeof useLcrData>>;
}

export default function LcrStats({ activeAssets, data }: LcrStatsProps) {
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
            value: dp.lcr * 100,
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
        lcr: dataPoints[0]['lcr'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > latestStat.ts) {
          latestStat.lcr = dp['lcr'];
          latestStat.ts = dp.ts;
        }
      }

      tls[asset.key] = [
        {
          key: 'LCR',
          value: `${(latestStat.lcr * 100).toFixed(1)}%`,
          isPrimary: true,
        },
      ];
    }

    return tls;
  }, [activeAssets, data]);

  return (
    <>
      <StatContainer
        title="LCR (LIQUIDITY COVERAGE RATIO)"
        helpText={
          <Text>
            {GRAPHS.find((g) => g.key === 'LCR')?.description} <br />
            <br />
            <Link
              href="https://docs.credmark.com/credmark-risk-library/risk-metrics/liquidity-coverage-ratio-lcr"
              isExternal
              textDecoration="underline"
              pb="1"
            >
              Read more about LCR in our Risk Library{' '}
              <Icon as={FaExternalLinkAlt} />
            </Link>
          </Text>
        }
      >
        <Box>
          <Text textAlign="center" color="gray.600" fontSize="lg" mt="2" mb="4">
            Latest LCR
          </Text>
        </Box>
        <CurrentStats
          loading={Object.keys(currentStats).length === 0}
          activeAssets={activeAssets}
          stats={currentStats}
        />
      </StatContainer>
      <StatContainer title="Historic LCR">
        <HistoricalChart
          lines={chartLines}
          loading={!!Object.values(data).find(({ loading }) => loading)}
          formatValue={(val: number) => val.toFixed(1) + '%'}
        />
      </StatContainer>
    </>
  );
}
