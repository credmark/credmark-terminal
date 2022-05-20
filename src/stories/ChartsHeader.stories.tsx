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
      options: ['green.500', 'gray.400', 'gray.900'],
      control: { type: 'radio' },
    },
    textColor: {
      options: ['white', 'gray.900'],
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
  backgroundColor: 'green.500',
};
