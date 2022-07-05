import { Grid } from '@chakra-ui/react';
import React from 'react';

import PieChart from '~/components/shared/Charts/PieChart';

export default {
  title: 'Components/Charts/PieChart',
  component: PieChart,
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

const Template = () => {
  return (
    <Grid gridTemplateRows="50px 1fr" gap="20px">
      <PieChart dataset={dataset} height={200} />
    </Grid>
  );
};

export const Primary = Template.bind({});
