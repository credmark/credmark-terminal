import Color from 'color';

import { AssetInfo, GraphInfo } from '~/types/terminal';

export const ASSETS: Array<AssetInfo> = [
  {
    key: 'AAVEV2',
    title: 'AAVE V2',
    subtitle: 'ETH',
    logo: '/img/assets/aave.png',
    color: Color('#B0539F'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/reports/aave-and-compound-defi-risk-report/investment-metrics',
  },
  {
    key: 'COMPOUND',
    title: 'Compound',
    logo: '/img/assets/compound.png',
    color: Color('#00D395'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/reports/aave-and-compound-defi-risk-report/investment-metrics',
  },
];

export const GRAPHS: Array<GraphInfo> = [
  {
    key: 'VAR',
    title: 'VAR',
    subtitle: 'Value at Risk',
    description:
      "VaR is a numerical measure of market risk for a given portfolio; our model's numerical output represents a worst-case loss for a given portfolio over a given holding period. We apply VaR to a platform by using total borrows minus total deposits in each token as the portfolio.",
  },
  {
    key: 'LCR',
    title: 'LCR',
    subtitle: 'Liquidity Coverage Ratio',
    description:
      'LCR measures liquidity risk, defined as the proportion of highly liquid assets held by an organization to ensure that they maintain an ongoing ability to meet their short-term obligations (cash outflows for 30 days) in a stress situation.',
  },
];

export const SECONDARY_GRAPHS: Array<GraphInfo> = [
  {
    key: 'TA',
    title: 'Total Assets (TA)',
    description:
      'Total Assets (TA) equals the total dollar value of tokens borrowed from the protocol.',
  },
  {
    key: 'TL',
    title: 'Total Liabilities (TL)',
    description:
      'Total Liabilities (TL) equals the total dollar value of tokens deposited into the protocol.',
  },
  {
    key: 'MC',
    title: 'Market Cap',
    description:
      'Market Cap represents the current market capitalization of the protocol´s native token.',
  },
];
