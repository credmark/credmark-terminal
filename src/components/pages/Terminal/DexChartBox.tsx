import { Box, Center, Flex, Icon, Link, Text } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { Currency } from '@uniswap/sdk-core';
import { EChartsInstance } from 'echarts-for-react';
import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { MdOpenInNew } from 'react-icons/md';

import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import CurrencyLogo from '~/components/shared/CurrencyLogo';
import { CsvData, useSingleLineChart } from '~/hooks/useChart';
import { useModelRunner } from '~/hooks/useModel';
import { ModelSeriesOutput } from '~/types/model';

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
    blockNumber: number;
    blockTimestamp: number;
    sampleTimestamp: number;
    output: {
      address: string;
      name: string;
      coin_balances: { [key: string]: number };
      prices: { [key: string]: number };
      tvl: number;
      volume24h: number;
    };
  }>;
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

  const input = useMemo(() => {
    const convertDate = (date: Date) =>
      `${date.getUTCFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}`;

    // today
    const endDate = new Date();
    // 90 days before today or contract creation time, whichever is latest
    const startDate = new Date(
      Math.max(new Date().valueOf() - 90 * 24 * 3600 * 1000, createdAt),
    );

    return {
      pool_address: {
        address: pool,
      },
      date_range: [convertDate(startDate), convertDate(endDate)],
    };
  }, [createdAt, pool]);

  const { loading, errorMessage, output } = useModelRunner<
    typeof input,
    DexModelOutput
  >({
    slug:
      dex === 'CURVE'
        ? 'contrib.curve-get-tvl-and-volume-historical'
        : dex === 'UNISWAP_V3'
        ? 'contrib.uniswap-get-tvl-and-volume-historical'
        : 'contrib.sushiswap-get-tvl-and-volume-historical',
    input,
    validateOutput: useCallback((output: DexModelOutput) => {
      if (
        Array.isArray(output.pool_infos.errors) &&
        output.pool_infos.errors.length > 0
      ) {
        console.log(output.pool_infos.errors);
        throw new Error(output.pool_infos.errors[0].error.message);
      }
    }, []),
  });

  const tvlChart = useSingleLineChart({
    name: 'TVL',
    color: '#3B0065',
    formatter: 'currency',
    fractionDigits: 2,
    data: output
      ? output.pool_infos.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.tvl,
        }))
      : undefined,
  });

  const volumeChart = useSingleLineChart({
    name: 'Volume',
    color: '#3B0065',
    formatter: 'number',
    fractionDigits: 2,
    data: output
      ? output.pool_infos.series.map((item) => ({
          timestamp: new Date(item.sampleTimestamp * 1000),
          value: item.output.volume24h,
        }))
      : undefined,
  });

  const csv = useMemo(() => {
    function mergeCsvs(...csvs: Array<{ data: CsvData[]; headers: string[] }>) {
      const dataMap: Record<string, CsvData> = {};
      const headers: string[] = [];
      for (const csv of csvs) {
        for (const header of csv.headers) {
          if (!headers.includes(header)) {
            headers.push(header);
          }
        }

        for (const datum of csv.data) {
          const ts = datum['Timestamp'];
          for (const [key, value] of Object.entries(datum)) {
            if (key === 'Timestamp') {
              continue;
            }

            if (!(ts in dataMap)) {
              dataMap[ts] = {
                Timestamp: ts,
              };
            }

            dataMap[ts][key] = value;
          }
        }
      }

      return { data: Object.values(dataMap), headers };
    }

    return mergeCsvs(tvlChart.csv, volumeChart.csv);
  }, [tvlChart.csv, volumeChart.csv]);

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
        downloadFileName={`${tvlChart.line.name.replaceAll(
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
            <Icon as={MdOpenInNew} />
          </Link>
        }
      />

      <Flex align="stretch">
        {!isExpanded && (
          <Flex direction="column">
            <Center
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.100"
              p="4"
              flexDirection="column"
              w="160px"
            >
              <Text fontSize="lg">{tvlChart.currentStats.label}</Text>
              <Text fontSize="3xl" fontWeight="medium">
                {tvlChart.currentStats.value}
              </Text>
            </Center>
            <Center
              flex="1"
              textAlign="center"
              borderTop="2px"
              borderRight="2px"
              borderColor="gray.100"
              p="4"
              flexDirection="column"
              w="160px"
            >
              <Text fontSize="lg">{volumeChart.currentStats.label}</Text>
              <Text fontSize="2xl" fontWeight="medium">
                {volumeChart.currentStats.value}
              </Text>
            </Center>
          </Flex>
        )}
        <HistoricalChart
          height={300}
          flex="1"
          lines={[tvlChart.line]}
          loading={loading}
          formatValue={tvlChart.formatValue}
          onChartReady={(chart) => (chartRef.current = chart)}
          error={errorMessage}
          durations={[30, 60, 90]}
          defaultDuration={30}
          currentStats={[tvlChart.currentStats]}
          showCurrentStats={isExpanded}
        />
      </Flex>

      {isExpanded && (
        <Flex borderTop="2px" borderColor="gray.100">
          <HistoricalChart
            height={200}
            flex="1"
            lines={[volumeChart.line]}
            loading={loading}
            formatValue={volumeChart.formatValue}
            error={errorMessage}
            durations={[30, 60, 90]}
            defaultDuration={30}
            currentStats={[volumeChart.currentStats]}
            showCurrentStats
          />
        </Flex>
      )}
    </Box>
  );
}
