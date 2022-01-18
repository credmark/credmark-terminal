import { Box, Center, Text } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo } from 'react';

export default function PieChart(): JSX.Element {
  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `
                <div style="display: flex; margin-bottom: 2px;">
                  <div>${params.marker}</div>
                  <div style="flex: 1">${params.name}</div>
                  <strong style="margin-left: 16px">${params.value}M CMK</strong>
                </div>
                `;
        },
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 25.5, name: 'Circulating Supply' },
            { value: 12.5, name: 'Treasury' },
            { value: 3, name: 'Reserved for upcoming CEXes' },
            { value: 6, name: 'Protocol owned Liquidity' },
            { value: 4, name: 'Owned by community' },
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
  }, []);

  return (
    <Box>
      <Center>
        <Text
          textAlign="center"
          fontSize="xl"
          bg="purple.500"
          color="white"
          px="4"
          rounded="md"
        >
          Liquidity
        </Text>
      </Center>
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
