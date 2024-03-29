import {
  Box,
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
import useSize from '@react-hook/size';
import Color from 'color';
import { EChartsInstance } from 'echarts-for-react';
import { DateTime, Duration } from 'luxon';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { BsXLg, BsPlusLg } from 'react-icons/bs';

import { Card } from '~/components/base';
import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import CurrencyLogo from '~/components/shared/CurrencyLogo';
import Stat from '~/components/shared/Stat';
import { useLineChart } from '~/hooks/useChart';
import { useDeepCompareEffect } from '~/hooks/useDeepCompare';
import useFullscreen from '~/hooks/useFullscreen';
import { useModelRunner, useModelRunnerCallback } from '~/hooks/useModel';
import { ModelSeriesOutput } from '~/types/model';
import { ExtendedCurrency } from '~/utils/currency';

const PRICE_CACHE: Record<string, ModelSeriesOutput<TokenPrice>> = {};
const SHARPE_RATIO_CACHE: Record<string, ModelSeriesOutput<SharpeRatio>> = {};

const tokenKey = (token: ExtendedCurrency) =>
  `${token.chainId}_${token.isNative ? token.symbol : token.address}`;

interface TokenPrice {
  price: number;
  src?: string | undefined;
}

const colors = ['#00FFB3', '#00ADFF', '#9800FF', '#FF004E', '#FF9700'];

interface SharpeRatio {
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

function useSharpeRatioModel(tokens: ExtendedCurrency[]) {
  const [pricesLoading, setPricesLoading] = useState(false);
  const [sharpeLoading, setSharpeLoading] = useState(false);

  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    slug: 'sharpe/rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const blockNumber = blockNumberModel.output?.blockNumber;

  const runPriceModel = useModelRunnerCallback<ModelSeriesOutput<TokenPrice>>();
  const runSharpeModel = useModelRunnerCallback<{
    results: Array<{ output: SharpeRatio }>;
  }>();

  const [tokenPrices, setTokenPrices] = useState<
    Array<{ token: ExtendedCurrency; price: ModelSeriesOutput<TokenPrice> }>
  >([]);

  const [sharpeRatios, setSharpeRatios] = useState<
    ModelSeriesOutput<SharpeRatio>[]
  >([]);

  const PRICE_WINDOW = 180;
  const SHARPE_WINDOW = 90;

  useDeepCompareEffect(() => {
    if (!blockNumber) return;
    setPricesLoading(true);

    const abortController = new AbortController();
    const window = (token: ExtendedCurrency) =>
      Duration.fromObject({
        days: Math.min(
          PRICE_WINDOW,
          Math.floor(
            (Date.now().valueOf() -
              (token.isToken && token.createdAt
                ? token.createdAt.valueOf()
                : 0)) /
              (24 * 3600 * 1000),
          ),
        ),
      });

    const interval = Duration.fromObject({ days: 1 });

    Promise.all(
      tokens.map((token) =>
        tokenKey(token) in PRICE_CACHE
          ? Promise.resolve(PRICE_CACHE[tokenKey(token)])
          : runPriceModel(
              {
                slug: 'historical.run-model',
                input: {
                  model_slug: token.priceEns
                    ? 'sharpe/chainlink.price-by-ens'
                    : 'sharpe/price.quote',
                  model_input: token.priceEns
                    ? { domain: token.priceEns }
                    : {
                        base: token.isNative
                          ? { symbol: token.symbol }
                          : { address: token.address },
                      },
                  window: `${window(token).as('days')} days`,
                  interval: `${interval.as('days')} days`,
                },
                blockNumber,
              },
              abortController.signal,
            ).then((result) => {
              if (!abortController.signal.aborted && result?.output) {
                PRICE_CACHE[tokenKey(token)] = result.output;
              }

              return result.output;
            }),
      ),
    )
      .then((resp) => {
        const list: typeof tokenPrices = [];
        for (let i = 0; i < resp.length; i++) {
          list.push({ token: tokens[i], price: resp[i] });
        }

        setTokenPrices(list);
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

    function computeSharpeRatio(
      prices: ModelSeriesOutput<TokenPrice>,
    ): Promise<ModelSeriesOutput<SharpeRatio>> {
      return new Promise((resolve) => {
        if (prices.errors && prices.errors.length > 0) {
          resolve({ errors: prices.errors, series: [] });
          return;
        }

        // Oldest to newest
        const sortedPrices = [...prices.series].sort(
          (a, b) => a.blockNumber - b.blockNumber,
        );

        const modelInputs: Array<{
          token: { address?: string; symbol?: string };
          prices: ModelSeriesOutput<TokenPrice>;
          risk_free_rate: number;
        }> = [];

        const sharpeWindow = Math.min(SHARPE_WINDOW, sortedPrices.length - 10);
        for (
          let end = sortedPrices.length;
          end > sortedPrices.length - sharpeWindow;
          end--
        ) {
          const inputPrices = sortedPrices.slice(
            Math.max(0, end - sharpeWindow),
            end,
          );

          modelInputs.push({
            // Just a placeholder address not being used in the model
            token: { address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
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
              modelSlug: 'sharpe/finance.sharpe-ratio-token',
              modelInputs,
            },
          },
          abortController.signal,
        )
          .then((mapRes) => {
            resolve({
              series: mapRes.output.results.map((output) => ({
                blockNumber: output.output.block_number,
                blockTimestamp: output.output.blockTimestamp,
                sampleTimestamp: output.output.blockTimestamp,
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
      tokenPrices.map(({ token, price }) =>
        tokenKey(token) in SHARPE_RATIO_CACHE
          ? Promise.resolve(SHARPE_RATIO_CACHE[tokenKey(token)])
          : computeSharpeRatio(price).then((sharpeRatio) => {
              if (!abortController.signal.aborted && sharpeRatio) {
                SHARPE_RATIO_CACHE[tokenKey(token)] = sharpeRatio;
              }

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

  return {
    loading: blockNumberModel.loading || pricesLoading || sharpeLoading,
    output: sharpeRatios,
  };
}

interface SharpeChartBoxProps {
  tokens: ExtendedCurrency[];
  defaultTokens?: ExtendedCurrency[];
}

export default function SharpeChartBox({
  tokens,
  defaultTokens = [],
}: SharpeChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);
  const { isFullScreen, toggleFullScreen } = useFullscreen(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const [selectedTokens, setSelectedTokens] = useState(defaultTokens);

  const model = useSharpeRatioModel(selectedTokens);
  const sharpeChart = useLineChart({
    lines: model.output.map((o, i) => ({
      color: colors[i],
      name:
        tokens.find(
          (token) => selectedTokens[i] && token.equals(selectedTokens[i]),
        )?.symbol ?? '',
      data:
        o.errors && o.errors.length > 1
          ? []
          : o.series.map((i) => ({
              timestamp: new Date(i.sampleTimestamp * 1000),
              value: i.output.sharpe_ratio,
            })),
      error: o.errors && o.errors.length > 1 ? o.errors[0].error.message : '',
    })),
    loading: model.loading,
    error: '',
    formatter: 'number',
    fractionDigits: 2,
  });

  return (
    <Card ref={containerRef} display="flex" flexDirection="column">
      <ChartHeader
        title={'Sharpe Ratio'}
        tooltip={{
          content: (
            <Box>
              Sharpe ratio is a traditional measure of risk-adjusted returns,
              that allows the comparison of different assets and portfolios. In
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
                Read more about Sharpe Ratio in Credmark Wiki →
              </Link>
            </Box>
          ),
        }}
        downloadCsv={{
          filename: `Sharpe Ratio [Credmark].csv`,
          ...sharpeChart.csv,
        }}
        isExpanded={isFullScreen}
        toggleExpand={toggleFullScreen}
      />
      <Box overflowX="auto" px="2">
        <HStack spacing="8">
          {selectedTokens.map((selectedToken, index) => {
            const token = tokens.find((token) => token.equals(selectedToken));
            if (!token) throw Error('Invalid token address');

            return (
              <Stat
                key={token.symbol}
                icon={<CurrencyLogo currency={token} size={32} />}
                label={token.symbol}
                value={sharpeChart.currentStats?.[index]?.value ?? '-'}
                highlightColor={Color(colors[index]).fade(0.5).toString()}
                _hover={{
                  icon: (
                    <IconButton
                      size="sm"
                      icon={<Icon as={BsXLg} />}
                      aria-label="Remove"
                      colorScheme="red"
                      rounded="full"
                    />
                  ),
                }}
                onClick={() =>
                  setSelectedTokens(
                    selectedTokens.filter(
                      (selectedToken) => !token.equals(selectedToken),
                    ),
                  )
                }
              />
            );
          })}
          {tokens.length > selectedTokens.length && selectedTokens.length < 5 && (
            <Menu>
              <MenuButton as={HStack} role="group" cursor="pointer">
                <HStack spacing="2">
                  <IconButton
                    size="sm"
                    icon={<Icon as={BsPlusLg} />}
                    aria-label="Add"
                    colorScheme="gray"
                    rounded="full"
                    _groupHover={{ bg: 'gray.200' }}
                  />
                  <Text
                    textAlign="left"
                    fontWeight={300}
                    lineHeight="1.2"
                    fontSize="sm"
                  >
                    Add
                    <br />
                    Token
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList maxH="300px" overflowY="auto">
                {tokens
                  .filter(
                    (token) =>
                      !selectedTokens.find((selectedToken) =>
                        selectedToken.equals(token),
                      ),
                  )
                  .sort((a, b) =>
                    (a.symbol ?? '')?.localeCompare(b.symbol ?? ''),
                  )
                  .map((token) => (
                    <MenuItem
                      key={token.symbol}
                      onClick={() => {
                        setSelectedTokens([...selectedTokens, token]);
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
          )}
        </HStack>
      </Box>
      <HistoricalChart
        flex="1"
        height={600}
        onChartReady={(chart) => (chartRef.current = chart)}
        durations={[30, 60, 90]}
        defaultDuration={90}
        isFullScreen={isFullScreen}
        {...sharpeChart}
      />
    </Card>
  );
}
