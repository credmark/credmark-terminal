import { ComponentMeta, Story } from '@storybook/react';
import React from 'react';

import { Badge, BadgeProps } from '../components/shared/Badge';

export default {
  title: 'Components/Badges',
  component: Badge,
  argTypes: {
    backgroundColor: {
      options: ['green.500', 'gray.400', 'gray.900'],
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
      options: ['white', 'gray.900'],
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
  backgroundColor: 'green.500',
};
