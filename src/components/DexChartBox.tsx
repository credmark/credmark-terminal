import {
  Box,
  Center,
  Flex,
  HStack,
  Icon,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { Currency } from '@uniswap/sdk-core';
import axios, { AxiosResponse } from 'axios';
import { EChartsInstance } from 'echarts-for-react';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CSVLink } from 'react-csv';
import {
  MdOpenInNew,
  MdOutlineFileDownload,
  MdZoomOutMap,
} from 'react-icons/md';

import { CsvData, useSingleLineChart } from '~/hooks/useChart';
import { shortenNumber } from '~/utils/formatTokenAmount';

import CurrencyLogo from './CurrencyLogo';
import HistoricalChart from './RiskTerminal/helpers/HistoricalChart';

interface DexChartBoxProps {
  dex: 'SUSHISWAP' | 'UNISWAP_V2' | 'UNISWAP_V3' | 'CURVE';
  pool: string;
  tokens: Currency[];
  createdAt?: number;

  onExpand: () => void;
  isExpanded: boolean;
}

interface DexModelResponse {
  slug: string;
  version: string;
  chainId: number;
  blockNumber: number;
  output: {
    pool_infos: {
      series: Array<{
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
      errors?: Array<{ error: { message: string } }>;
    };
  };
  error?: {
    message: string;
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const tvlChart = useSingleLineChart({
    name: 'TVL',
    color: '#3B0065',
    formatValue: (val) => '$' + shortenNumber(val, 2),
  });

  const volumeChart = useSingleLineChart({
    name: 'Volume',
    color: '#3B0065',
    formatValue: (val) => shortenNumber(val, 2),
  });

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth, isExpanded]);

  const sortedTokens = [...tokens].sort((a, b) =>
    a.wrapped.sortsBefore(b.wrapped) ? -1 : 1,
  );

  function convertDate(date: Date) {
    return `${date.getUTCFullYear()}-${
      date.getMonth() + 1
    }-${date.getUTCDate()}`;
  }

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    const abortController = new AbortController();

    // today
    const endDate = new Date();
    // 90 days before today or contract creation time, whichever is latest
    const startDate = new Date(
      Math.max(new Date().valueOf() - 90 * 24 * 3600 * 1000, createdAt),
    );

    axios({
      method: 'POST',
      url: 'https://gateway.credmark.com/v1/model/run',
      data: {
        slug:
          dex === 'CURVE'
            ? 'contrib.curve-get-tvl-and-volume-historical'
            : dex === 'UNISWAP_V3'
            ? 'contrib.uniswap-get-tvl-and-volume-historical'
            : 'contrib.sushiswap-get-tvl-and-volume-historical',
        chainId: 1,
        blockNumber: 'latest',
        input: {
          pool_address: {
            address: pool,
          },
          date_range: [convertDate(startDate), convertDate(endDate)],
        },
      },
      signal: abortController.signal,
    })
      .then((resp: AxiosResponse<DexModelResponse>) => {
        if (resp.data.error) {
          console.log(resp.data.error);
          throw new Error(resp.data.error.message);
        }

        if (
          Array.isArray(resp.data.output.pool_infos.errors) &&
          resp.data.output.pool_infos.errors.length > 0
        ) {
          console.log(resp.data.output.pool_infos.errors);
          throw new Error(resp.data.output.pool_infos.errors[0].error.message);
        }

        // https://github.com/facebook/react/issues/16265
        tvlChart.updateData.call(
          undefined,
          resp.data.output.pool_infos.series.map((item) => ({
            timestamp: new Date(item.sampleTimestamp * 1000),
            value: item.output.tvl,
          })),
        );

        volumeChart.updateData.call(
          undefined,
          resp.data.output.pool_infos.series.map((item) => ({
            timestamp: new Date(item.sampleTimestamp * 1000),
            value: item.output.volume24h,
          })),
        );
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.log(err);
        setError(err.message ?? 'Some unexpected error has occurred');
      })
      .finally(() => setLoading(false));

    return () => {
      abortController.abort();
    };
  }, [tvlChart.updateData, volumeChart.updateData, createdAt, dex, pool]);

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
      <HStack
        px="4"
        py="2"
        roundedTop="md"
        borderBottom="2px"
        borderColor="#DEDEDE"
      >
        <HStack align="center">
          {sortedTokens.map((token) => (
            <CurrencyLogo currency={token} key={token.symbol} />
          ))}
          <Text fontSize="lg">
            {sortedTokens
              .map((token) => token.symbol ?? token.name)
              .join(' / ')}
          </Text>
          <Link href={`https://etherscan.io/address/${pool}`} isExternal>
            <Icon as={MdOpenInNew} />
          </Link>
        </HStack>

        <Spacer />
        <CSVLink
          filename={`${tvlChart.line.name.replaceAll(' ', '_')}[Credmark].csv`}
          headers={csv.headers}
          data={csv.data}
          style={{ display: 'flex' }}
        >
          <Icon cursor="pointer" as={MdOutlineFileDownload} />
        </CSVLink>
        <Icon cursor="pointer" onClick={onExpand} as={MdZoomOutMap} />
      </HStack>
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
          error={error ? String(error) : undefined}
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
            error={error ? String(error) : undefined}
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
