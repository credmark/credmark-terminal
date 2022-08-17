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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipFormatter = (category: string, value: number) => {
  return `
        <div>
          <code>${category}</code>
          <br/>
          <em>${new Intl.NumberFormat().format(value as number)}</em>
        </div>
      `;
};

const Template = () => {
  return (
    <Grid gridTemplateRows="max-content" gap="20px">
      <Text fontSize="20px" fontWeight={600}>
        Normal Bar Chart
      </Text>
      <BarChart tooltipFormatter={tooltipFormatter} data={dataset} />
      <br />
      <br />
      <br />
    </Grid>
  );
};

export const Primary = Template.bind({});
