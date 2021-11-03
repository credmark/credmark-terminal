import { Web3Provider } from '@ethersproject/providers';
import { createWeb3ReactRoot } from '@web3-react/core';
import React from 'react';

import { NetworkContextName } from '~/constants/misc';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function Web3ProviderNetworkSSR({
  children,
  getLibrary,
}: {
  children: React.ReactNode;
  getLibrary: (provider: any) => Web3Provider;
}): JSX.Element {
  return (
    <Web3ProviderNetwork getLibrary={getLibrary}>
      {children}
    </Web3ProviderNetwork>
  );
}

export default Web3ProviderNetworkSSR;
