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
  { value: 1200, name: 'Ethereum' },
  { value: 1500, name: 'Bitcoin' },
];

const Template = () => {
  return (
    <Grid gridTemplateRows="50px 1fr" gap="20px">
      <PieChart dataset={dataset} height={200} />
    </Grid>
  );
};

export const Primary = Template.bind({});
