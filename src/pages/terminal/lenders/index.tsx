import {
  Box,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Link,
  Switch,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { LenderChartBox } from '~/components/pages/Terminal';
import SEOHeader from '~/components/shared/SEOHeader';
import { ASSETS } from '~/constants/terminal';
import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { useActiveWeb3React } from '~/hooks/web3';
import { AssetKey, MetricInfo, MetricKey } from '~/types/terminal';
import { shortenNumber } from '~/utils/formatTokenAmount';

const METRICS: MetricInfo[] = [
  {
    key: 'VAR',
    label: 'Value at Risk (VaR)',
    tooltip: (
      <Text>
        VaR is a numerical measure of market risk for a given portfolio; our
        model&apos;s numerical output represents a worst-case loss for a given
        portfolio over a given holding period. We apply VaR to a platform by
        using total borrows minus total deposits in each token as the portfolio.{' '}
        <br />
        <br />
        <Link
          href="https://docs.credmark.com/credmark-wiki/analytics/metrics/value-at-risk-var"
          isExternal
          textDecoration="underline"
          pb="1"
          aria-label="Read more about VaR in Credmark Wiki"
        >
          Read more about VaR in Credmark Wiki <Icon as={FaExternalLinkAlt} />
        </Link>
      </Text>
    ),
    chartLine: (_, varDataPoints) =>
      varDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value: Number(dp['10_day_99p']) * -1e9,
        }))
        .reverse(),
    currentValue: (_, dp) => Number(dp['10_day_99p']) * -1e9,
    formatValue: (val) => '$' + shortenNumber(val, 1),
  },
  {
    key: 'LCR',
    label: 'Liquidity Coverage Ratio (LCR)',
    tooltip: (
      <Text>
        LCR measures liquidity risk, defined as the proportion of highly liquid
        assets held by an organization to ensure that they maintain an ongoing
        ability to meet their short-term obligations (cash outflows for 30 days)
        in a stress situation. <br />
        <br />
        <Link
          href="https://docs.credmark.com/credmark-wiki/analytics/metrics/liquidity-coverage-ratio-lcr"
          isExternal
          textDecoration="underline"
          pb="1"
          aria-label="Read more about LCR in Credmark Wiki"
        >
          Read more about LCR in Credmark Wiki <Icon as={FaExternalLinkAlt} />
        </Link>
      </Text>
    ),
    chartLine: (lcrDataPoints) =>
      lcrDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value: dp.lcr * 100,
        }))
        .reverse(),
    currentValue: (dp) => dp.lcr * 100,
    formatValue: (val) => val.toFixed(1) + '%',
  },
  {
    key: 'VTL',
    label: 'VaR/TL',
    tooltip:
      'VaR / Total Liabilities (TL) expresses the value at risk as a percentage of the total dollar value of deposits into the protocol.',
    chartLine: (_, varDataPoints) =>
      varDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value:
            ((Number(dp['10_day_99p']) * -1e9) / dp['total_liabilities']) * 100,
        }))
        .reverse(),
    currentValue: (_, dp) =>
      ((Number(dp['10_day_99p']) * -1e9) / dp['total_liabilities']) * 100,
    formatValue: (val) => val.toFixed(1) + '%',
  },

  {
    key: 'TL',
    label: 'Total Liabilities (TL)',
    tooltip: 'Total Dollar value of tokens deposited into the protocol.',
    chartLine: (_, varDataPoints) =>
      varDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value: Number(dp['total_liabilities']),
        }))
        .reverse(),
    currentValue: (_, dp) => Number(dp['total_liabilities']),
    formatValue: (val) => `$${shortenNumber(val, 1)}`,
    chartType: 'area',
  },
  {
    key: 'TA',
    label: 'Total Assets (TA)',
    tooltip: 'Total Dollar value of tokens borrowed from the protocol.',
    chartLine: (_, varDataPoints) =>
      varDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value: Number(dp['total_assets']),
        }))
        .reverse(),
    currentValue: (_, dp) => Number(dp['total_assets']),
    formatValue: (val) => `$${shortenNumber(val, 1)}`,
    chartType: 'area',
  },
  {
    key: 'MC',
    label: 'Market Cap (MC)',
    tooltip: "Current market capitalization of the protocol's native token.",
    chartLine: (lcrDataPoints) =>
      lcrDataPoints
        .map((dp) => ({
          timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
          value: Number(dp['market_cap']),
        }))
        .reverse(),
    currentValue: (dp) => Number(dp['market_cap']),
    formatValue: (val) => `$${shortenNumber(val, 1)}`,
    chartType: 'area',
  },
];

export default function LendersPage() {
  const { chainId } = useActiveWeb3React();

  const onMainnet = chainId === 1;

  const [activeAssets, setActiveAssets] = useState<AssetKey[]>([
    'AAVEV2',
    'COMPOUND',
  ]);

  const [expandedMetric, setExpandedMetric] = useState<MetricKey>();

  const dummy = !onMainnet;

  const lcrData: Record<AssetKey, ReturnType<typeof useLcrData>> = {
    AAVEV2: useLcrData('AAVEV2', 90, dummy),
    COMPOUND: useLcrData('COMPOUND', 90, dummy),
  };

  const varData: Record<AssetKey, ReturnType<typeof useVarData>> = {
    AAVEV2: useVarData('AAVEV2', 90, dummy),
    COMPOUND: useVarData('COMPOUND', 90, dummy),
  };

  return (
    <>
      <SEOHeader title="Lenders - Credmark Terminal" />
      <Box p="8">
        <HStack spacing="8">
          {ASSETS.map((asset) => (
            <HStack key={asset.key}>
              <Box w="6">
                <Img src={asset.logo} alt={asset.title || 'Credmark'} />
              </Box>
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
          {METRICS.map((metric) => (
            <GridItem
              key={metric.key}
              minW="0"
              colSpan={expandedMetric === metric.key ? 2 : 1}
            >
              <LenderChartBox
                metric={metric}
                activeAssets={activeAssets}
                lcrData={lcrData}
                varData={varData}
                onExpand={() =>
                  expandedMetric === metric.key
                    ? setExpandedMetric(undefined)
                    : setExpandedMetric(metric.key)
                }
                isExpanded={expandedMetric === metric.key}
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
    </>
  );
}
