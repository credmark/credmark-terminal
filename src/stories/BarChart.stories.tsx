import { Grid, Text } from '@chakra-ui/react';
import React from 'react';

import BarChart from '~/components/shared/Charts/BarChart';

export default {
  title: 'Components/Charts/Barchart',
  component: BarChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const dataset = [
  { value: 100, category: 'eth', name: 'Ethereum' },
  { value: 1500, category: 'btc', name: 'Bitcoin' },
  { value: 830, category: 'dai', name: 'Dai' },
  { value: 40, category: 'usdc', name: 'USDC Stable coin' },
  { value: 33, category: 'shib', name: 'Shiba Inu' },
];
const datasetGrouped = {
  dimensions: ['category', 'uniswap-v2', 'uniswap-v3', 'curve'],
  source: [
    {
      category: 'USDC/DAI',
      'uniswap-v2': 43.3,
      'uniswap-v3': 85.8,
      curve: 93.7,
    },
    {
      category: 'BTC/WBTC',
      'uniswap-v2': 83.1,
      'uniswap-v3': 73.4,
      curve: 55.1,
    },
    {
      category: 'USDT/DAI',
      'uniswap-v2': 86.4,
      'uniswap-v3': 65.2,
      curve: 82.5,
    },
    {
      category: 'ETH/USTC',
      'uniswap-v2': 72.4,
      'uniswap-v3': 53.9,
      curve: 39.1,
    },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipFormatter = (params: any, isTitle = false) => {
  if (isTitle) {
    return `${params?.name} ${new Intl.NumberFormat().format(
      Number(params?.data?.value) ?? 0,
    )}`;
  }
  return `
        <div>
          <strong><p>${params?.name}</p></strong>
          <code>${params?.category}</code>
          <br/>
          <em>${new Intl.NumberFormat().format(params?.value as number)}</em>
        </div>
      `;
};

const Template = () => {
  return (
    <Grid gridTemplateRows="max-content" gap="20px">
      <Text fontSize="20px" fontWeight={600}>
        Normal Bar Chart
      </Text>
      <BarChart
        tooltipFormatter={tooltipFormatter}
        dataset={dataset}
        xAxisKey="value"
        yAxisKey="category"
      />
      <br />
      <br />
      <br />
      <Text fontSize="20px" fontWeight={600}>
        Grouped Bar Chart
      </Text>
      <BarChart
        tooltipFormatter={tooltipFormatter}
        dataset={datasetGrouped}
        xAxisKey="value"
        yAxisKey="category"
        grouped
        showYaxisLabel
        showXaxisLabel
        showLegend
      />
      <BarChart
        tooltipFormatter={tooltipFormatter}
        dataset={datasetGrouped}
        xAxisKey="category"
        yAxisKey="value"
        grouped
        showYaxisLabel
        showXaxisLabel
        showLegend
      />
    </Grid>
  );
};

export const Primary = Template.bind({});
