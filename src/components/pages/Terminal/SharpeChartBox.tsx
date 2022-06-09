import {
  Box,
  CloseButton,
  HStack,
  Icon,
  IconButton,
  Link,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useSize from '@react-hook/size';
import { Token } from '@uniswap/sdk-core';
import { EChartsInstance } from 'echarts-for-react';
import { DateTime, Duration } from 'luxon';
import React, { useLayoutEffect, useRef, useState } from 'react';

import { BorderedCard } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import CurrencyLogo from '~/components/shared/CurrencyLogo';
import { useLineChart } from '~/hooks/useChart';
import {
  useDeepCompareEffect,
  useDeepCompareMemo,
} from '~/hooks/useDeepCompare';
import useFullscreen from '~/hooks/useFullscreen';
import { useModelRunner, useModelRunnerCallback } from '~/hooks/useModel';
import { ModelSeriesOutput } from '~/types/model';

const PRICE_CACHE: Record<string, ModelSeriesOutput<TokenPrice>> = {};
const SHARPE_RATIO_CACHE: Record<string, ModelSeriesOutput<SharpeRatio>> = {};

interface TokenPrice {
  price: number;
  src?: string | undefined;
}

const colors = ['#00d696', '#00a1ed', '#8342af', '#ff447d', '#ffa727'];

interface SharpeRatio {
  token_address: string;
  sharpe_ratio: number;
  avg_return: number;
  risk_free_rate: number;
  ret_stdev: number;
  return_rolling_interval: number;
  blockTime: string;
  block_number: number;
  blockTimestamp: number;
}

interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}

