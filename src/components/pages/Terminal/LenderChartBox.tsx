import { Box, Center, Flex, HStack, Img, Text } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useMemo, useRef } from 'react';

import ChartHeader from '~/components/shared/Charts/ChartHeader';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import { ASSETS } from '~/constants/terminal';
import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { ChartLine, CsvRow } from '~/types/chart';
import { AssetKey, MetricInfo } from '~/types/terminal';

interface LenderChartBoxProps {
  metric: MetricInfo;
  activeAssets: AssetKey[];
  lcrData: Record<AssetKey, ReturnType<typeof useLcrData>>;
  varData: Record<AssetKey, ReturnType<typeof useVarData>>;
  onExpand: () => void;
  isExpanded: boolean;
}

export default function LenderChartBox({
  metric,
  activeAssets,
  lcrData,
  varData,
  onExpand,
  isExpanded,
}: LenderChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const chartLines = useMemo(() => {
    const lines: Array<ChartLine> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (lcrData[asset.key].loading || varData[asset.key].loading) {
        continue;
      }

      const lcrDataPoints = lcrData[asset.key].data ?? [];
      const varDataPoints = varData[asset.key].data ?? [];

      lines.push({
        name: `${asset.title} - ${metric.label}`,
        color: asset.color.toString(),
        data: metric.chartLine(lcrDataPoints, varDataPoints),
      });
    }

    return lines;
  }, [activeAssets, lcrData, metric, varData]);

  const currentStats = useMemo(() => {
    const tls: Record<AssetKey, string> = {
      AAVEV2: '-',
      COMPOUND: '-',
    };

    for (const asset of ASSETS) {
      if (lcrData[asset.key].loading || varData[asset.key].loading) continue;

      const latestLcrDataPoint = (lcrData[asset.key].data ?? []).sort(
        (a, b) => b.ts - a.ts,
      )[0];
      const latestVarDataPoint = (varData[asset.key].data ?? []).sort(
        (a, b) => b.ts - a.ts,
      )[0];

      if (latestLcrDataPoint && latestVarDataPoint) {
        tls[asset.key] = metric.formatValue(
          metric.currentValue(latestLcrDataPoint, latestVarDataPoint),
        );
      }
    }

    return tls;
  }, [lcrData, metric, varData]);

  const loading =
    !!Object.values(lcrData).find(({ loading }) => loading) ||
    !!Object.values(varData).find(({ loading }) => loading);

  const csv = useMemo(() => {
    const csvDataTsMap: Record<
      string,
      Array<{ key: string; value: string }>
    > = {};

    const headers = ['Timestamp'];
    for (const cl of chartLines) {
      headers.push(cl.name);
      for (const dp of cl.data) {
        const MS_IN_1_HOUR = 3600 * 1000;
        const ts = new Date(
          Math.round(dp.timestamp.valueOf() / MS_IN_1_HOUR) * MS_IN_1_HOUR,
        ).toISOString();

        if (!(ts in csvDataTsMap)) {
          csvDataTsMap[ts] = [];
        }

        csvDataTsMap[ts].push({
          key: cl.name,
          value: metric.formatValue(dp.value),
        });
      }
    }

    const data: Array<CsvRow> = [];
    for (const ts in csvDataTsMap) {
      data.push({
        Timestamp: ts,
        ...csvDataTsMap[ts].reduce(
          (curr, prev) => ({ ...curr, [prev.key]: prev.value }),
          {},
        ),
      });
    }

    return { data, headers };
  }, [chartLines, metric]);

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
        title={metric.label}
        toggleExpand={onExpand}
        isExpanded={isExpanded}
        downloadCsv={{
          filename: `${metric.label.replaceAll(' ', '_')}[Credmark].csv`,
          ...csv,
        }}
        tooltip={{ status: 'info', content: metric.tooltip }}
      />

      <Flex bg="white" roundedBottom="md">
        {!isExpanded && (
          <Flex
            direction="column"
            alignSelf="stretch"
            borderRight="2px"
            borderColor="gray.200"
          >
            {ASSETS.map((asset, assetIndex) => (
              <Center
                textAlign="center"
                key={asset.key}
                flex="1"
                p="4"
                borderBottom={assetIndex < ASSETS.length - 1 ? '2px' : 0}
                borderColor="gray.200"
                flexDirection="column"
              >
                <HStack opacity={activeAssets.includes(asset.key) ? 1 : 0.4}>
                  <Box w="6">
                    <Img src={asset.logo} alt={asset.title || 'Credmark'} />
                  </Box>
                  <Text>{asset.title}</Text>
                </HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="500"
                  mt="1"
                  opacity={activeAssets.includes(asset.key) ? 1 : 0.4}
                >
                  {currentStats[asset.key]}
                </Text>
              </Center>
            ))}
          </Flex>
        )}
        <HistoricalChart
          flex="1"
          lines={chartLines}
          loading={loading}
          formatValue={metric.formatValue}
          onChartReady={(chart) => (chartRef.current = chart)}
          isAreaChart={metric.chartType === 'area'}
          durations={[30, 60, 90]}
          defaultDuration={30}
          showCurrentStats={isExpanded}
          currentStats={ASSETS.map((asset) => ({
            label: (
              <HStack
                opacity={activeAssets.includes(asset.key) ? 1 : 0.4}
                mx="2"
              >
                <Box w="6">
                  <Img src={asset.logo} alt={asset.title || 'Credmark'} />
                </Box>
                <Text>{asset.title}</Text>
              </HStack>
            ),
            value: String(currentStats[asset.key]),
          }))}
        />
      </Flex>
    </Box>
  );
}
