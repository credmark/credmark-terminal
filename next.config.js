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
  webpack: (config) => {
    // Suppressing abi JSON import warnings in @uniswap/v3-sdk/dist/v3-sdk.esm.js
    // https://webpack.js.org/migrate/5/#using-named-exports-from-json-modules
    config.ignoreWarnings = [
      {
        module: /.\/node_modules.*v3-sdk.*.js$/,
        message: /only default export is available soon/,
      },
    ];

    return config;
  },
});
