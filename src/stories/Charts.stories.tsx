import { Button, Grid } from '@chakra-ui/react';
import React from 'react';

import HistoricalChart from '../components/shared/Charts/HistoricalChart';

export default {
  title: 'Components/Charts/HistoricalChart',
  component: HistoricalChart,
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
      <HistoricalChart lines={[]} />
    </Grid>
  );
};

export const Primary = Template.bind({});
