import { Token } from '@uniswap/sdk-core';

import { CMK_ADDRESSES, STAKED_CMK_ADDRESSES } from './addresses';

export const CMK: { [chainId: number]: Token } = {
  [4]: new Token(4, CMK_ADDRESSES[4], 18, 'CMK', 'Credmark'),
  [3]: new Token(3, CMK_ADDRESSES[3], 18, 'CMK', 'Credmark'),
};

export const SCMK: { [chainId: number]: Token } = {
  [4]: new Token(4, STAKED_CMK_ADDRESSES[4], 18, 'sCMK', 'StakedCredmark'),
  [3]: new Token(3, STAKED_CMK_ADDRESSES[3], 18, 'sCMK', 'StakedCredmark'),
};
