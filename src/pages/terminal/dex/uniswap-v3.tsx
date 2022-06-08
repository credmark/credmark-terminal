import { WETH9 } from '@uniswap/sdk-core';
import React from 'react';

import { DexPage } from '~/components/pages/Terminal';
import SEOHeader from '~/components/shared/SEOHeader';
import { DAI, FRAX, sETH2, USDC, USDT, WBTC } from '~/constants/tokens';

const pools = [
  {
    pool: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
    tokens: [USDC[1], WETH9[1]],
    fee: 0.3,
  },
  {
    pool: '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed',
    tokens: [WBTC, WETH9[1]],
    fee: 0.3,
  },
  {
    pool: '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
    tokens: [DAI, USDC[1]],
    fee: 0.01,
  },
  {
    pool: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
    tokens: [USDC[1], WETH9[1]],
    fee: 0.05,
  },
  {
    pool: '0xc63b0708e2f7e69cb8a1df0e1389a98c35a76d52',
    tokens: [FRAX, USDC[1]],
    fee: 0.05,
  },
  {
    pool: '0x3416cf6c708da44db2624d63ea0aaef7113527c6',
    tokens: [USDC[1], USDT],
    fee: 0.01,
  },
  {
    pool: '0x4e68ccd3e89f51c3074ca5072bbac773960dfa36',
    tokens: [WETH9[1], USDT],
    fee: 0.3,
  },
  {
    pool: '0x97e7d56a0408570ba1a7852de36350f7713906ec',
    tokens: [DAI, FRAX],
    fee: 0.05,
  },
  {
    pool: '0x7379e81228514a1d2a6cf7559203998e20598346',
    tokens: [WETH9[1], sETH2],
    fee: 0.3,
  },
  {
    pool: '0x99ac8ca7087fa4a2a1fb6357269965a2014abc35',
    tokens: [WBTC, USDC[1]],
    fee: 0.3,
  },
];

export default function UniswapV3DexPage() {
  return (
    <>
      <SEOHeader title="DEXs Uniswap v3 Terminal" />
      <DexPage dex="UNISWAP_V3" pools={pools} />
    </>
  );
}
