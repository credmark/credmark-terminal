import { SwitchProps } from '@chakra-ui/react';
import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { Switch } from '../components/shared/Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
  argTypes: {
    colorScheme: {
      options: ['green.500', 'gray.400', 'gray.900'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Switch>;

const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Default = Template.bind({});
