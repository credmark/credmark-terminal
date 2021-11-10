import { BigNumber } from '@ethersproject/bignumber';
import { CurrencyAmount, Fraction } from '@uniswap/sdk-core';
import { useMemo } from 'react';

import { CMK_ADDRESSES, STAKED_CMK_ADDRESSES } from '~/constants/addresses';
import { SCMK } from '~/constants/tokens';
import {
  Result,
  useSingleCallResult,
  useSingleContractMultipleData,
} from '~/state/multicall/hooks';

import { useAccessKeys } from './useAccessKeys';
import {
  useAccessKeyContract,
  useStakedCredmarkContract,
  useTokenContract,
} from './useContract';
import { useActiveWeb3React } from './web3';

interface UseAccessKeyTotalSupply {
  loading: boolean;
  value: BigNumber | undefined;
}

export function useAccessKeyTotalSupply(): UseAccessKeyTotalSupply {
  const accessKeyContract = useAccessKeyContract();

  const { loading, result: totalSupplyResult } = useSingleCallResult(
    accessKeyContract,
    'totalSupply',
  );

  const totalSupply = totalSupplyResult?.[0] as BigNumber | undefined;

  return { loading, value: totalSupply };
}

export function useAccessKeyBalance(
  account: string | null | undefined,
): UseAccessKeyTotalSupply {
  const accessKeyContract = useAccessKeyContract();

  const { loading, result: balanceResult } = useSingleCallResult(
    accessKeyContract,
    'balanceOf',
    [account ?? undefined],
  );

  const balance = balanceResult?.[0] as BigNumber | undefined;

  return { loading, value: balance };
}

export function useSCmkBalance(account: string | null | undefined) {
  const { chainId } = useActiveWeb3React();
  const accessKeyContract = useAccessKeyContract();
  const sCmkContract = useStakedCredmarkContract();

  const { tokenIds } = useAccessKeys(account);

  const result = useSingleContractMultipleData(
    accessKeyContract,
    'cmkValue',
    (tokenIds ?? []).map((tokenId) => [tokenId]),
  );

  const totalCmkValue = useMemo(() => {
    return result
      .map(({ result }) => result)
      .filter((result): result is Result => !!result)
      .map((result) => result[0] as BigNumber)
      .reduce((prev, curr) => prev.add(curr), BigNumber.from(0));
  }, [result]);

  const { loading: sCmkBalanceLoading, result: sCmkBalanceResult } =
    useSingleCallResult(sCmkContract, 'cmkToShares', [totalCmkValue]);

  const sCMK = chainId ? SCMK[chainId] : undefined;
  const sCmkBalance =
    sCmkBalanceResult && sCMK
      ? CurrencyAmount.fromRawAmount(sCMK, sCmkBalanceResult?.[0].toString())
      : undefined;

  return {
    loading: sCmkBalanceLoading || result.find((r) => r.loading),
    value: sCmkBalance,
  };
}

export function usePercentCmkStaked() {
  const { chainId } = useActiveWeb3React();

  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const { loading: cmkTotalSupplyLoading, result: cmkTotalSupplyResult } =
    useSingleCallResult(cmkContract, 'totalSupply');

  const cmkTotalSupply = cmkTotalSupplyResult?.[0] as BigNumber | undefined;

  const { loading: cmkBalanceLoading, result: sCmkBalanceResult } =
    useSingleCallResult(cmkContract, 'balanceOf', [
      chainId ? STAKED_CMK_ADDRESSES[chainId] : undefined,
    ]);

  const sCmkBalance = sCmkBalanceResult?.[0] as BigNumber | undefined;
  return {
    loading: cmkTotalSupplyLoading || cmkBalanceLoading,
    value:
      sCmkBalance && cmkTotalSupply
        ? new Fraction(
            sCmkBalance.mul(100).toString(),
            cmkTotalSupply.toString(),
          )
        : undefined,
  };
}
