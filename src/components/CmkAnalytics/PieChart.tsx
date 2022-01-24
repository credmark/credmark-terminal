import { Box, HStack, Text } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo } from 'react';

import { CmkAnalyticsDataPoint } from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface PieChartProps {
  data: CmkAnalyticsDataPoint;
}

export default function PieChart({ data }: PieChartProps): JSX.Element {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `
                <div style="display: flex; margin-bottom: 2px;">
                  <div>${params.marker}</div>
                  <div style="flex: 1">${params.name}</div>
                  <strong style="margin-left: 16px">${shortenNumber(
                    params.value,
                    1,
                  )} CMK</strong>
                </div>
                `;
        },
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: data.supply_distribution.community_treasury,
              name: 'Community Rewards',
            },
            {
              value: data.supply_distribution.dao_treasury,
              name: 'DAO Treasury',
            },
            {
              value: data.supply_distribution.investor,
              name: 'Investors',
            },
            {
              value: data.supply_distribution.team_allocated,
              name: 'Team & Founders',
            },
            {
              value: data.supply_distribution.team_unallocated,
              name: 'Team Unallocated',
            },
            {
              value: data.supply_distribution.vesting_unallocated,
              name: 'Vesting Unallocated',
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [
    data.supply_distribution.community_treasury,
    data.supply_distribution.dao_treasury,
    data.supply_distribution.investor,
    data.supply_distribution.team_allocated,
    data.supply_distribution.team_unallocated,
    data.supply_distribution.vesting_unallocated,
  ]);

  return (
    <Box>
      <HStack mx="8" justify="space-between">
        <Text
          textAlign="center"
          fontSize="xl"
          bg="purple.500"
          color="white"
          px="4"
          rounded="md"
        >
          Supply Distribution
        </Text>
        <Text
          textAlign="center"
          fontSize="2xl"
          borderColor="purple.500"
          border="1px"
          color="purple.500"
          px="4"
          rounded="md"
        >
          Circulating Supply {shortenNumber(Number(data.circulating_supply), 1)}{' '}
          CMK
        </Text>
      </HStack>
      <Box position="relative">
        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{
            height: '360px',
          }}
        />
      </Box>
    </Box>
  );
}
