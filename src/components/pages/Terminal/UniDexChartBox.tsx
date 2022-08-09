import { HStack, Link, ListItem, UnorderedList } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { Currency } from '@uniswap/sdk-core';
import { EChartsInstance } from 'echarts-for-react';
import { DateTime, Duration } from 'luxon';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { Card } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import { CurrenciesLogo } from '~/components/shared/CurrencyLogo';
import Stat from '~/components/shared/Stat';
import { useSingleLineChart } from '~/hooks/useChart';
import { useModelRunner } from '~/hooks/useModel';
import { ModelSeriesOutput } from '~/types/model';
import { mergeCsvs } from '~/utils/chart';

interface DexChartBoxProps {
  dex: 'SUSHISWAP' | 'UNISWAP_V2' | 'UNISWAP_V3';
  pool: string;
  tokens: Currency[];
  createdAt?: number;
  fee?: number;
  varStartTime?: number;

  onExpand: () => void;
  isExpanded: boolean;
}

interface TvlModelOutput {
  address: string;
  name: string;
  portfolio: {
    positions: Array<{
      amount: number;
      asset: {
        address: number;
      };
    }>;
  };
  prices: Array<{
    price: number;
    src: string;
  }>;
  tokens_symbol: string[];
  tvl: number;
}

interface VarModelOutput {
  pool: { address: string };
  tokens_address: [string, string];
  tokens_symbol: [string, string];
  ratio: number;
  IL_type: 'V2' | 'V3';
  range: [] | [number, number];
  var: {
    var: number;
  };
}

interface VolumeModelOutput {
  some: Array<{
    token: {
      address: string;
    };
    sellAmount: number;
    buyAmount: number;
    sellValue: number;
    buyValue: number;
  }>;
}

interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}

