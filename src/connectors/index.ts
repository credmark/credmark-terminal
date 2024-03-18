import { Web3ReactHooks, initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions }),
);

export const [walletConnectV2, walletConnectV2Hooks] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          chains: [1],
          showQrModal: true,
          qrModalOptions: {
            themeVariables: {
              '--wcm-z-index': '1501',
            },
          },
        },
      }),
  );

export const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
];
