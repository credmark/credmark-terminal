import { Grid } from '@chakra-ui/react';
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
    <Grid gridTemplateRows="50px 1fr" gap="20px">
      <BarChart
        tooltipFormatter={tooltipFormatter}
        dataset={dataset}
        xAxisKey="value"
        yAxisKey="category"
      />
    </Grid>
  );
};

export const Primary = Template.bind({});