function useSharpeRatioModel(tokens: string[]) {
  const [pricesLoading, setPricesLoading] = useState(false);
  const [sharpeLoading, setSharpeLoading] = useState(false);

  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    slug: 'rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const blockNumber = blockNumberModel.output?.blockNumber;

  const runPriceModel = useModelRunnerCallback<{
    result: ModelSeriesOutput<TokenPrice>;
  }>();
  const runSharpeModel = useModelRunnerCallback<{
    results: Array<{ output: SharpeRatio }>;
  }>();

  const [tokenPrices, setTokenPrices] = useState<
    Record<string, ModelSeriesOutput<TokenPrice>>
  >({});

  const [sharpeRatios, setSharpeRatios] = useState<
    ModelSeriesOutput<SharpeRatio>[]
  >([]);

  const PRICE_WINDOW = 180;
  const SHARPE_WINDOW = 90;

  useDeepCompareEffect(() => {
    setPricesLoading(true);
    if (!blockNumber) return;

    const abortController = new AbortController();
    const window = Duration.fromObject({ days: PRICE_WINDOW }).as('seconds');
    const interval = Duration.fromObject({ days: 1 }).as('seconds');

    Promise.all(
      tokens.map((tokenAddress) =>
        tokenAddress in PRICE_CACHE
          ? Promise.resolve(PRICE_CACHE[tokenAddress])
          : runPriceModel(
              {
                slug: 'historical.run-model',
                input: {
                  model_slug: 'chainlink.price-usd',
                  model_input: { address: tokenAddress },
                  window: `${window} seconds`,
                  interval: `${interval} seconds`,
                },
                blockNumber,
              },
              abortController.signal,
            ).then((result) => {
              PRICE_CACHE[tokenAddress] = result.output.result;
              return result.output.result;
            }),
      ),
    )
      .then((resp) => {
        const map: Record<string, ModelSeriesOutput<TokenPrice>> = {};
        for (let i = 0; i < resp.length; i++) {
          map[tokens[i]] = resp[i];
        }

        setTokenPrices(map);
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        throw err;
      })
      .finally(() => {
        setPricesLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [runPriceModel, tokens, blockNumber]);

  useDeepCompareEffect(() => {
    setSharpeLoading(true);
    const abortController = new AbortController();
    function foo(
      tokenAddress: string,
      prices: ModelSeriesOutput<TokenPrice>,
    ): Promise<ModelSeriesOutput<SharpeRatio>> {
      return new Promise((resolve) => {
        // Oldest first
        const sortedPrices = [...prices.series].sort(
          (a, b) => b.blockNumber - a.blockNumber,
        );

        const modelInputs: Array<{
          token: { address: string };
          prices: ModelSeriesOutput<TokenPrice>;
          risk_free_rate: number;
        }> = [];
        for (let i = 0; i < SHARPE_WINDOW; i++) {
          const inputPrices = sortedPrices.slice(
            i,
            sortedPrices.length - SHARPE_WINDOW + i,
          );

          modelInputs.push({
            token: { address: tokenAddress },
            prices: {
              series: inputPrices,
              errors: [],
            },
            risk_free_rate: 0.02,
          });
        }

        runSharpeModel(
          {
            slug: 'compose.map-inputs',
            input: {
              modelSlug: 'finance.sharpe-ratio-token',
              modelInputs,
            },
          },
          abortController.signal,
        )
          .then((mapRes) => {
            resolve({
              series: mapRes.output.results.map((output, index) => ({
                blockNumber: modelInputs[index].prices.series[0].blockNumber,
                blockTimestamp:
                  modelInputs[index].prices.series[0].blockTimestamp,
                sampleTimestamp:
                  modelInputs[index].prices.series[0].sampleTimestamp,
                output: output.output,
              })),
              errors: [],
            });
          })
          .catch((err) => {
            if (abortController.signal.aborted) {
              return;
            }

            throw err;
          });
      });
    }

    Promise.all(
      Object.entries(tokenPrices).map(([tokenAddress, tokenPrice]) =>
        tokenAddress in SHARPE_RATIO_CACHE
          ? Promise.resolve(SHARPE_RATIO_CACHE[tokenAddress])
          : foo(tokenAddress, tokenPrice).then((sharpeRatio) => {
              SHARPE_RATIO_CACHE[tokenAddress] = sharpeRatio;
              return sharpeRatio;
            }),
      ),
    )
      .then(setSharpeRatios)
      .finally(() => {
        setSharpeLoading(false);
      });

    return () => abortController.abort();
  }, [runSharpeModel, tokenPrices]);

  const filterSharpeRatios = useDeepCompareMemo(() => {
    const filtered = sharpeRatios.filter((x) => {
      const hasFoundToken = x.series.some((v) => {
        return tokens
          .map((item) => item.toLocaleLowerCase())
          .includes(v.output.token_address);
      });

      return hasFoundToken && x;
    });
    return filtered;
  }, [sharpeRatios, tokens]);

  return {
    loading: pricesLoading || sharpeLoading,
    output: filterSharpeRatios,
  };
}

interface SharpeChartBoxProps {
  tokens: Token[];
}

export default function SharpeChartBox({ tokens }: SharpeChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);
  const { isFullScreen, toggleFullScreen } = useFullscreen(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const [selectedTokens, setSelectedTokens] = useState<string[]>(
    tokens.slice(0, 3).map((token) => token.address),
  );

  const model = useSharpeRatioModel(selectedTokens);
  const sharpeChart = useLineChart({
    lines: model.output.map((o, i) => ({
      color: colors[i],
      name:
        tokens.find((token) => token.address === selectedTokens[i])?.symbol ??
        '',
      data: o.series.map((i) => ({
        timestamp: new Date(i.sampleTimestamp * 1000),
        value: i.output.sharpe_ratio,
      })),
    })),
    loading: model.loading,
    error: '',
    formatter: 'number',
    fractionDigits: 2,
  });

  return (
    <BorderedCard ref={containerRef} display="flex" flexDirection="column">
      <ChartHeader
        title={'Sharpe Ratio'}
        tooltip={
          <Text>
            Sharpe ratio is a traditional measure of risk-adjusted returns, that
            allows the comparison of different assets and portfolios. In
            traditional finance, the following decision making is applied when
            using Sharpe ratio:
            <UnorderedList>
              <ListItem>Under 1.0 is considered bad</ListItem>
              <ListItem>1.0 is considered acceptable or good</ListItem>
              <ListItem>2.0 or higher is rated as very good</ListItem>
            </UnorderedList>
            <br />
            <Link
              href="https://docs.credmark.com/smart-money-in-defi/investment-concepts/sharpe-ratio-in-defi"
              isExternal
              textDecoration="underline"
              pb="1"
            >
              Read more about Sharpe Ratio in Credmark Wiki{' '}
              <Icon color="gray.300" as={OpenInNewIcon} />
            </Link>
          </Text>
        }
        downloadFileName={`Sharpe Ratio [Credmark].csv`}
        downloadFileHeaders={sharpeChart.csv.headers}
        downloadData={sharpeChart.csv.data}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
      />
      <Box overflowX="auto" py="2">
        <HStack>
          {selectedTokens.map((tokenAddress, index) => {
            const token = tokens.find(
              (token) => token.address === tokenAddress,
            );
            if (!token) throw Error('Invalid token address');

            return (
              <Box
                textAlign="center"
                px="4"
                py="2"
                key={token.address}
                role="group"
              >
                <HStack w="100%" justifyContent="center">
                  <CurrencyLogo currency={token} /> <Text>{token.symbol}</Text>{' '}
                  <CloseButton
                    size="sm"
                    opacity={0.5}
                    _groupHover={{ opacity: 1 }}
                    onClick={() =>
                      setSelectedTokens(
                        selectedTokens.filter(
                          (tokenAddress) => token.address !== tokenAddress,
                        ),
                      )
                    }
                  />
                </HStack>
                <HStack w="100%" justifyContent="center">
                  <Box w="4" h="4" rounded="full" bg={colors[index]} />
                  <Text fontSize="2xl">
                    {sharpeChart.currentStats?.[index]?.value ?? '-'}
                  </Text>
                </HStack>
              </Box>
            );
          })}
          {tokens.length > selectedTokens.length && selectedTokens.length < 5 && (
            <Box textAlign="center">
              <Text fontSize="xs" mb="2">
                Add Token
              </Text>
              <Menu>
                <MenuButton
                  as={IconButton}
                  rounded="full"
                  colorScheme="gray"
                  icon={<Icon as={AddIcon} />}
                ></MenuButton>
                <MenuList maxH="300px" overflowY="auto">
                  {tokens
                    .filter((token) => !selectedTokens.includes(token.address))
                    .sort((a, b) =>
                      (a.symbol ?? '')?.localeCompare(b.symbol ?? ''),
                    )
                    .map((token) => (
                      <MenuItem
                        key={token.address}
                        onClick={() => {
                          setSelectedTokens([...selectedTokens, token.address]);
                        }}
                      >
                        <HStack>
                          <CurrencyLogo currency={token} />{' '}
                          <Text>{token.symbol}</Text>
                        </HStack>
                      </MenuItem>
                    ))}
                </MenuList>
              </Menu>
            </Box>
          )}
        </HStack>
      </Box>
      <HistoricalChart
        flex="1"
        height={600}
        onChartReady={(chart) => (chartRef.current = chart)}
        durations={[30, 60, 90]}
        defaultDuration={30}
        isFullScreen={isFullScreen}
        {...sharpeChart}
      />
    </BorderedCard>
  );
}
