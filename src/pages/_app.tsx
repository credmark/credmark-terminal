import 'focus-visible/dist/focus-visible';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/work-sans/700.css';
import '@fontsource/work-sans/900.css';
import '~/theme/nprogress.css'; //styles of nprogress

import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Layout from '~/components/layout';
import SEOHeader from '~/components/shared/SEOHeader';
import env from '~/env';
import Web3ReactManager from '~/providers/Web3ReactManager';
import reduxStore from '~/state';
import ApplicationUpdater from '~/state/application/updater';
import MulticallUpdater from '~/state/multicall/updater';
import TransactionUpdater from '~/state/transactions/updater';
import theme from '~/theme';
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
    const onStart = () => {
      NProgress.start();
    };

    const onError = () => {
      NProgress.done();
    };

    const onComplete = (url: string) => {
      NProgress.done();
      if (window.gtag && env.gaTrackingId) {
        window.gtag('config', env.gaTrackingId, {
          page_path: url,
        });
      }
    };

    NProgress.configure({ showSpinner: false });
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onComplete);
    router.events.on('routeChangeError', onError);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onComplete);
      router.events.off('routeChangeError', onError);
    };
  }, [router.events]);

  return <Layout>{children}</Layout>;
}

const Web3ProviderNetwork = dynamic(
  () => import('~/providers/Web3ReactProvider'),
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <SEOHeader
        title="Credmark Terminal - Actionable DeFi Data"
        titleTemplate=""
      />
      <ChakraProvider resetCSS theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <ReduxProvider store={reduxStore}>
              <ReduxUpdaters />
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
