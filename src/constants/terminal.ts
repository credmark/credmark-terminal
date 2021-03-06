import Color from 'color';

import { AssetInfo } from '~/types/terminal';

export const ASSETS: Array<AssetInfo> = [
  {
    key: 'AAVEV2',
    title: 'AAVE V2',
    subtitle: 'ETH',
    logo: '/img/assets/aave.png',
    color: Color('#B0539F'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/defi-protocol-taxonomy/lending/aave',
  },
  {
    key: 'COMPOUND',
    title: 'Compound',
    logo: '/img/assets/compound.png',
    color: Color('#00D395'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/defi-protocol-taxonomy/lending/compound',
  },
];
