import 'focus-visible/dist/focus-visible';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/work-sans/700.css';
import '@fontsource/work-sans/900.css';
import '~/theme/nprogress.css'; //styles of nprogress

import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import Layout from '~/components/layout';
import SEOHeader from '~/components/shared/SEOHeader';
import { connectors } from '~/connectors';
import env from '~/env';
import ChakraProvider, { getServerSideProps } from '~/providers/ChakraProvider';
import reduxStore from '~/state';
import ApplicationUpdater from '~/state/application/updater';
import MulticallUpdater from '~/state/multicall/updater';
import TransactionUpdater from '~/state/transactions/updater';
import theme from '~/theme';

declare const window: Window & { dataLayer: Record<string, unknown>[] };

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
      if (window.dataLayer && env.gtmTrackingId) {
        window.dataLayer.push({
          event: 'pageview',
          page: url,
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

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      {env.gtmTrackingId && (
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${env.gtmTrackingId}');
          `,
          }}
        />
      )}
      {env.hotjarId && (
        <Script
          id="hotjar-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj || function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${env.hotjarId},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}
      <SEOHeader
        title="Credmark Terminal - Actionable DeFi Data"
        titleTemplate=""
      />
      <ChakraProvider cookies={pageProps.cookies} resetCSS theme={theme}>
        <Web3ReactProvider connectors={connectors}>
          <ReduxProvider store={reduxStore}>
            <ReduxUpdaters />
            <RouteBasedProviders>
              <Component {...pageProps} />
            </RouteBasedProviders>
          </ReduxProvider>
        </Web3ReactProvider>
      </ChakraProvider>
    </>
  );
}

export { getServerSideProps };
