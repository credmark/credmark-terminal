import Color from 'color';

import { AssetInfo, GraphInfo } from '~/types/terminal';

export const ASSETS: Array<AssetInfo> = [
  {
    key: 'AAVEV2',
    name: 'AAVE',
    logo: '/img/assets/aave.png',
    color: Color('#B0539F'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/reports/aave-and-compound-defi-risk-report/investment-metrics',
  },
  {
    key: 'COMPOUND',
    name: 'Compound',
    logo: '/img/assets/compound.png',
    color: Color('#00D395'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/reports/aave-and-compound-defi-risk-report/investment-metrics',
  },
];

export const GRAPHS: Array<GraphInfo> = [
  {
    key: 'VAR',
    name: 'VAR',
    description: 'Value at Risk',
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/risk-metrics/value-at-risk-var',
  },
  {
    key: 'LCR',
    name: 'LCR',
    description: 'Liquidity Coverage Ratio',
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/risk-metrics/liquidity-coverage-ratio-lcr',
  },
];
