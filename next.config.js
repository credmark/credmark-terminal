/* eslint-disable @typescript-eslint/no-var-requires */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// next-transpile-modules was removed: Next 13+ transpiles node_modules
// natively (echarts/zrender no longer need the plugin).
module.exports = withBundleAnalyzer({
  turbopack: {},
});
