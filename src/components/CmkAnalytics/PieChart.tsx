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
          radius: ['0%', '40%'],
          label: {
            position: 'inner',
            fontSize: 10,
            fontWeight: 900,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value:
                1e8 -
                (Number(data.supply_distribution.community_treasury) +
                  Number(data.supply_distribution.dao_treasury) +
                  Number(data.supply_distribution.investor) +
                  Number(data.supply_distribution.team_allocated) +
                  Number(data.supply_distribution.team_unallocated) +
                  Number(data.supply_distribution.vesting_unallocated)),
              itemStyle: { color: '#F2005F' },
              name: 'Public',
            },
            {
              value:
                Number(data.supply_distribution.community_treasury) +
                Number(data.supply_distribution.dao_treasury),
              itemStyle: { color: '#3B0065' },
              name: 'Treasury',
            },
            {
              value:
                Number(data.supply_distribution.investor) +
                Number(data.supply_distribution.team_allocated) +
                Number(data.supply_distribution.team_unallocated) +
                Number(data.supply_distribution.vesting_unallocated),
              itemStyle: { color: '#08538C' },
              name: 'Locked',
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
        {
          type: 'pie',
          radius: ['55%', '70%'],
          data: [
            {
              value:
                1e8 -
                (Number(data.supply_distribution.community_treasury) +
                  Number(data.supply_distribution.dao_treasury) +
                  Number(data.supply_distribution.investor) +
                  Number(data.supply_distribution.team_allocated) +
                  Number(data.supply_distribution.team_unallocated) +
                  Number(data.supply_distribution.vesting_unallocated)),
              itemStyle: { color: '#F2005F' },
              name: 'Public',
            },
            {
              value: data.supply_distribution.community_treasury,
              itemStyle: { color: '#420069' },
              name: 'Community Rewards',
            },
            {
              value: data.supply_distribution.dao_treasury,
              itemStyle: { color: '#5D0096' },
              name: 'DAO Treasury',
            },
            {
              value: data.supply_distribution.investor,
              itemStyle: { color: '#005999' },
              name: 'Investors',
            },
            {
              value: data.supply_distribution.team_allocated,
              itemStyle: { color: '#006bb8' },
              name: 'Team & Founders',
            },
            {
              value: data.supply_distribution.team_unallocated,
              itemStyle: { color: '#007dd6' },
              name: 'Team Unallocated',
            },
            {
              value: data.supply_distribution.vesting_unallocated,
              itemStyle: { color: '#008ff5' },
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
        <HStack
          bg="white"
          shadow="lg"
          py="1"
          px="4"
          rounded="md"
          border="1px"
          borderColor="gray.100"
        >
          <Text
            fontFamily="Credmark Regular"
            fontSize="lg"
            pt="1"
            color="purple.500"
            textAlign="center"
          >
            CMK Supply
            <br />
            Distribution
          </Text>
        </HStack>
        <Text
          textAlign="center"
          fontSize="lg"
          bgGradient="linear(135deg, #08538C, #3B0065)"
          bgClip="text"
          px="4"
          rounded="md"
          lineHeight="1.1"
        >
          TOTAL SUPPLY
          <br />{' '}
          <Text as="span" fontWeight="bold">
            {shortenNumber(Number(data.total_supply), 0)} CMK
          </Text>
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
