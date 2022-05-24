import { WETH9 } from '@uniswap/sdk-core';
import React from 'react';

import { DexPage } from '~/components/pages/Terminal';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  CRV,
  cvxCRV,
  cvxFXS,
  cyDAI,
  cyUSDC,
  cyUSDT,
  DAI,
  ETH,
  FRAX,
  FXS,
  MIM,
  renBTC,
  stETH,
  THREE_CRV,
  USDC,
  USDT,
  UST,
  WBTC,
} from '~/constants/tokens';

const pools = [
  {
    pool: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
    tokens: [stETH, ETH[1]],
  },
  {
    pool: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
    tokens: [DAI, USDC[1], USDT],
  },
  {
    pool: '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B',
    tokens: [FRAX, THREE_CRV],
  },
  {
    pool: '0xCEAF7747579696A2F0bb206a14210e3c9e6fB269',
    tokens: [UST, THREE_CRV],
  },
  {
    pool: '0x5a6A4D54456819380173272A5E8E9B9904BdF41B',
    tokens: [MIM, THREE_CRV],
  },
  {
    pool: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
    tokens: [USDT, WETH9[1], WBTC],
  },
  {
    pool: '0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF',
    tokens: [cyDAI, cyUSDC, cyUSDT],
  },
  {
    pool: '0x93054188d876f558f4a66B2EF1d97d16eDf0895B',
    tokens: [renBTC, WBTC],
  },
  {
    pool: '0xd658A338613198204DCa1143Ac3F01A722b5d94A',
    tokens: [cvxFXS, FXS],
    createdAt: 1645574400000,
  },
  {
    pool: '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8',
    tokens: [CRV, cvxCRV],
  },
];

export default function CurveDexPage() {
  return (
    <>
      <SEOHeader title="DEXs Curve - Credmark Terminal" />
      <DexPage dex="CURVE" pools={pools} />
    </>
  );
}
