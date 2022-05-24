import { WETH9 } from '@uniswap/sdk-core';
import React from 'react';

import { DexPage } from '~/components/pages/Terminal';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  DAI,
  FEI,
  FNK,
  FRAX,
  FXS,
  MC,
  SYN,
  TRIBE,
  USDC,
  USDT,
  WISE,
} from '~/constants/tokens';

const pools = [
  {
    pool: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    tokens: [USDC[1], WETH9[1]],
  },
  {
    pool: '0x21b8065d10f73ee2e260e5b47d3344d3ced7596e',
    tokens: [WISE, WETH9[1]],
  },
  {
    pool: '0x9928e4046d7c6513326ccea028cd3e7a91c7590a',
    tokens: [FEI, TRIBE],
  },
  {
    pool: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852',
    tokens: [WETH9[1], USDT],
  },
  {
    pool: '0xe1573b9d29e2183b1af0e743dc2754979a40d237',
    tokens: [FXS, FRAX],
  },
  {
    pool: '0xae461ca67b15dc8dc81ce7615e0320da1a9ab8d5',
    tokens: [DAI, USDC[1]],
  },
  {
    pool: '0xccb63225a7b19dcf66717e4d40c9a72b39331d61',
    tokens: [MC, WETH9[1]],
  },
  {
    pool: '0x3041cbd36888becc7bbcbc0045e3b1f144466f5f',
    tokens: [USDC[1], USDT],
  },
  {
    pool: '0x9fae36a18ef8ac2b43186ade5e2b07403dc742b1',
    tokens: [SYN, FRAX],
    createdAt: 1645833600000,
  },
  {
    pool: '0x61b62c5d56ccd158a38367ef2f539668a06356ab',
    tokens: [FNK, USDT],
  },
];

export default function UniswapV2DexPage() {
  return (
    <>
      <SEOHeader title="DEXs Uniswap v2 - Credmark Terminal" />
      <DexPage dex="UNISWAP_V2" pools={pools} />
    </>
  );
}
