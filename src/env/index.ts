import { Env } from '~/types/env';

const env: Env = {
  host: process.env.NEXT_PUBLIC_HOST ?? '',
  apiHost: process.env.NEXT_PUBLIC_API_HOST ?? '',
  infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY ?? '',
  formaticKey: process.env.NEXT_PUBLIC_FORMATIC_KEY ?? '',
  portisId: process.env.NEXT_PUBLIC_PORTIS_ID ?? '',
  coinbaseLink: process.env.NEXT_PUBLIC_COINBASE_LINK ?? '',
  gtmTrackingId: process.env.NEXT_PUBLIC_GTM_TRACKING_ID ?? '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID ?? '',
  isBeta: (process.env.NEXT_PUBLIC_BETA ?? '') === 'true',
};

export default env;
