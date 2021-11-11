import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from '@uniswap/v3-sdk';

import { constructSameAddressMap } from '~/utils/constructSameAddressMap';

export const MULTICALL_ADDRESS = constructSameAddressMap(
  '0x1F98415757620B543A52E61c46B32eB19261F984',
);

export const ENS_REGISTRAR_ADDRESSES: { [chainId: number]: string } = {
  [1]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [5]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [4]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [3]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
};

export const QUOTER_ADDRESSES = constructSameAddressMap(
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
);

export const V3_CORE_FACTORY_ADDRESSES =
  constructSameAddressMap(V3_FACTORY_ADDRESS);

export const UNI_ADDRESS = constructSameAddressMap(
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
);

export const CMK_ADDRESSES: { [chainId: number]: string } = {
  [1]: '0x68CFb82Eacb9f198d508B514d898a403c449533E',
  [4]: '0x4C0E80B61277043AE06f2d0BdE523a3C0e00230C',
  [3]: '0x66c924752E4Ab44a4926c2eB9C5b9818c3538a0A',
  [5]: '0x70Fa6E5C1b5a103E7C3F70CD3F6C4856306c0ed2',
  [42]: '0xbdE2c4a0Ae933723a53bd38DbaE6831EE8580Ba1',
};

export const LOCKED_CMK_ADDRESSES: { [chainId: number]: string[] } = {
  [1]: [
    '0xCbF507C87f19B58fB719B65697Fb7fA84D682aA9',
    '0xCA9bb8A10B2C0FB16A18eDae105456bf7e91B041',
    '0x70371C6D23A26Df7Bf0654C47D69ddE9000013E7',
    '0x0f8d3D79f5Fb9EDFceFF399F056c996eb9b89C67',
    '0xC2560D7D2cF12f921193874cc8dfBC4bb162b7cb',
    '0xdb9DCecbA3f21e2aa53897a05A92F89209731b68',
    '0x5CE367c907a119afa25f4DBEe4f5B4705C802Df5',
    '0x46d812De7EF3cA2E3c1D8EfFb496F070b2202DFF',
    '0x02bcb9675727ade60243c3d467a3bf152142698b',
    '0x654958393b7e54f1e2e51f736a14b9d26d00eb1e',
  ],
  [4]: ['0x16B57599b3C61Ca7A4B11e782105440760649549'],
  [3]: ['0x16B57599b3C61Ca7A4B11e782105440760649549'],
  [5]: ['0x16B57599b3C61Ca7A4B11e782105440760649549'],
  [42]: ['0x16B57599b3C61Ca7A4B11e782105440760649549'],
};

export const STAKED_CMK_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0xF12E77bEa5A4e67A704f5e6dc51C8f2beFFD264C',
  [3]: '0x54f0a1b74fC4aCFf883713AF2d3CBb5789b73Afe',
  [5]: '0xe199AbE30D17282e89167f4063AD922186230c9F',
  [42]: '0x4B07B8d9D458cDe9f1968552737927f012be4A88',
};

export const REWARDS_POOL_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0x8c80C7aBb9E38842d74CEab9244a11d12986dBd4',
  [3]: '0x59EaF5A4EC552ecc301938a5E396666605fb1514',
  [5]: '0x441F56deFAf3BB9886F93657b85A6150C8E2F191',
  [42]: '0x770EdA021715F7205D6eC9093F283a648cfc64e3',
};

export const ACCESS_KEY_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0xc71fAF7bA8d4C50bf5908cB0E8B07A1baD58E7b0',
  [3]: '0xb538197888fE8cA3B6C686C7975FA760caF442b3',
  [5]: '0x3AA3b2bAf8e588B8fF562D33BF2f3C18f417F386',
  [42]: '0x161F321D927A176F6CFd5dfB06b9430018DADDd8',
};

export const ACCESS_PROVIDER_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0x9F4B17ad03A17Ea251626ecd1Ff2C794D6Cb3c4B',
  [3]: '0xC6fA948CD7eafFfdA1ABc1EB8969e8f418FE39C1',
  [5]: '0x2bd16489ce2a61Bf8C0C4F18961cD42910036a78',
  [42]: '0x62FfDE060878EA5f43b056ecaAAa6120F119A6FB',
};
