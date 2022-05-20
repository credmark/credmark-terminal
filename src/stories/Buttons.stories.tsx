import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import { Button } from '../components/shared/Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/Buttons',
  component: Button,
  argTypes: {
    backgroundColor: {
      options: ['green.500', 'gray.400', 'gray.900'],
      control: { type: 'radio' },
    },
    fontWeight: {
      options: ['700', '400'],
      control: { type: 'radio' },
    },
    borderRadius: {
      options: ['4px', '16px', '20px'],
      control: { type: 'radio' },
    },
    color: {
      options: ['white', 'gray.900'],
      control: { type: 'radio' },
    },
    onClick: {
      action: 'clicked button',
    },
    disabled: {
      control: { type: 'boolean' },
    },
    content: {
      control: { type: 'text' },
    },
  },
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (args) => (
  <Button content={args.title || 'Button'} {...args} />
);
