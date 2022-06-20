import { Box } from '@chakra-ui/react';
import React from 'react';

import HistoricalChart from '~/components/shared/Charts/HistoricalChart';

export default {
  title: 'Components/Charts/HistoricalChart',
  component: HistoricalChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const lines = [
  {
    name: 'Historical Chart',
    description: <p>Historicalchart</p>,
    color: 'blue',
    data: [
      {
        timestamp: new Date('2022-04-01T00:00:00.000Z'),
        value: 100,
      },
      {
        timestamp: new Date('2022-03-01T00:00:00.000Z'),
        value: 900,
      },
      {
        timestamp: new Date('2022-04-01T00:00:00.000Z'),
        value: 322,
      },
    ],
  },
  {
    name: 'Another one',
    description: <p>Another one</p>,
    color: 'red',
    data: [
      {
        timestamp: new Date('2022-06-01T00:00:00.000Z'),
        value: 100,
      },
      {
        timestamp: new Date('2022-05-01T00:00:00.000Z'),
        value: 300,
      },
      {
        timestamp: new Date('2022-04-01T00:00:00.000Z'),
        value: 876,
      },
    ],
  },
];
const Template = () => {
  return (
    <Box>
      <HistoricalChart
        height={200}
        flex="1"
        borderLeft="2px"
        borderColor="gray.100"
        durations={[30, 60, 90]}
        defaultDuration={30}
        showCurrentStats
        lines={lines}
      />
    </Box>
  );
};

export const Primary = Template.bind({});
