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

export const CMK_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0x4C0E80B61277043AE06f2d0BdE523a3C0e00230C',
  [3]: '0x66c924752E4Ab44a4926c2eB9C5b9818c3538a0A',
};

export const STAKED_CMK_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0xF12E77bEa5A4e67A704f5e6dc51C8f2beFFD264C',
  [3]: '0x54f0a1b74fC4aCFf883713AF2d3CBb5789b73Afe',
};

export const REWARDS_POOL_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0x8c80C7aBb9E38842d74CEab9244a11d12986dBd4',
  [3]: '0x59EaF5A4EC552ecc301938a5E396666605fb1514',
};

export const ACCESS_KEY_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0xc71fAF7bA8d4C50bf5908cB0E8B07A1baD58E7b0',
  [3]: '0xb538197888fE8cA3B6C686C7975FA760caF442b3',
};

export const ACCESS_PROVIDER_ADDRESSES: { [chainId: number]: string } = {
  [4]: '0x9F4B17ad03A17Ea251626ecd1Ff2C794D6Cb3c4B',
  [3]: '0xC6fA948CD7eafFfdA1ABc1EB8969e8f418FE39C1',
};
