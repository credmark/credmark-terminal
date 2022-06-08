import { Box, Center, Flex, Icon, Link, Text } from '@chakra-ui/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useSize from '@react-hook/size';
import { Currency } from '@uniswap/sdk-core';
import { EChartsInstance } from 'echarts-for-react';
import { DateTime, Duration } from 'luxon';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import CurrencyLogo from '~/components/shared/CurrencyLogo';
import { useSingleLineChart } from '~/hooks/useChart';
import { useModelRunner } from '~/hooks/useModel';
import { ModelSeriesOutput } from '~/types/model';
import { mergeCsvs } from '~/utils/chart';

const formatDate = (date: Date) =>
  `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}`;

interface DexChartBoxProps {
  dex: 'SUSHISWAP' | 'UNISWAP_V2' | 'UNISWAP_V3' | 'CURVE';
  pool: string;
  tokens: Currency[];
  createdAt?: number;

  onExpand: () => void;
  isExpanded: boolean;
}

interface DexModelOutput {
  pool_infos: ModelSeriesOutput<{
    address: string;
    name: string;
    coin_balances: { [key: string]: number };
    prices: { [key: string]: number };
    tvl: number;
    volume24h: number;
  }>;
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

export default function DexChartBox({
  dex,
  pool,
  tokens,
  createdAt = 0,

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

  const tvlInput = {
    pool_address: {
      address: pool,
    },
    date_range: [
      formatDate(
        new Date(
          Math.max(new Date().valueOf() - 90 * 24 * 3600 * 1000, createdAt),
        ),
      ),
      formatDate(new Date()),
    ],
  };

  const tvlModel = useModelRunner<typeof tvlInput, DexModelOutput>({
    slug:
      dex === 'CURVE'
        ? 'contrib.curve-get-tvl-and-volume-historical'
        : dex === 'UNISWAP_V3'
        ? 'contrib.uniswap-get-tvl-and-volume-historical'
        : 'contrib.sushiswap-get-tvl-and-volume-historical',
    input: tvlInput,
    validateOutput(output: DexModelOutput) {
      if (
        Array.isArray(output.pool_infos.errors) &&
        output.pool_infos.errors.length > 0
      ) {
        console.log(output.pool_infos.errors);
        throw new Error(output.pool_infos.errors[0].error.message);
      }
    },
  });

  const tvlChart = useSingleLineChart({
    name: 'TVL',
    color: '#3B0065',
    formatter: 'currency',
    fractionDigits: 2,
    data: tvlModel.output
      ? tvlModel.output.pool_infos.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.tvl,
        }))
      : undefined,
    loading: tvlModel.loading,
    error: tvlModel.errorMessage,
  });

  const volumeChart = useSingleLineChart({
    name: 'Volume',
    color: '#3B0065',
    formatter: 'number',
    fractionDigits: 2,
    data: tvlModel.output
      ? tvlModel.output.pool_infos.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.volume24h,
        }))
      : undefined,
    loading: tvlModel.loading,
    error: tvlModel.errorMessage,
  });

  const varInput = {
    window: '30 days',
    interval: 10,
    confidence: 0.01,
    lower_range: 0.01,
    upper_range: 0.01,
    pool: {
      address: pool,
    },
  };

  const varModel = useModelRunner<typeof varInput, VarModelOutput>({
    slug: 'finance.var-dex-lp',
    input: varInput,
    window: Duration.fromObject({
      days: Math.min(
        90,
        Math.floor((Date.now().valueOf() - createdAt) / (24 * 3600 * 1000)),
      ),
    }),
    interval: Duration.fromObject({ days: 1 }),
    endTime: DateTime.utc().startOf('day').toJSDate(),
  });

  const varChart = useSingleLineChart({
    name: 'Value at Risk',
    color: '#3B0065',
    formatter: 'number',
    fractionDigits: 4,
    data: varModel.output?.series?.map((item) => ({
      timestamp: new Date(item.sampleTimestamp * 1000),
      value: item.output.var.var,
    })),
    loading: varModel.loading,
    error: varModel.errorMessage,
  });

  const csv = useMemo(() => {
    return mergeCsvs(tvlChart.csv, varChart.csv, volumeChart.csv);
  }, [tvlChart.csv, varChart.csv, volumeChart.csv]);

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
        toggleFullScreen={onExpand}
        downloadFileName={`${tvlChart.lines[0].name.replaceAll(
          ' ',
          '_',
        )}[Credmark].csv`}
        downloadFileHeaders={csv.headers}
        downloadData={csv.data}
        isFullScreen={isExpanded}
        logo={sortedTokens.map((token) => (
          <CurrencyLogo currency={token} key={token.symbol} />
        ))}
        openInNewTab={
          <Link
            href={`https://etherscan.io/address/${pool}`}
            isExternal
            display="flex"
            alignItems="center"
          >
            <Icon color="gray.300" as={OpenInNewIcon} />
          </Link>
        }
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
              <Text fontSize="sm">{varChart.currentStats[0].label}</Text>
              <Text fontSize="3xl" fontWeight="medium">
                {varChart.currentStats[0].value}
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
                <Text fontSize="sm">{tvlChart.currentStats[0].label}</Text>
                <Text fontSize="lg" fontWeight="medium">
                  {tvlChart.currentStats[0].value}
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
          {...varChart}
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
            {...tvlChart}
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
