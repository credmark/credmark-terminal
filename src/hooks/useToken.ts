import { Token } from '@uniswap/sdk-core';
import { arrayify, parseBytes32String } from 'ethers/lib/utils';
import { useMemo } from 'react';

import { useSingleCallResult, NEVER_RELOAD } from '~/state/multicall/hooks';
import isAddress from '~/utils/isAddress';

import { useTokenContract, useBytes32TokenContract } from './useContract';
import { useActiveWeb3React } from './web3';

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string,
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

export function useToken(
  tokenAddress: string | undefined,
): Token | null | undefined {
  const { chainId } = useActiveWeb3React();

  const formattedAddress = isAddress(tokenAddress);

  const tokenContract = useTokenContract(
    formattedAddress ? formattedAddress : undefined,
    false,
  );
  const tokenContractBytes32 = useBytes32TokenContract(
    formattedAddress ? formattedAddress : undefined,
    false,
  );

  const tokenName = useSingleCallResult(
    tokenContract,
    'name',
    undefined,
    NEVER_RELOAD,
  );
  const tokenNameBytes32 = useSingleCallResult(
    tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD,
  );
  const symbol = useSingleCallResult(
    tokenContract,
    'symbol',
    undefined,
    NEVER_RELOAD,
  );
  const symbolBytes32 = useSingleCallResult(
    tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD,
  );
  const decimals = useSingleCallResult(
    tokenContract,
    'decimals',
    undefined,
    NEVER_RELOAD,
  );

  return useMemo(() => {
    if (typeof tokenAddress !== 'string' || !chainId || !formattedAddress)
      return undefined;
    if (decimals.loading || symbol.loading || tokenName.loading) return null;
    if (decimals.result) {
      return new Token(
        chainId,
        formattedAddress,
        decimals.result[0],
        parseStringOrBytes32(
          symbol.result?.[0],
          symbolBytes32.result?.[0],
          'UNKNOWN',
        ),
        parseStringOrBytes32(
          tokenName.result?.[0],
          tokenNameBytes32.result?.[0],
          'Unknown Token',
        ),
      );
    }
    return undefined;
  }, [
    formattedAddress,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    tokenAddress,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ]);
}
