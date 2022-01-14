import { Box, BoxProps, HStack, Icon, Link, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

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

interface RiskMetricsProps {
  activeAssets: Array<AssetKey>;
  lcrData: Record<AssetKey, ReturnType<typeof useLcrData>>;
  varData: Record<AssetKey, ReturnType<typeof useVarData>>;
}

type MetricKey = 'VAR' | 'LCR' | 'VTL';

export default function CoreMetrics({
  activeAssets,
  lcrData,
  varData,
}: RiskMetricsProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('VAR');

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
      const data = activeMetric === 'LCR' ? lcrData : varData;
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
        case 'LCR':
          lineData = (dataPoints as LcrDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value: dp.lcr * 100,
            }))
            .reverse();
          break;
        case 'VAR':
          lineData = (dataPoints as VarDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value: Number(dp['10_day_99p']) * -1e9,
            }))
            .reverse();
          break;
        case 'VTL':
          lineData = (dataPoints as VarDataPoint[])
            .map((dp) => ({
              timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
              value:
                ((Number(dp['10_day_99p']) * -1e9) / dp['total_liabilities']) *
                100,
            }))
            .reverse();
          break;
      }

      lines.push({
        name: `${asset.title} - ${
          { VAR: 'VaR', LCR: 'LCR', VTL: 'VaR/TL' }[activeMetric]
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
      if (lcrData[asset.key].loading) continue;

      const dataPoints = lcrData[asset.key].data;
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
          key: 'Liquidity Coverage Ratio (LCR)',
          value: `${(latestStat.lcr * 100).toFixed(1)}%`,
          tooltip: (
            <Text>
              LCR measures liquidity risk, defined as the proportion of highly
              liquid assets held by an organization to ensure that they maintain
              an ongoing ability to meet their short-term obligations (cash
              outflows for 30 days) in a stress situation. <br />
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
          ),
        },
      ];
    }

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (varData[asset.key].loading) continue;

      const dataPoints = varData[asset.key].data;
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
        ...(tls[asset.key] ?? []),
        {
          key: 'Value at Risk (VaR)',
          value: `$${latestStat.var.toFixed(1)}B`,
          tooltip: (
            <Text>
              VaR is a numerical measure of market risk for a given portfolio;
              our model&apos;s numerical output represents a worst-case loss for
              a given portfolio over a given holding period. We apply VaR to a
              platform by using total borrows minus total deposits in each token
              as the portfolio. <br />
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
          ),
        },
        {
          key: 'VaR / TL',
          tooltip:
            'VaR / Total Liabilities (TL) expresses the value at risk as a percentage of the total dollar value of deposits into the protocol.',
          value: `${(
            ((latestStat.var * 1e9) / latestStat.totalLiabilities) *
            100
          ).toFixed(1)}%`,
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
      <StatContainer title="Risk Metrics">
        <Box>
          <CurrentStats
            loading={Object.keys(currentStats).length === 0}
            activeAssets={activeAssets}
            stats={currentStats}
          />
        </Box>
      </StatContainer>
      <StatContainer title="Historic Risk Metrics">
        <Box borderBottom="1px" borderColor="purple.500" mx="4" my="8" px="4">
          <HStack spacing="1">
            <Box {...tabProps('LCR')}>LCR</Box>
            <Box {...tabProps('VAR')}>VaR</Box>
            <Box {...tabProps('VTL')}>VaR / TL</Box>
          </HStack>
        </Box>
        <HistoricalChart
          lines={chartLines}
          loading={
            !!Object.values(lcrData).find(({ loading }) => loading) ||
            !!Object.values(varData).find(({ loading }) => loading)
          }
          formatValue={(val) =>
            activeMetric === 'VAR'
              ? '$' + shortenNumber(val, 1)
              : val.toFixed(1) + '%'
          }
        />
      </StatContainer>
    </>
  );
}
