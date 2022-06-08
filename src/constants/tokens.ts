import { Currency, Ether, Token } from '@uniswap/sdk-core';

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
  [1]: new Token(1, STAKED_CMK_ADDRESSES[1], 18, 'xCMK', 'StakedCredmark'),
  [4]: new Token(4, STAKED_CMK_ADDRESSES[4], 18, 'xCMK', 'StakedCredmark'),
  [3]: new Token(3, STAKED_CMK_ADDRESSES[3], 18, 'xCMK', 'StakedCredmark'),
  [5]: new Token(5, STAKED_CMK_ADDRESSES[5], 18, 'xCMK', 'StakedCredmark'),
  [42]: new Token(42, STAKED_CMK_ADDRESSES[42], 18, 'xCMK', 'StakedCredmark'),
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

export const ETH: { [chainId: number]: Currency } = {
  [1]: Ether.onChain(1),
  [4]: Ether.onChain(4),
  [3]: Ether.onChain(3),
  [5]: Ether.onChain(5),
  [42]: Ether.onChain(42),
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

export const ILV = new Token(
  1,
  '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E',
  18,
  'ILV',
  'Illuvium',
);

export const BIT = new Token(
  1,
  '0x1A4b46696b2bB4794Eb3D4c26f1c55F9170fa4C5',
  18,
  'BIT',
  'BitDAO',
);

export const TOKE = new Token(
  1,
  '0x2e9d63788249371f1DFC918a52f8d799F4a38C94',
  18,
  'TOKE',
  'Tokemak',
);

export const OHM = new Token(
  1,
  '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
  9,
  'OHM',
  'Olympus',
);

export const JPEG = new Token(
  1,
  '0xe80c0cd204d654cebe8dd64a4857cab6be8345a3',
  18,
  'JPEG',
  "JPEG'd",
);

export const SUSHI = new Token(
  1,
  '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
  18,
  'SUSHI',
  'SushiToken',
);

export const stETH = new Token(
  1,
  '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  18,
  'stETH',
  'Liquid staked Ether 2.0',
);

export const THREE_CRV = new Token(
  1,
  '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
  18,
  '3Crv',
  'Curve.fi DAI/USDC/USDT',
);

export const MIM = new Token(
  1,
  '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
  18,
  'MIM',
  'Magic Internet Money',
);

export const cyDAI = new Token(
  1,
  '0x8e595470Ed749b85C6F7669de83EAe304C2ec68F',
  8,
  'cyDAI',
  'Iron Bank Dai Stablecoin',
);

export const cyUSDC = new Token(
  1,
  '0x76Eb2FE28b36B3ee97F3Adae0C69606eeDB2A37c',
  8,
  'cyUSDC',
  'Iron Bank USD Coin',
);

export const cyUSDT = new Token(
  1,
  '0x48759F220ED983dB51fA7A8C0D2AAb8f3ce4166a',
  8,
  'cyUSDT',
  'Iron Bank Tether USD',
);

export const cvxFXS = new Token(
  1,
  '0xFEEf77d3f69374f66429C91d732A244f074bdf74',
  18,
  'cvxFXS',
  'Convex FXS',
);

export const CRV = new Token(
  1,
  '0xD533a949740bb3306d119CC777fa900bA034cd52',
  18,
  'CRV',
  'Curve DAO Token',
);

export const cvxCRV = new Token(
  1,
  '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7',
  18,
  'cvxCRV',
  'Convex CRV',
);

export const sETH2 = new Token(
  1,
  '0xFe2e637202056d30016725477c5da089Ab0A043A',
  18,
  'sETH2',
  'StakeWise Staked ETH2',
);

export const WISE = new Token(
  1,
  '0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6',
  18,
  'WISE',
  'Wise Token',
);

export const MC = new Token(
  1,
  '0x949D48EcA67b17269629c7194F4b727d4Ef9E5d6',
  18,
  'MC',
  'Merit Circle',
);

export const SYN = new Token(
  1,
  '0x0f2D719407FdBeFF09D87557AbB7232601FD9F29',
  18,
  'SYN',
  'Synapse',
);

export const FNK = new Token(
  1,
  '0xB5FE099475d3030DDe498c3BB6F3854F762A48Ad',
  18,
  'FNK',
  'Finiko',
);

export const AL_USD = new Token(
  1,
  '0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9',
  18,
  'alUSD',
  'Alchemix USD',
);

export const UNI: { [chainId: number]: Token } = {
  [1]: new Token(1, UNI_ADDRESS[1], 18, 'UNI', 'Uniswap'),
  [4]: new Token(4, UNI_ADDRESS[4], 18, 'UNI', 'Uniswap'),
  [3]: new Token(3, UNI_ADDRESS[3], 18, 'UNI', 'Uniswap'),
  [5]: new Token(5, UNI_ADDRESS[5], 18, 'UNI', 'Uniswap'),
  [42]: new Token(42, UNI_ADDRESS[42], 18, 'UNI', 'Uniswap'),
};
