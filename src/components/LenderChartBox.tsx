import { Box, HStack, Flex, Text, Center, Img, Icon } from '@chakra-ui/react';
import useSize from '@react-hook/size';
import { EChartsInstance } from 'echarts-for-react';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { IoExpandSharp } from 'react-icons/io5';

import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { AssetKey, MetricInfo } from '~/types/terminal';

import InfoPopover from './InfoPopover';
import { ASSETS } from './RiskTerminal/constants';
import HistoricalChart from './RiskTerminal/helpers/HistoricalChart';

interface LenderChartBoxProps {
  metric: MetricInfo;
  activeAssets: AssetKey[];
  lcrData: Record<AssetKey, ReturnType<typeof useLcrData>>;
  varData: Record<AssetKey, ReturnType<typeof useVarData>>;
  onExpand: () => void;
}

export default function LenderChartBox({
  metric,
  activeAssets,
  lcrData,
  varData,
  onExpand,
}: LenderChartBoxProps) {
  const chartRef = useRef<EChartsInstance>();
  const containerRef = useRef(null);

  const [containerWidth] = useSize(containerRef);

  useLayoutEffect(() => {
    chartRef.current?.resize();
  }, [containerWidth]);

  const chartLines = useMemo(() => {
    const lines: Array<{
      name: string;
      color: string;
      data: Array<{
        timestamp: Date;
        value: number;
      }>;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (lcrData[asset.key].loading || varData[asset.key].loading) {
        continue;
      }

      const lcrDataPoints = lcrData[asset.key].data ?? [];
      const varDataPoints = varData[asset.key].data ?? [];

      const lineData = metric.chartLine(lcrDataPoints, varDataPoints);

      lines.push({
        name: `${asset.title} - ${metric.label}`,
        color: asset.color.toString(),
        data: lineData,
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

  return (
    <Box ref={containerRef} rounded="md" border="1px" borderColor="gray.200">
      <HStack
        bg="#D8D8D8"
        px="4"
        py="2"
        roundedTop="md"
        borderBottom="2px"
        borderColor="gray.200"
      >
        <Text>{metric.label} </Text>
        {metric.tooltip && <InfoPopover>{metric.tooltip}</InfoPopover>}
        <Box flex="1" />
        <Icon cursor="pointer" onClick={onExpand} as={IoExpandSharp} />
      </HStack>
      <Flex bg="white" roundedBottom="md">
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
                  <Img src={asset.logo} />
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
        <Box flex="1">
          <HistoricalChart
            lines={chartLines}
            loading={
              !!Object.values(lcrData).find(({ loading }) => loading) ||
              !!Object.values(varData).find(({ loading }) => loading)
            }
            formatValue={metric.formatValue}
            onChartReady={(chart) => (chartRef.current = chart)}
          />
        </Box>
      </Flex>
    </Box>
  );
}
