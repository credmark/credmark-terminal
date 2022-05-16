import React from 'react';

import cmkLogo from '../../public/img/cmk.svg';
import AreaCharts from '../components/Charts/AreaChart';

const AreaChart: React.FC = () => (
  <AreaCharts
    lineColor="#825F96"
    data={[
      {
        ts: 1598486400000,
      },
    ].map((val) => ({
      timestamp: new Date(val.ts * 1000),
      value: 100,
    }))}
    headerSummary="Current Price:"
    headerAmount={`$1000.00`}
    title="Price of CMK"
    titleImg={cmkLogo}
    gradient={['#08538C', '#3B0065']}
    line={true}
    formatValue={(val) => '$' + val.toFixed(2)}
    yLabel="PRICE"
    height={380}
    durations={[30, 60, 90]}
    defaultDuration={60}
  />
);

export default {
  title: 'Components/Charts/Area',
  component: AreaChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = () => <AreaChart />;

export const Primary = Template.bind({});
