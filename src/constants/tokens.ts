import { Token } from '@uniswap/sdk-core';

import {
  CMK_ADDRESSES,
  STAKED_CMK_ADDRESSES,
  UNI_ADDRESS,
  USDC_ADDRESSES,
} from './addresses';

export const CMK: { [chainId: number]: Token } = {
  [1]: new Token(1, CMK_ADDRESSES[1], 18, 'CMK', 'Credmark'),
  [4]: new Token(4, CMK_ADDRESSES[4], 18, 'CMK', 'Credmark'),
  [3]: new Token(3, CMK_ADDRESSES[3], 18, 'CMK', 'Credmark'),
  [5]: new Token(5, CMK_ADDRESSES[5], 18, 'CMK', 'Credmark'),
  [42]: new Token(42, CMK_ADDRESSES[42], 18, 'CMK', 'Credmark'),
};

export const SCMK: { [chainId: number]: Token } = {
  [4]: new Token(4, STAKED_CMK_ADDRESSES[4], 18, 'sCMK', 'StakedCredmark'),
  [3]: new Token(3, STAKED_CMK_ADDRESSES[3], 18, 'sCMK', 'StakedCredmark'),
  [5]: new Token(5, STAKED_CMK_ADDRESSES[5], 18, 'sCMK', 'StakedCredmark'),
  [42]: new Token(42, STAKED_CMK_ADDRESSES[42], 18, 'sCMK', 'StakedCredmark'),
};

export const AMPL = new Token(
  1,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth',
);
export const DAI = new Token(
  1,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin',
);

export const USDC: { [chainId: number]: Token } = {
  [1]: new Token(1, USDC_ADDRESSES[1], 6, 'USDC', 'USD//C'),
  [4]: new Token(4, USDC_ADDRESSES[4], 6, 'USDC', 'USD//C'),
  [3]: new Token(3, USDC_ADDRESSES[3], 6, 'USDC', 'USD//C'),
  [5]: new Token(5, USDC_ADDRESSES[5], 6, 'USDC', 'USD//C'),
  [42]: new Token(42, USDC_ADDRESSES[42], 6, 'USDC', 'USD//C'),
};

export const USDT = new Token(
  1,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
);
export const WBTC = new Token(
  1,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC',
);
export const FEI = new Token(
  1,
  '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  18,
  'FEI',
  'Fei USD',
);
export const TRIBE = new Token(
  1,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe',
);
export const FRAX = new Token(
  1,
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  18,
  'FRAX',
  'Frax',
);
export const FXS = new Token(
  1,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share',
);
export const renBTC = new Token(
  1,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC',
);
export const UMA = new Token(
  1,
  '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
  18,
  'UMA',
  'UMA Voting Token v1',
);
export const ETH2X_FLI = new Token(
  1,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index',
);
// Mirror Protocol compat.
export const UST = new Token(
  1,
  '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
  18,
  'UST',
  'Wrapped UST',
);
export const MIR = new Token(
  1,
  '0x09a3ecafa817268f77be1283176b946c4ff2e608',
  18,
  'MIR',
  'Wrapped MIR',
);

export const UNI: { [chainId: number]: Token } = {
  [1]: new Token(1, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
  [4]: new Token(4, UNI_ADDRESS[4], 18, 'UNI', 'Uniswap'),
  [3]: new Token(3, UNI_ADDRESS[3], 18, 'UNI', 'Uniswap'),
  [5]: new Token(5, UNI_ADDRESS[5], 18, 'UNI', 'Uniswap'),
  [42]: new Token(42, UNI_ADDRESS[42], 18, 'UNI', 'Uniswap'),
};