export default function DexChartBox({
  dex,
  pool,
  tokens,
  createdAt = 0,
  varStartTime = 0,
  fee,

  onExpand,
  isExpanded,
}: DexChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth, isExpanded]);

  const sortedTokens = [...tokens].sort((a, b) =>
    a.wrapped.sortsBefore(b.wrapped) ? -1 : 1,
  );

  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    slug: 'rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const tvlModel = useModelRunner<TvlModelOutput>({
    slug: 'uniswap-v2.pool-tvl',
    input: {
      address: pool,
    },
    window: Duration.fromObject({
      days: Math.min(
        90,
        Math.floor((Date.now().valueOf() - createdAt) / (24 * 3600 * 1000)),
      ),
    }),
    interval: Duration.fromObject({ days: 1 }),
    suspended: !blockNumberModel.output,
    blockNumber: blockNumberModel.output?.blockNumber,
  });

  const tvlChart = useSingleLineChart({
    name: 'Total Value Locked',
    color: '#00E09D',
    formatter: 'currency',
    fractionDigits: 2,
    data: tvlModel.output
      ? tvlModel.output.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.tvl,
        }))
      : undefined,
    loading: tvlModel.loading || blockNumberModel.loading,
    error: tvlModel.errorMessage,
  });

  const volumeChartCommonProps = {
    name: 'Volume',
    color: '#9500FF',
    formatter: 'currency' as const,
    fractionDigits: 2,
  };

  const currentVolumeModel = useModelRunner<VolumeModelOutput>({
    blockNumber: blockNumberModel.output?.blockNumber,
    slug: 'dex.pool-volume',
    input: {
      pool_info_model: 'uniswap-v2.pool-tvl',
      interval: 7200,
      address: pool,
    },
    suspended: !blockNumberModel.output,
  });

  const currentVolumeChart = useSingleLineChart({
    ...volumeChartCommonProps,
    data:
      currentVolumeModel.output && blockNumberModel.output
        ? [
            {
              timestamp: new Date(
                blockNumberModel.output.sampleTimestamp * 1000,
              ),
              value: currentVolumeModel.output.some.reduce(
                (total, tv) => total + tv.buyValue,
                0,
              ),
            },
          ]
        : [],
    loading: currentVolumeModel.loading || blockNumberModel.loading,
    error: currentVolumeModel.errorMessage,
  });

  const volumeModel = useModelRunner<ModelSeriesOutput<VolumeModelOutput>>({
    blockNumber: blockNumberModel.output?.blockNumber,
    slug: 'dex.pool-volume-historical',
    input: {
      pool_info_model: 'uniswap-v2.pool-tvl',
      interval: 7200,
      address: pool,
      count: Math.min(
        90,
        Math.floor((Date.now().valueOf() - createdAt) / (24 * 3600 * 1000)),
      ),
    },
    suspended: !blockNumberModel.output,
  });

  const volumeChart = useSingleLineChart({
    ...volumeChartCommonProps,
    data: volumeModel.output
      ? volumeModel.output.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.some.reduce((total, tv) => total + tv.buyValue, 0),
        }))
      : undefined,
    loading: volumeModel.loading || blockNumberModel.loading,
    error: volumeModel.errorMessage,
  });

  const WINDOW_DAYS = 90;

  const varModelCommonProps = {
    blockNumber: blockNumberModel.output?.blockNumber,
    slug: 'finance.var-dex-lp',
    input: {
      window: `${Math.min(
        180,
        Math.floor((Date.now().valueOf() - varStartTime) / (24 * 3600 * 1000)) -
          WINDOW_DAYS,
      )} days`,
      interval: 10,
      confidence: 0.01,
      lower_range: 0.01,
      upper_range: 0.01,
      pool: {
        address: pool,
      },
    },
  };

  const varChartCommonProps = {
    name: 'Value at Risk',
    description: useMemo(
      () => (
        <>
          Value at Risk in this case refers to the percentage of your LP
          position at risk in terms of a worst-case scenario for a given holding
          period.
          <br />
          <br />
          Settings:
          <UnorderedList>
            <ListItem>
              VaR model: Historical with 90 days&apos; price at 23:59 UTC every
              day
            </ListItem>
            <ListItem>Horizon: 10 days</ListItem>
            <ListItem>Confidence: 1%</ListItem>
            {dex === 'UNISWAP_V3' && (
              <ListItem>LP range: +/- 1% of the latest price</ListItem>
            )}
          </UnorderedList>
          <br />
          <Link
            href="https://docs.credmark.com/dealing-with-risks/market-risk/value-at-risk-var"
            isExternal
            textDecoration="underline"
            pb="1"
            aria-label="Read more about VaR in Credmark Wiki"
          >
            Read more about VaR in Credmark Wiki →
          </Link>
        </>
      ),
      [dex],
    ),
    color: '#9500FF',
    formatter: 'percent' as const,
    fractionDigits: 2,
  };

  const currentVarModel = useModelRunner<VarModelOutput>({
    ...varModelCommonProps,
    suspended: !blockNumberModel.output,
  });

  const currentVarChart = useSingleLineChart({
    ...varChartCommonProps,
    data:
      currentVarModel.output && blockNumberModel.output
        ? [
            {
              timestamp: new Date(
                blockNumberModel.output.sampleTimestamp * 1000,
              ),
              value: currentVarModel.output.var.var * 100,
            },
          ]
        : [],
    loading: currentVarModel.loading || blockNumberModel.loading,
    error: currentVarModel.errorMessage,
  });

  const varModel = useModelRunner<VarModelOutput>({
    ...varModelCommonProps,
    window: Duration.fromObject({
      days: Math.min(
        WINDOW_DAYS,
        Math.floor((Date.now().valueOf() - createdAt) / (24 * 3600 * 1000)),
      ),
    }),
    interval: Duration.fromObject({ days: 1 }),
    suspended: !blockNumberModel.output,
  });

  const varChart = useSingleLineChart({
    ...varChartCommonProps,
    data: varModel.output?.series?.map((item) => ({
      timestamp: new Date(item.sampleTimestamp * 1000),
      value: item.output.var.var * 100,
    })),
    loading: varModel.loading || blockNumberModel.loading,
    error: varModel.errorMessage,
  });

  const csv = useMemo(() => {
    return mergeCsvs(tvlChart.csv, varChart.csv, volumeChart.csv);
  }, [tvlChart.csv, varChart.csv, volumeChart.csv]);

  return (
    <Card ref={containerRef}>
      <ChartHeader
        logo={<CurrenciesLogo currencies={sortedTokens} />}
        title={sortedTokens
          .map((token) => token.symbol ?? token.name)
          .join(' / ')}
        subtitle={fee ? fee + '%' : ''}
        toggleExpand={onExpand}
        isExpanded={isExpanded}
        downloadCsv={{
          filename: `${tvlChart.lines[0].name.replaceAll(
            ' ',
            '_',
          )}[Credmark].csv`,
          ...csv,
        }}
        externalLink={`https://etherscan.io/address/${pool}`}
      />

      <HStack spacing="4" my="2" px={isExpanded ? 0 : 2}>
        <HStack flex="1" alignItems="center" spacing="1">
          {!isExpanded && <Stat {...currentVarChart.currentStats[0]} />}
          <HistoricalChart
            height={isExpanded ? 200 : 40}
            flex="1"
            durations={[30, 60, 90]}
            defaultDuration={90}
            showCurrentStats
            minimal={!isExpanded}
            {...varChart}
          />
        </HStack>

        <HStack flex="1" alignItems="center" spacing="1">
          {!isExpanded && <Stat {...currentVolumeChart.currentStats[0]} />}
          <HistoricalChart
            height={isExpanded ? 200 : 40}
            flex="1"
            durations={[30, 60, 90]}
            defaultDuration={90}
            showCurrentStats
            minimal={!isExpanded}
            {...volumeChart}
          />
        </HStack>
      </HStack>

      <HistoricalChart
        height={300}
        flex="1"
        onChartReady={(chart) => (chartRef.current = chart)}
        durations={[30, 60, 90]}
        defaultDuration={90}
        showCurrentStats
        highlightCurrentStats
        {...tvlChart}
      />
    </Card>
  );
}
