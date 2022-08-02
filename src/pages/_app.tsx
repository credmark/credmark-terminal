import 'focus-visible/dist/focus-visible';
import '@fontsource/work-sans/300.css';
import '@fontsource/work-sans/400.css';
import '@fontsource/work-sans/500.css';
import '@fontsource/work-sans/700.css';
import '@fontsource/work-sans/900.css';
import '~/theme/nprogress.css'; //styles of nprogress

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';

import Layout from '~/components/layout';
import SEOHeader from '~/components/shared/SEOHeader';
import env from '~/env';
import ChakraProvider, { getServerSideProps } from '~/providers/ChakraProvider';
import theme from '~/theme';

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

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <SEOHeader
        title="Credmark Terminal - Actionable DeFi Data"
        titleTemplate=""
      />
      <ChakraProvider cookies={pageProps.cookies} resetCSS theme={theme}>
        <RouteBasedProviders>
          <Component {...pageProps} />
        </RouteBasedProviders>
      </ChakraProvider>
    </>
  );
}

export { getServerSideProps };
