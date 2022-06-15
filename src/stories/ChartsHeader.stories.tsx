import { Img } from '@chakra-ui/react';
import { Story } from '@storybook/react';
import React from 'react';

import ChartHeader, {
  ChartHeaderProps,
} from '../components/shared/Charts/ChartHeader';

export default {
  title: 'Components/Charts/ChartHeader',
  component: ChartHeader,
  argTypes: {
    toggleExpand: {
      action: 'clicked',
    },
  },
};

const Template: Story<ChartHeaderProps> = (args) => (
  <ChartHeader
    title="Chart Title"
    logo={
      <Img
        alt="Credmark"
        src="https://app.credmark.com/img/logo.svg"
        width="20px"
      />
    }
    downloadCsv={{
      filename: `download-file-name.csv`,
      headers: [],
      data: [],
    }}
    isExpanded={false}
    toggleExpand={() => console.log('toggleExpand')}
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {};
