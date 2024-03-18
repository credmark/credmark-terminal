import { Web3ReactHooks } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import type { WalletConnect } from '@web3-react/walletconnect-v2';

import {
  metaMask,
  metaMaskHooks,
  walletConnectV2,
  walletConnectV2Hooks,
} from '~/connectors';

export type Connector = MetaMask | WalletConnect;

export interface WalletInfo {
  connector: Connector;
  hooks: Web3ReactHooks;
  name: string;
  iconURL: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  // INJECTED: {
  //   connector: injected,
  //   name: 'Injected',
  //   iconURL: '/img/wallet/',
  //   description: 'Injected web3 provider.',
  //   href: null,
  //   color: '#010101',
  //   primary: true,
  // },
  METAMASK: {
    connector: metaMask,
    hooks: metaMaskHooks,
    name: 'MetaMask',
    iconURL: '/img/wallet/metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletConnectV2,
    hooks: walletConnectV2Hooks,
    name: 'WalletConnect',
    iconURL: '/img/wallet/walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconURL: '/img/wallet/coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5',
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconURL: '/img/wallet/coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true,
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconURL: '/img/wallet/fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true,
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconURL: '/img/wallet/portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true,
  // },
};
