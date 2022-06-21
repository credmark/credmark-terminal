import { Container } from '@chakra-ui/react';
import { Token, WETH9 } from '@uniswap/sdk-core';
import React from 'react';

import { SharpeChartBox } from '~/components/pages/Terminal';
import { WBTC } from '~/constants/tokens';

const APE = new Token(
  1,
  '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
  18,
  'APE',
  'ApeCoin',
);
const AAVE = new Token(
  1,
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  18,
  'AAVE',
  'Aave Token',
);
const COMP = new Token(
  1,
  '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  18,
  'COMP',
  'Compound',
);
const UNI = new Token(
  1,
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  18,
  'UNI',
  'Uniswap',
);
const SUSHI = new Token(
  1,
  '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  18,
  'SUSHI',
  'SushiToken',
);
const CRV = new Token(
  1,
  '0xD533a949740bb3306d119CC777fa900bA034cd52',
  18,
  'CRV',
  'Curve DAO Token',
);
const CVX = new Token(
  1,
  '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
  18,
  'CVX',
  'Convex Token',
);
const FXS = new Token(
  1,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share',
);
const SHIB = new Token(
  1,
  '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  18,
  'SHIB',
  'SHIBA INU',
);
const MATIC = new Token(
  1,
  '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  18,
  'MATIC',
  'Matic Token',
);
const MKR = new Token(
  1,
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  18,
  'MKR',
  'Maker',
);
const ONE_INCH = new Token(
  1,
  '0x111111111117dC0aa78b770fA6A738034120C302',
  18,
  '1INCH',
  '1INCH Token',
);
const GNO = new Token(
  1,
  '0x6810e776880C02933D47DB1b9fc05908e5386b96',
  18,
  'GNO',
  'Gnosis Token',
);
const LINK = new Token(
  1,
  '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  18,
  'LINK',
  'ChainLink Token',
);
const MANA = new Token(
  1,
  '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
  18,
  'MANA',
  'Decentraland MANA',
);
const OHM = new Token(
  1,
  '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
  9,
  'OHM',
  'Olympus',
);
const RBN = new Token(
  1,
  '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
  18,
  'RBN',
  'Ribbon',
);
const TRIBE = new Token(
  1,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe',
);
const TOKE = new Token(
  1,
  '0x2e9d63788249371f1DFC918a52f8d799F4a38C94',
  18,
  'TOKE',
  'Tokemak',
);
const DYDX = new Token(
  1,
  '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
  18,
  'DYDX',
  'dYdX',
);
const ILV = new Token(
  1,
  '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E',
  18,
  'ILV',
  'Illuvium',
);
const AXS = new Token(
  1,
  '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
  18,
  'AXS',
  'Axie Infinity Shard',
);
const AUDIO = new Token(
  1,
  '0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998',
  18,
  'AUDIO',
  'Audius',
);
const YFI = new Token(
  1,
  '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  18,
  'YFI',
  'yearn.finance',
);

const tokens: Token[] = [
  WBTC,
  WETH9[1],
  APE,
  AAVE,
  COMP,
  UNI,
  SUSHI,
  CRV,
  CVX,
  FXS,
  SHIB,
  MATIC,
  MKR,
  ONE_INCH,
  GNO,
  LINK,
  MANA,
  OHM,
  RBN,
  TRIBE,
  TOKE,
  DYDX,
  ILV,
  AXS,
  AUDIO,
  YFI,
];

export default function SharpeRatioPage() {
  return (
    <Container p="8" maxW="container.xl">
      <SharpeChartBox tokens={tokens} defaultTokens={[WBTC, WETH9[1]]} />
    </Container>
  );
}
