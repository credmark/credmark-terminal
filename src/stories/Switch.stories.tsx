import { SwitchProps } from '@chakra-ui/react';
import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { Switch } from '../components/shared/Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    colorScheme: {
      options: ['#00D696', '#DEDEDE', '#BFBFBF'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Switch>;

const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
