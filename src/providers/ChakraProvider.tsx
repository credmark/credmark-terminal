import {
  ChakraProvider as $ChakraProvider,
  ChakraProviderProps as $ChakraProviderProps,
  cookieStorageManagerSSR,
  localStorageManager,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import React from 'react';

interface ChakraProviderServerProps {
  cookies: string;
}

type ChakraProviderProps = $ChakraProviderProps & ChakraProviderServerProps;

export default function ChakraProvider({
  cookies,
  children,
  ...otherProps
}: ChakraProviderProps) {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <$ChakraProvider colorModeManager={colorModeManager} {...otherProps}>
      {children}
    </$ChakraProvider>
  );
}

export const getServerSideProps: GetServerSideProps<
  ChakraProviderServerProps
> = async ({ req }) => {
  return {
    props: {
      // first time users will not have any cookies and you may not return
      // undefined here, hence ?? is necessary
      cookies: req.headers.cookie ?? '',
    },
  };
};
