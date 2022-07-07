import { BigNumber } from '@ethersproject/bignumber';
import { useMemo } from 'react';

import {
  useSingleCallResult,
  useSingleContractMultipleData,
  Result,
} from '~/state/multicall/hooks';

import {
  useCredmarkAccessFactoryContract,
  useCredmarkAccessKeyContract,
} from './useContract';

export interface AccessKeyDetails {
  tokenId: BigNumber;
  expiryTime: Date;
}

interface UseAccessKeysResults {
  loading: boolean;
  accessKeys: AccessKeyDetails[] | undefined;
}

function useAccessKeysFromTokenIds(
  tokenIds: BigNumber[] | undefined,
): UseAccessKeysResults {
  const nftFactory = useCredmarkAccessFactoryContract();

  const inputs = useMemo(
    () =>
      tokenIds ? tokenIds.map((tokenId) => [BigNumber.from(tokenId)]) : [],
    [tokenIds],
  );

  const results = useSingleContractMultipleData(
    nftFactory,
    'expiryTimestamp',
    inputs,
  );

  const loading = useMemo(
    () => results.some(({ loading }) => loading),
    [results],
  );
  const error = useMemo(() => results.some(({ error }) => error), [results]);

  const accessKeys = useMemo(() => {
    if (!loading && !error && tokenIds) {
      return results.map((call, i) => {
        const tokenId = tokenIds[i];
        const result = call.result as Result;
        return {
          tokenId,
          expiryTime: new Date(result[0].toNumber() * 1000),
        };
      });
    }
    return undefined;
  }, [loading, error, results, tokenIds]);

  return {
    loading,
    accessKeys,
  };
}

interface UseAccessKeyResults {
  loading: boolean;
  accessKey: AccessKeyDetails | undefined;
}

export function useAccessKeyFromTokenId(
  tokenId: BigNumber | undefined,
): UseAccessKeyResults {
  const accessKey = useAccessKeysFromTokenIds(tokenId ? [tokenId] : undefined);
  return {
    loading: accessKey.loading,
    accessKey: accessKey.accessKeys?.[0],
  };
}

export function useAccessKeys(
  account: string | null | undefined,
): UseAccessKeysResults {
  const nft = useCredmarkAccessKeyContract();

  const { loading: balanceLoading, result: balanceResult } =
    useSingleCallResult(nft, 'balanceOf', [account ?? undefined]);

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
    nft,
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

  const { accessKeys, loading: accessKeysLoading } =
    useAccessKeysFromTokenIds(tokenIds);

  return {
    loading: someTokenIdsLoading || balanceLoading || accessKeysLoading,
    accessKeys,
  };
}
