import theme from '../src/theme';

import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { addDecorator } from '@storybook/react';

export const parameters = {
  chakra: {
    theme: theme,
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

addDecorator(storyFn => (
  <ChakraProvider theme={theme}>
    <CSSReset />
    {storyFn()}
  </ChakraProvider>
))