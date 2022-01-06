import { Box, Icon, Link, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import type { useVarData } from '~/hooks/useTerminalData';
import { AssetKey, AssetStatsMap } from '~/types/terminal';

import { ASSETS, GRAPHS } from './constants';
import CurrentStats from './CurrentStats';
import HistoricalChart from './HistoricalChart';
import StatContainer from './StatContainer';

interface VarStatsProps {
  activeAssets: Array<AssetKey>;
  data: Record<AssetKey, ReturnType<typeof useVarData>>;
}

export default function VarStats({ activeAssets, data }: VarStatsProps) {
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
            value: Number(dp['10_day_99p']) * -1,
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
        var: Number(dataPoints[0]['10_day_99p']) * -1,
        totalLiabilities: dataPoints[0]['total_liabilities'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > latestStat.ts) {
          latestStat.var = Number(dp['10_day_99p']) * -1;
          latestStat.totalLiabilities = dp['total_liabilities'];
          latestStat.ts = dp.ts;
        }
      }

      tls[asset.key] = [
        {
          key: 'VaR',
          value: `$${latestStat.var.toFixed(1)}B`,
          isPrimary: true,
        },
        {
          key: 'VaR / TL',
          tooltip:
            'VaR / TL expresses the value at risk as a percentage of the total dollar value of deposits into the protocol.',
          value: `${(
            ((latestStat.var * 1e9) / latestStat.totalLiabilities) *
            100
          ).toFixed(1)}%`,
        },
      ];
    }

    return tls;
  }, [activeAssets, data]);

  return (
    <>
      <StatContainer
        title="VAR (VALUE AT RISK)"
        helpText={
          <Text>
            {GRAPHS.find((g) => g.key === 'VAR')?.description} <br />
            <br />
            <Link
              href="https://docs.credmark.com/credmark-risk-library/risk-metrics/value-at-risk-var"
              isExternal
              textDecoration="underline"
              pb="1"
            >
              Read more about VaR in our Risk Library{' '}
              <Icon as={FaExternalLinkAlt} />
            </Link>
          </Text>
        }
      >
        <Box>
          <Text textAlign="center" color="gray.600" fontSize="lg" mt="2" mb="4">
            10-day VAR with 99% confidence
          </Text>
          <CurrentStats
            loading={Object.keys(currentStats).length === 0}
            activeAssets={activeAssets}
            stats={currentStats}
          />
        </Box>
      </StatContainer>
      <StatContainer title="Historic VaR">
        <HistoricalChart
          lines={chartLines}
          loading={!!Object.values(data).find(({ loading }) => loading)}
          formatValue={(val: number) => '$' + val.toFixed(1) + 'B'}
        />
      </StatContainer>
    </>
  );
}
