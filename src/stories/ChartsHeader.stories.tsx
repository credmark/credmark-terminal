import { Img } from '@chakra-ui/react';
import { Story } from '@storybook/react';
import React from 'react';

import ChartHeaders, {
  ChartHeaderProps,
} from '../components/shared/Charts/ChartHeader';

export default {
  title: 'Components/Charts/ChartHeader',
  component: ChartHeaders,
  argTypes: {
    backgroundColor: {
      options: ['#00D696', '#DEDEDE', '#BFBFBF', '#FFFFFF'],
      control: { type: 'radio' },
    },
    textColor: {
      options: ['white', 'black'],
      control: { type: 'radio' },
    },
    toggleFullScreen: {
      action: 'clicked',
    },
  },
};

const Template: Story<ChartHeaderProps> = (args) => (
  <ChartHeaders
    title="Chart Title"
    logo={<Img src="https://app.credmark.com/img/logo.svg" width="20px" />}
    downloadFileName={`download-file-name.csv`}
    downloadFileHeaders={[]}
    downloadData={[]}
    isFullScreen={false}
    toggleFullScreen={() => console.log('toggleFullScreen')}
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  textColor: 'black',
  backgroundColor: '#00D696',
};
