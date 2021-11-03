/* eslint-disable @typescript-eslint/no-var-requires */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const API_PATH =
  process.env.APP_ENV === 'prod'
    ? 'http://smartpoolbackendprodenv.eba-xgp2gh8p.ap-south-1.elasticbeanstalk.com'
    : 'http://localhost:8080';

module.exports = withBundleAnalyzer({
  env: {
    APP_ENV: process.env.APP_ENV,
  },
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: `${API_PATH}/:slug*`,
      },
    ];
  },
});
