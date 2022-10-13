import {
  Box,
  Grid,
  GridItem,
  HStack,
  Link,
  Switch,
  Text,
} from '@chakra-ui/react';
import { DateTime, Duration } from 'luxon';
import React, { useState } from 'react';

import LenderChartBox from '~/components/pages/Terminal/LenderChartBox';
import SEOHeader from '~/components/shared/SEOHeader';
import { ASSETS } from '~/constants/terminal';
import { useLineChart } from '~/hooks/useChart';
import useExpander from '~/hooks/useExpander';
import { useModelRunner } from '~/hooks/useModel';
import { AssetKey, MetricKey } from '~/types/terminal';

interface BlockNumberOutput {
  blockNumber: number;
  blockTimestamp: number;
  sampleTimestamp: number;
}

interface VarOutput {
  cvar: number[];
  var: number;
  total_value: number;
  value_list: Array<{
    token: { address: string };
    amount: number;
    price: number;
    value: number;
  }>;
}

interface PortfolioOutput {
  tvl: number;
  net_value: number;
  debt_value: number;
  supply_value: number;
}

export default function LendersPage() {
  const [activeAssets, setActiveAssets] = useState<AssetKey[]>([
    'AAVEV2',
    'COMPOUND',
  ]);

  const expander = useExpander<MetricKey>();

  const blockNumberModel = useModelRunner<BlockNumberOutput>({
    slug: 'uni/rpc.get-blocknumber',
    input: { timestamp: DateTime.utc().startOf('day').toSeconds() },
  });

  const varModel = {
    AAVEV2: useModelRunner<VarOutput>({
      slug: 'lenders/finance.var-aave',
      input: {},
      window: Duration.fromObject({ days: 90 }),
      interval: Duration.fromObject({ days: 1 }),
      suspended: !blockNumberModel.output,
      blockNumber: blockNumberModel.output?.blockNumber,
    }),
    COMPOUND: useModelRunner<VarOutput>({
      slug: 'lenders/finance.var-compound',
      input: {},
      window: Duration.fromObject({ days: 90 }),
      interval: Duration.fromObject({ days: 1 }),
      suspended: !blockNumberModel.output,
      blockNumber: blockNumberModel.output?.blockNumber,
    }),
  };

  const portfolioModel = {
    AAVEV2: useModelRunner<PortfolioOutput>({
      slug: 'lenders/aave-v2.lending-pool-assets-portfolio',
      input: {},
      window: Duration.fromObject({ days: 90 }),
      interval: Duration.fromObject({ days: 1 }),
      suspended: !blockNumberModel.output,
      blockNumber: blockNumberModel.output?.blockNumber,
    }),
    COMPOUND: useModelRunner<PortfolioOutput>({
      slug: 'lenders/compound-v2.all-pools-portfolio',
      input: {},
      window: Duration.fromObject({ days: 90 }),
      interval: Duration.fromObject({ days: 1 }),
      suspended: !blockNumberModel.output,
      blockNumber: blockNumberModel.output?.blockNumber,
    }),
  };

  const charts: Array<{
    key: MetricKey;
    label: string;
    tooltip: React.ReactNode;
    chartData: ReturnType<typeof useLineChart>;
    isAreaChart?: boolean;
  }> = [
    {
      key: 'VAR',
      label: 'Value at Risk (VaR)',
      tooltip: (
        <Text>
          VaR is a numerical measure of market risk for a given portfolio; our
          model&apos;s numerical output represents a worst-case loss for a given
          portfolio over a given holding period. We apply VaR to a platform by
          using total borrows minus total deposits in each token as the
          portfolio. <br />
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
        </Text>
      ),
      chartData: useLineChart({
        loading:
          blockNumberModel.loading ||
          varModel['AAVEV2'].loading ||
          varModel['COMPOUND'].loading,
        lines: ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
          (asset) => ({
            name: `${asset.title} - VaR`,
            icon: asset.logo,
            color: asset.color.toString(),
            data:
              varModel[asset.key].output?.series.map((item) => ({
                timestamp: new Date(item.sampleTimestamp * 1000),
                value: item.output.var * -1,
              })) ?? [],
          }),
        ),
        formatter: 'currency',
        fractionDigits: 2,
        error:
          varModel['AAVEV2'].errorMessage ?? varModel['COMPOUND'].errorMessage,
      }),
    },
    // {
    //   key: 'LCR',
    //   label: 'Liquidity Coverage Ratio (LCR)',
    //   tooltip: (
    //     <Text>
    //       LCR measures liquidity risk, defined as the proportion of highly
    //       liquid assets held by an organization to ensure that they maintain an
    //       ongoing ability to meet their short-term obligations (cash outflows
    //       for 30 days) in a stress situation. <br />
    //       <br />
    //       <Link
    //         href="https://docs.credmark.com/dealing-with-risks/liquidity-risk/liquidity-coverage-ratio-lcr"
    //         isExternal
    //         textDecoration="underline"
    //         pb="1"
    //         aria-label="Read more about LCR in Credmark Wiki"
    //       >
    //         Read more about LCR in Credmark Wiki →
    //       </Link>
    //     </Text>
    //   ),
    // },
    {
      key: 'VTL',
      label: 'VaR/TL',
      tooltip:
        'VaR / Total Liabilities (TL) expresses the value at risk as a percentage of the total dollar value of deposits into the protocol.',
      chartData: useLineChart({
        loading:
          blockNumberModel.loading ||
          varModel['AAVEV2'].loading ||
          varModel['COMPOUND'].loading ||
          portfolioModel['AAVEV2'].loading ||
          portfolioModel['COMPOUND'].loading,
        lines: ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
          (asset) => ({
            name: `${asset.title} - VaR/TL`,
            icon: asset.logo,
            color: asset.color.toString(),
            data:
              portfolioModel[asset.key].output && varModel[asset.key].output
                ? portfolioModel[asset.key].output?.series.map(
                    (portfolioItem) => {
                      const varItem = varModel[asset.key].output?.series.find(
                        (item) =>
                          item.sampleTimestamp ===
                          portfolioItem.sampleTimestamp,
                      )?.output;

                      return {
                        timestamp: new Date(
                          portfolioItem.sampleTimestamp * 1000,
                        ),
                        value:
                          !varItem || !portfolioItem.output.tvl
                            ? 0
                            : (-varItem.var * 100) / portfolioItem.output.tvl,
                      };
                    },
                  ) ?? []
                : [],
          }),
        ),
        formatter: 'percent',
        fractionDigits: 2,
        error:
          varModel['AAVEV2'].errorMessage ??
          varModel['COMPOUND'].errorMessage ??
          portfolioModel['AAVEV2'].errorMessage ??
          portfolioModel['COMPOUND'].errorMessage,
      }),
    },
    {
      key: 'TL',
      label: 'Total Liabilities (TL)',
      tooltip: 'Total Dollar value of tokens deposited into the protocol.',
      isAreaChart: true,
      chartData: useLineChart({
        loading:
          blockNumberModel.loading ||
          portfolioModel['AAVEV2'].loading ||
          portfolioModel['COMPOUND'].loading,
        lines: ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
          (asset) => ({
            name: `${asset.title} - TL`,
            icon: asset.logo,
            color: asset.color.toString(),
            data:
              portfolioModel[asset.key].output?.series.map((item) => ({
                timestamp: new Date(item.sampleTimestamp * 1000),
                value: item.output.tvl,
              })) ?? [],
          }),
        ),
        formatter: 'currency',
        fractionDigits: 2,
        error:
          portfolioModel['AAVEV2'].errorMessage ??
          portfolioModel['COMPOUND'].errorMessage,
      }),
    },
    {
      key: 'TA',
      label: 'Total Assets (TA)',
      tooltip: 'Total Dollar value of tokens borrowed from the protocol.',
      isAreaChart: true,
      chartData: useLineChart({
        loading:
          blockNumberModel.loading ||
          portfolioModel['AAVEV2'].loading ||
          portfolioModel['COMPOUND'].loading,
        lines: ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
          (asset) => ({
            name: `${asset.title} - TL`,
            icon: asset.logo,
            color: asset.color.toString(),
            data:
              portfolioModel[asset.key].output?.series.map((item) => ({
                timestamp: new Date(item.sampleTimestamp * 1000),
                value: item.output.debt_value,
              })) ?? [],
          }),
        ),
        formatter: 'currency',
        fractionDigits: 2,
        error:
          portfolioModel['AAVEV2'].errorMessage ??
          portfolioModel['COMPOUND'].errorMessage,
      }),
    },
    {
      key: 'MC',
      label: 'Market Cap (MC)',
      tooltip: "Current market capitalization of the protocol's native token.",
      isAreaChart: true,
      chartData: useLineChart({
        loading:
          blockNumberModel.loading ||
          portfolioModel['AAVEV2'].loading ||
          portfolioModel['COMPOUND'].loading,
        lines: ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
          (asset) => ({
            name: `${asset.title} - TL`,
            icon: asset.logo,
            color: asset.color.toString(),
            data:
              portfolioModel[asset.key].output?.series.map((item) => ({
                timestamp: new Date(item.sampleTimestamp * 1000),
                value: item.output.supply_value,
              })) ?? [],
          }),
        ),
        formatter: 'currency',
        fractionDigits: 2,
        error:
          portfolioModel['AAVEV2'].errorMessage ??
          portfolioModel['COMPOUND'].errorMessage,
      }),
    },
  ];

  return (
    <>
      <SEOHeader title="Lenders" />
      <Box p="8">
        <HStack spacing="8">
          {ASSETS.map((asset) => (
            <HStack key={asset.key}>
              <Box w="6">{asset.logo}</Box>
              <Text>{asset.title}</Text>
              <Switch
                colorScheme="green"
                isChecked={activeAssets.includes(asset.key)}
                onChange={(event) => {
                  if (event.target.checked) {
                    setActiveAssets([...activeAssets, asset.key]);
                  } else {
                    setActiveAssets(
                      activeAssets.filter((aa) => aa !== asset.key),
                    );
                  }
                }}
              />
            </HStack>
          ))}
        </HStack>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="8"
          mt="6"
          mb="16"
        >
          {charts.map((chart) => (
            <GridItem
              key={chart.key}
              ref={expander.refByKey(chart.key)}
              minW="0"
              colSpan={expander.isExpanded(chart.key) ? 2 : 1}
            >
              <LenderChartBox
                label={chart.label}
                tooltip={chart.tooltip}
                chartData={chart.chartData}
                isExpanded={expander.isExpanded(chart.key)}
                onExpand={() => expander.onExpand(chart.key)}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
