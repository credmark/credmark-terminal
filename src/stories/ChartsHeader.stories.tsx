import { Story } from '@storybook/react';
import React from 'react';

import wallet from '../../public/img/wallet.svg';
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
    logo={wallet}
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
