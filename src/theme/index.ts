import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const theme = extendTheme(
  {
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    fonts: {
      heading:
        'Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      body: 'Roboto,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    },
    shadows: {
      xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
      sm: '0 0.2px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 0.2px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 0.8px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 2px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 5px 50px -12px rgba(0, 0, 0, 0.25)',
      outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
      inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
      none: 'none',
      'dark-lg':
        'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
    },
    colors: {
      purple: {
        '50': '#F4E5FF',
        '100': '#D599FF',
        '200': '#B54CFF',
        '300': '#9500FE',
        '400': '#6800B2',
        '500': '#3B0065',
        '600': '#340059',
        '700': '#2C004C',
        '800': '#250040',
        '900': '#1E0033',
      },
      green: {
        '50': '#E5FFF7',
        '100': '#AFFFE7',
        '200': '#79FFD7',
        '300': '#43FFC7',
        '400': '#0DFFB7',
        '500': '#00D696',
        '600': '#00AD79',
        '700': '#00855D',
        '800': '#005C40',
        '900': '#003324',
      },
      pink: {
        '50': '#FCE8EF',
        '100': '#F7BED2',
        '200': '#F293B5',
        '300': '#ED6998',
        '400': '#E83F7B',
        '500': '#DE1A60',
        '600': '#B2154D',
        '700': '#86103A',
        '800': '#5A0B27',
        '900': '#2E0514',
      },
      gray: {
        '50': '#F5F5F5',
        '100': '#DBDBDB',
        '200': '#C4C4C4',
        '300': '#ADADAD',
        '400': '#969696',
        '500': '#808080',
        '600': '#666666',
        '700': '#4D4D4D',
        '800': '#333333',
        '900': '#1A1A1A',
      },
    },
    components: {
      Button: {
        baseStyle: {
          rounded: 'base', // Normally, it is "md"
          fontWeight: 400,
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'green' }),
);

export default theme;
