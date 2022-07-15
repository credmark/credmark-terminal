import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

const theme = extendTheme(
  {
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    fonts: {
      heading:
        '"Work Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      body: '"Work Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
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
        '50': '#F4E8FD',
        '100': '#DCB7F8',
        '200': '#C586F3',
        '300': '#AE55EF',
        '400': '#9625EA',
        '500': '#7A13C6',
        '600': '#5C0E95',
        '700': '#3E0A65',
        '800': '#200534',
        '900': '#1A022C',
      },
      green: {
        '50': '#E5FFF7',
        '100': '#B4FFE8',
        '200': '#82FFD9',
        '300': '#50FFCA',
        '400': '#1FFFBC',
        '500': '#00ECA5',
        '600': '#00BE85',
        '700': '#009064',
        '800': '#006144',
        '900': '#003324',
      },
      gray: {
        '50': '#E5E5E5',
        '100': '#DBDBDB',
        '200': '#C4C4C4',
        '300': '#ADADAD',
        '400': '#989898',
        '500': '#808080',
        '600': '#666666',
        '700': '#4D4D4D',
        '800': '#333333',
        '900': '#1A1A1A',
      },
      white: '#FFFFFF',
    },
    components: {
      Button: {
        baseStyle: {
          rounded: 'none', // Normally, it is "md"
          fontWeight: 400,
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'green' }),
);

export default theme;
