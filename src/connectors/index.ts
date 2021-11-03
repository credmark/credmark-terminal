import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import env from '~/env';
import getLibrary from '~/utils/getLibrary';

import { FortmaticConnector } from './Fortmatic';
import { NetworkConnector } from './NetworkConnector';

const INFURA_KEY = env.infuraKey;
const FORMATIC_KEY = env.formaticKey;
const PORTIS_ID = env.portisId;
const WALLETCONNECT_BRIDGE_URL = env.walletconnectBridgeUrl;

const NETWORK_URLS: {
  [chainId: number]: string;
} = {
  [1]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [4]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [3]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [5]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [42]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
};

const SUPPORTED_CHAIN_IDS = [1, 4, 3, 42, 5];

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider));
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  infuraId: INFURA_KEY, // obviously a hack
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  // pollingInterval: 15000,
});

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1,
});

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1],
});

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[1],
  appName: 'Credmark Smart Pool',
  // appLogoUrl: UNISWAP_LOGO_URL,
});
