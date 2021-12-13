import 'focus-visible/dist/focus-visible';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import '~/theme/nprogress.css'; //styles of nprogress

import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Web3ReactManager from '~/components/Web3ReactManager';
import env from '~/env';
import reduxStore from '~/state';
import ApplicationUpdater from '~/state/application/updater';
import MulticallUpdater from '~/state/multicall/updater';
import TransactionUpdater from '~/state/transactions/updater';
import theme from '~/theme';
import Fonts from '~/theme/fonts';
import getLibrary from '~/utils/getLibrary';

function ReduxUpdaters() {
  return (
    <>
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

function RouteBasedProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const start = () => NProgress.start();
    const stop = () => NProgress.done();

    NProgress.configure({ showSpinner: false });
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);

    return () => {
      router.events.on('routeChangeStart', start);
      router.events.on('routeChangeComplete', stop);
      router.events.on('routeChangeError', stop);
    };
  }, [router.events]);

  return <>{children}</>;
}

const Web3ProviderNetwork = dynamic(
  () => import('~/providers/Web3ReactProvider'),
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { host } = env;
  const title = 'Credmark App';
  const description = '';
  // const img = `${host}/img/smart-pool.png`;

  return (
    <>
      <NextHead>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={host} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={img} /> */}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={host} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {/* <meta property="+twitter:image" content={img} /> */}
      </NextHead>
      <ChakraProvider resetCSS theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <ReduxProvider store={reduxStore}>
              <ReduxUpdaters />
              <Fonts />
              <Web3ReactManager>
                <RouteBasedProviders>
                  <Component {...pageProps} />
                </RouteBasedProviders>
              </Web3ReactManager>
            </ReduxProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
