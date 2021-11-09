import { BigNumber } from '@ethersproject/bignumber';
import { useMemo } from 'react';

import {
  Result,
  useSingleCallResult,
  useSingleContractMultipleData,
} from '~/state/multicall/hooks';

import { useAccessKeyContract } from './useContract';

interface UseAccessKeysResults {
  loading: boolean;
  tokenIds: BigNumber[] | undefined;
}

export function useAccessKeys(
  account: string | null | undefined,
): UseAccessKeysResults {
  const accessKeyContract = useAccessKeyContract();

  const { loading: balanceLoading, result: balanceResult } =
    useSingleCallResult(accessKeyContract, 'balanceOf', [account ?? undefined]);

  // we don't expect any account balance to ever exceed the bounds of max safe int
  const accountBalance: number | undefined = balanceResult?.[0]?.toNumber();

  const tokenIdsArgs = useMemo(() => {
    if (accountBalance && account) {
      const tokenRequests = [];
      for (let i = 0; i < accountBalance; i++) {
        tokenRequests.push([account, i]);
      }
      return tokenRequests;
    }
    return [];
  }, [account, accountBalance]);

  const tokenIdResults = useSingleContractMultipleData(
    accessKeyContract,
    'tokenOfOwnerByIndex',
    tokenIdsArgs,
  );
  const someTokenIdsLoading = useMemo(
    () => tokenIdResults.some(({ loading }) => loading),
    [tokenIdResults],
  );

  const tokenIds = useMemo(() => {
    if (account) {
      return tokenIdResults
        .map(({ result }) => result)
        .filter((result): result is Result => !!result)
        .map((result) => BigNumber.from(result[0]));
    }
    return [];
  }, [account, tokenIdResults]);

  return {
    loading: someTokenIdsLoading || balanceLoading,
    tokenIds,
  };
}
