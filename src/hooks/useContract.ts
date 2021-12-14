import { Contract } from '@ethersproject/contracts';
import QuoterABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import { useMemo } from 'react';

import ENS_PUBLIC_RESOLVER_ABI from '~/abis/ens-public-resolver.json';
import ENS_ABI from '~/abis/ens-registrar.json';
import ERC20_BYTES32_ABI from '~/abis/erc20-bytes32.json';
import ERC20_ABI from '~/abis/erc20.json';
import REWARDS_POOL_ABI from '~/abis/rewards-pool.json';
import STAKED_CREDMARK_ABI from '~/abis/staked-credmark.json';
import { RewardsPool, StakedCredmark } from '~/abis/types';
import { EnsPublicResolver } from '~/abis/types/EnsPublicResolver';
import { EnsRegistrar } from '~/abis/types/EnsRegistrar';
import { Erc20 } from '~/abis/types/Erc20';
import { Quoter } from '~/abis/types/Quoter';
import { UniswapInterfaceMulticall } from '~/abis/types/UniswapInterfaceMulticall';
import MulticallABI from '~/abis/uniswap-interface-multicall.json';
import {
  ENS_REGISTRAR_ADDRESSES,
  MULTICALL_ADDRESS,
  STAKED_CMK_ADDRESSES,
  REWARDS_POOL_ADDRESSES,
  QUOTER_ADDRESSES,
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

export function useV3Quoter(): Quoter | null {
  return useContract<Quoter>(QUOTER_ADDRESSES, QuoterABI.abi);
}

export function useStakedCredmarkContract(): StakedCredmark | null {
  return useContract<StakedCredmark>(
    STAKED_CMK_ADDRESSES,
    STAKED_CREDMARK_ABI.abi,
  );
}

export function useRewardsPoolContract(): RewardsPool | null {
  return useContract<RewardsPool>(REWARDS_POOL_ADDRESSES, REWARDS_POOL_ABI.abi);
}
