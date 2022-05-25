import { WETH9 } from '@uniswap/sdk-core';
import React from 'react';

import { DexPage } from '~/components/pages/Terminal';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  BIT,
  DAI,
  ILV,
  JPEG,
  OHM,
  SUSHI,
  TOKE,
  USDC,
  USDT,
  WBTC,
} from '~/constants/tokens';

const pools = [
  {
    pool: '0x6a091a3406E0073C3CD6340122143009aDac0EDa',
    tokens: [ILV, WETH9[1]],
  },
  {
    pool: '0x397ff1542f962076d0bfe58ea045ffa2d347aca0',
    tokens: [USDC[1], WETH9[1]],
  },
  {
    pool: '0xceff51756c56ceffca006cd410b03ffc46dd3a58',
    tokens: [WBTC, WETH9[1]],
  },
  {
    pool: '0xe12af1218b4e9272e9628d7c7dc6354d137d024e',
    tokens: [BIT, WETH9[1]],
  },
  {
    pool: '0xd4e7a6e2d03e4e48dfc27dd3f46df1c176647e38',
    tokens: [TOKE, WETH9[1]],
  },
  {
    pool: '0x06da0fd433c1a5d7a4faa01111c044910a184553',
    tokens: [USDT, WETH9[1]],
  },
  {
    pool: '0x055475920a8c93cffb64d039a8205f7acc7722d3',
    tokens: [OHM, DAI],
  },
  {
    pool: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f',
    tokens: [DAI, WETH9[1]],
  },
  {
    pool: '0xdB06a76733528761Eda47d356647297bC35a98BD',
    tokens: [JPEG, WETH9[1]],
    createdAt: 1646265600000,
  },
  {
    pool: '0x795065dcc9f64b5614c407a6efdc400da6221fb0',
    tokens: [SUSHI, WETH9[1]],
  },
];

export default function SushiswapDexPage() {
  return (
    <>
      <SEOHeader title="DEXs Sushi Terminal" />
      <DexPage dex="SUSHISWAP" pools={pools} />
    </>
  );
}
