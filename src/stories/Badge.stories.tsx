import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { Badge, BadgeProps } from '../components/shared/Badge';

export default {
  title: 'Components/Badges',
  component: Badge,
  argTypes: {
    backgroundColor: {
      options: ['#00D696', '#DEDEDE', '#BFBFBF'],
      control: { type: 'radio' },
    },
    content: {
      control: { type: 'text' },
    },
    fontWeight: {
      options: ['700', '400'],
      control: { type: 'radio' },
    },
    color: {
      options: ['white', 'black'],
      control: { type: 'radio' },
    },
    onClick: {
      action: 'clicked badge',
    },
  },
} as ComponentMeta<typeof Badge>;

const Template: Story<BadgeProps> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: 'Primary',
  backgroundColor: '#00D696',
};
