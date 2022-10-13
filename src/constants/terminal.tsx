import { Img } from '@chakra-ui/react';
import Color from 'color';
import React from 'react';

import { AssetInfo } from '~/types/terminal';

export const ASSETS: Array<AssetInfo> = [
  {
    key: 'AAVEV2',
    title: 'AAVE V2',
    subtitle: 'ETH',
    logo: <Img src="/img/assets/aave.png" />,
    color: Color('#A200FF'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/defi-protocol-taxonomy/lending/aave',
  },
  {
    key: 'COMPOUND',
    title: 'Compound',
    logo: <Img src="/img/assets/compound.png" />,
    color: Color('#00D89A'),
    infoLink:
      'https://docs.credmark.com/credmark-risk-library/defi-protocol-taxonomy/lending/compound',
  },
];
