import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';

import ENS_PUBLIC_RESOLVER_ABI from '~/abis/ens-public-resolver.json';
import ENS_ABI from '~/abis/ens-registrar.json';
import ERC20_BYTES32_ABI from '~/abis/erc20-bytes32.json';
import ERC20_ABI from '~/abis/erc20.json';
import { EnsPublicResolver } from '~/abis/types/EnsPublicResolver';
import { EnsRegistrar } from '~/abis/types/EnsRegistrar';
import { Erc20 } from '~/abis/types/Erc20';
import { UniswapInterfaceMulticall } from '~/abis/types/UniswapInterfaceMulticall';
import MulticallABI from '~/abis/uniswap-interface-multicall.json';
import {
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESS,
} from '~/constants/addresses';
import getContract from '~/utils/getContract';

import { useActiveWeb3React } from './web3';

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [
    addressOrAddressMap,
    ABI,
    library,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T;
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean,
): Erc20 | null {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useMulticall2Contract(): UniswapInterfaceMulticall {
  return useContract<UniswapInterfaceMulticall>(
    MULTICALL_ADDRESS,
    MulticallABI.abi,
    false,
  ) as UniswapInterfaceMulticall;
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean,
): EnsRegistrar | null {
  return useContract<EnsRegistrar>(
    ENS_REGISTRAR_ADDRESSES,
    ENS_ABI,
    withSignerIfPossible,
  );
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean,
): EnsPublicResolver | null {
  return useContract<EnsPublicResolver>(
    address,
    ENS_PUBLIC_RESOLVER_ABI,
    withSignerIfPossible,
  );
}
