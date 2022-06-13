import { Box, Center, Flex, Icon, Link, Text } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useSize from '@react-hook/size';
import { Currency } from '@uniswap/sdk-core';
import { EChartsInstance } from 'echarts-for-react';
import { DateTime, Duration } from 'luxon';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import { CurrenciesLogo } from '~/components/shared/CurrencyLogo';
import { useSingleLineChart } from '~/hooks/useChart';
import { useModelRunner } from '~/hooks/useModel';
import { mergeCsvs } from '~/utils/chart';

interface DexChartBoxProps {
  pool: string;
  tokens: Currency[];
  createdAt?: number;
  fee?: number;

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

interface CurvePoolInfoOutput {
  address: string;
  virtualPrice: number;
  tokens: { tokens: Array<{ address: string }> };
  tokens_symbol: string[];
  balances: number[];
  balances_token: number[];
  admin_fees: number[];
  underlying_tokens: { tokens: Array<{ address: string }> };
  underlying_tokens_symbol: string[];
  A: number;
  chi: number;
  ratio: number;
  is_meta: boolean;
  name: string;
  lp_token_name: string;
  lp_token_addr: string;
  pool_token_name: string;
  pool_token_addr: string;
}

interface VolumeModelOutput {
  tokenVolumes: Array<{
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

export default function CurveDexChartBox({
  pool,
  tokens,
  createdAt = 0,
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
    slug: 'curve-fi.pool-tvl',
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
    name: 'TVL',
    color: '#3B0065',
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

  const volumeModel = useModelRunner<VolumeModelOutput>({
    slug: 'dex.pool-volume',
    input: {
      pool_info_model: 'curve-fi.pool-tvl',
      block_offset: -7200,
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

  const volumeChart = useSingleLineChart({
    name: 'Volume',
    color: '#3B0065',
    formatter: 'currency',
    fractionDigits: 2,
    data: volumeModel.output
      ? volumeModel.output.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.tokenVolumes.reduce(
            (total, tv) => total + tv.buyValue,
            0,
          ),
        }))
      : undefined,
    loading: volumeModel.loading || blockNumberModel.loading,
    error: volumeModel.errorMessage,
  });

  const poolInfoModel = useModelRunner<CurvePoolInfoOutput>({
    slug: 'curve-fi.pool-info',
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

  const peggingRatioChart = useSingleLineChart({
    name: 'Balance Ratio',
    description: useMemo(
      () => (
        <React.Fragment>
          Shows the imbalance of a pool and how far it deviates from 1
          (perfectly balanced)
          <br />
          <br />
          <Link
            href="https://docs.credmark.com/dealing-with-risks/defi-and-crypto-specific-risks/depegging-risk"
            isExternal
            textDecoration="underline"
            pb="1"
            aria-label="Read more about Depegging Risk in our Credmark Wiki"
          >
            Read more about Depegging Risk in our Credmark Wiki{' '}
            <Icon color="gray.300" as={OpenInNewIcon} />
          </Link>
        </React.Fragment>
      ),
      [],
    ),
    color: '#3B0065',
    formatter: 'number',
    fractionDigits: 4,
    data: poolInfoModel.output?.series?.map((item) => ({
      timestamp: new Date(item.sampleTimestamp * 1000),
      value: item.output.ratio ?? 0,
    })),
    loading: poolInfoModel.loading || blockNumberModel.loading,
    error: poolInfoModel.errorMessage,
  });

  const csv = useMemo(() => {
    return mergeCsvs(tvlChart.csv, peggingRatioChart.csv, volumeChart.csv);
  }, [tvlChart.csv, peggingRatioChart.csv, volumeChart.csv]);

  return (
    <Box
      ref={containerRef}
      rounded="md"
      border="1px"
      borderColor="#DEDEDE"
      bg="white"
      shadow="md"
    >
      <ChartHeader
        title={sortedTokens
          .map((token) => token.symbol ?? token.name)
          .join(' / ')}
        subtitle={fee ? fee + '%' : ''}
        toggleFullScreen={onExpand}
        downloadFileName={`${tvlChart.lines[0].name.replaceAll(
          ' ',
          '_',
        )}[Credmark].csv`}
        downloadFileHeaders={csv.headers}
        downloadData={csv.data}
        isFullScreen={isExpanded}
        logo={<CurrenciesLogo currencies={sortedTokens} />}
        openInNewTab={`https://etherscan.io/address/${pool}`}
      />

      <Flex align="stretch">
        {!isExpanded && (
          <Flex direction="column" w="200px">
            <Center
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.100"
              p="4"
              flexDirection="column"
            >
              <Text fontSize="sm">{tvlChart.currentStats[0].label}</Text>
              <Text fontSize="3xl" fontWeight="medium">
                {tvlChart.currentStats[0].value}
              </Text>
            </Center>
            <Flex flex="1">
              <Center
                flex="1"
                textAlign="center"
                borderTop="2px"
                borderRight="2px"
                borderColor="gray.100"
                p="2"
                flexDirection="column"
              >
                <Text fontSize="sm">
                  {peggingRatioChart.currentStats[0].label}
                </Text>
                <Text fontSize="lg" fontWeight="medium">
                  {peggingRatioChart.currentStats[0].value}
                </Text>
              </Center>
              <Center
                flex="1"
                textAlign="center"
                borderTop="2px"
                borderRight="2px"
                borderColor="gray.100"
                p="2"
                flexDirection="column"
              >
                <Text fontSize="sm">{volumeChart.currentStats[0].label}</Text>
                <Text fontSize="lg" fontWeight="medium">
                  {volumeChart.currentStats[0].value}
                </Text>
              </Center>
            </Flex>
          </Flex>
        )}
        <HistoricalChart
          height={300}
          flex="1"
          onChartReady={(chart) => (chartRef.current = chart)}
          durations={[30, 60, 90]}
          defaultDuration={30}
          showCurrentStats={isExpanded}
          {...tvlChart}
        />
      </Flex>

      {isExpanded && (
        <Flex borderTop="2px" borderColor="gray.100">
          <HistoricalChart
            height={200}
            flex="1"
            durations={[30, 60, 90]}
            defaultDuration={30}
            showCurrentStats
            {...peggingRatioChart}
          />
          <HistoricalChart
            height={200}
            flex="1"
            borderLeft="2px"
            borderColor="gray.100"
            durations={[30, 60, 90]}
            defaultDuration={30}
            showCurrentStats
            {...volumeChart}
          />
        </Flex>
      )}
    </Box>
  );
}
