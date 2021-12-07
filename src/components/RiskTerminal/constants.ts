import Color from 'color';

import { AssetInfo, GraphInfo } from '~/types/terminal';

export const ASSETS: Array<AssetInfo> = [
  {
    key: 'AAVEV2',
    name: 'AAVE',
    logo: '/img/assets/aave.png',
    color: Color('#B0539F'),
  },
  {
    key: 'COMP',
    name: 'Compound',
    logo: '/img/assets/compound.png',
    color: Color('#00D395'),
  },
  {
    key: 'USDC',
    name: 'USDC',
    logo: '/img/assets/usdc.png',
    color: Color('#2775CA'),
  },
];

export const GRAPHS: Array<GraphInfo> = [
  { key: 'VAR', name: 'VAR', description: 'Value at Risk' },
  { key: 'LCR', name: 'LCR', description: 'Liquidity Coverage Ratio' },
];
