import { Button, Grid } from '@chakra-ui/react';
import React from 'react';

import cmkLogo from '../../public/img/cmk.svg';
import AreaChart from '../components/shared/Charts/Area';

export default {
  title: 'Components/Charts/Area',
  component: AreaChart,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template = () => {
  const [hasSidebar, showSidebar] = React.useState(false);
  return (
    <Grid gridTemplateRows="50px 1fr" gap="20px">
      <Button size="sm" onClick={() => showSidebar(!hasSidebar)}>
        Show/Hide Sidebar
      </Button>
      <AreaChart
        gradient={['green.500', 'gray.400']}
        yLabel="PRICE"
        lineColor="purple.500"
        data={[
          {
            ts: 1598486400000,
          },
        ].map((val) => ({
          timestamp: new Date(val.ts * 1000),
          value: 100,
        }))}
        headerSummary="Current Price:"
        headerAmount="$1000.00"
        title="Price of CMK"
        titleImg={cmkLogo}
        line={true}
        formatValue={(val) => '$' + val.toFixed(2)}
        height={380}
        durations={[30, 60, 90]}
        defaultDuration={60}
        chartSidebar={hasSidebar && <div>Sidebar</div>}
      />
    </Grid>
  );
};

export const Primary = Template.bind({});
