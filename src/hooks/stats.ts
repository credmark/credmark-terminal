import { BigNumber } from '@ethersproject/bignumber';
import { BigintIsh, CurrencyAmount, Fraction } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { useMemo } from 'react';

import {
  CMK_ADDRESSES,
  STAKED_CMK_ADDRESSES,
  LOCKED_CMK_ADDRESSES,
  REWARDS_POOL_ADDRESSES,
} from '~/constants/addresses';
import { CMK, SCMK } from '~/constants/tokens';
import {
  Result,
  useSingleCallResult,
  useSingleContractMultipleData,
} from '~/state/multicall/hooks';

import { useAccessKeys } from './useAccessKeys';
import {
  useAccessKeyContract,
  useRewardsPoolContract,
  useStakedCredmarkContract,
  useTokenContract,
} from './useContract';
import { useUSDCValue } from './useUSDCPrice';
import { useActiveWeb3React } from './web3';

const BN_ZERO = BigNumber.from(0);
const SEC_IN_YEAR = BigNumber.from(365 * 24 * 3600);

export function useAccessKeyTotalSupply() {
  const accessKeyContract = useAccessKeyContract();

  const { loading, result: totalSupplyResult } = useSingleCallResult(
    accessKeyContract,
    'totalSupply',
  );

  const totalSupply = totalSupplyResult?.[0] as BigNumber | undefined;

  return { loading, value: totalSupply };
}

export function useAccessKeyBalance(account: string | null | undefined) {
  const accessKeyContract = useAccessKeyContract();

  const { loading, result: balanceResult } = useSingleCallResult(
    accessKeyContract,
    'balanceOf',
    [account ?? undefined],
  );

  const balance = balanceResult?.[0] as BigNumber | undefined;

  return { loading, value: balance };
}

export function useCmkTotalSupply() {
  const { chainId } = useActiveWeb3React();
  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const { loading, result: totalSupplyResult } = useSingleCallResult(
    cmkContract,
    'totalSupply',
  );

  const totalSupply = totalSupplyResult?.[0]?.toString();
  const cmk = chainId ? CMK[chainId] : undefined;

  return {
    loading,
    value:
      totalSupply && cmk
        ? CurrencyAmount.fromRawAmount(cmk, totalSupply)
        : undefined,
  };
}

export function useCmkCirculatingSupply() {
  const { chainId } = useActiveWeb3React();
  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const { loading: totalSupplyLoading, result: totalSupplyResult } =
    useSingleCallResult(cmkContract, 'totalSupply');

  const totalSupply = totalSupplyResult?.[0] as BigNumber | undefined;

  const lockedAddresses =
    (chainId ? LOCKED_CMK_ADDRESSES[chainId] : undefined) ?? [];

  const result = useSingleContractMultipleData(
    cmkContract,
    'balanceOf',
    lockedAddresses.map((addr) => [addr]),
  );

  const totalCmkLocked = useMemo(() => {
    return result
      .map(({ result }) => result)
      .filter((result): result is Result => !!result)
      .map((result) => result[0] as BigNumber)
      .reduce((prev, curr) => prev.add(curr), BigNumber.from(0));
  }, [result]);

  const cmk = chainId ? CMK[chainId] : undefined;

  return {
    loading: totalSupplyLoading || !!result.find((res) => res.loading),
    value:
      cmk && totalSupply && totalCmkLocked
        ? CurrencyAmount.fromRawAmount(
            cmk,
            totalSupply.sub(totalCmkLocked).toString(),
          )
        : undefined,
  };
}

export function useSCmkTotalSupply() {
  const sCmkContract = useStakedCredmarkContract();

  const { loading, result: totalSupplyResult } = useSingleCallResult(
    sCmkContract,
    'totalSupply',
  );

  const totalSupply = totalSupplyResult?.[0] as BigNumber | undefined;

  return { loading, value: totalSupply };
}

export function useCmkToSCmk(cmkAmount: BigNumber) {
  const { chainId } = useActiveWeb3React();
  const sCmkContract = useStakedCredmarkContract();

  const { loading, result: cmkToSharesResult } = useSingleCallResult(
    sCmkContract,
    'cmkToShares',
    [cmkAmount],
  );

  const sCmkShares = cmkToSharesResult?.[0] as BigNumber | undefined;

  const sCMK = chainId ? SCMK[chainId] : undefined;

  return {
    loading,
    value:
      sCmkShares && sCMK
        ? CurrencyAmount.fromRawAmount(sCMK, sCmkShares?.toString())
        : undefined,
  };
}

export function useSCmkToCmk(sCmkAmount: BigNumber) {
  const sCmkContract = useStakedCredmarkContract();

  const { loading, result: sharesToCmkResult } = useSingleCallResult(
    sCmkContract,
    'sCmkAmount',
    [sCmkAmount],
  );

  return {
    loading,
    value: sharesToCmkResult?.[0] as BigNumber | undefined,
  };
}

export function useSCmkBalance(account: string | null | undefined) {
  const { chainId } = useActiveWeb3React();

  const sCmkContract = useStakedCredmarkContract();

  const { loading, result: balanceResult } = useSingleCallResult(
    sCmkContract,
    'balanceOf',
    [account ?? undefined],
  );

  const balance = balanceResult?.[0] as BigNumber | undefined;

  const sCMK = chainId ? SCMK[chainId] : undefined;

  return {
    loading,
    value:
      balance && sCMK
        ? CurrencyAmount.fromRawAmount(sCMK, balance?.toString())
        : undefined,
  };
}

export function useSCmkBalanceLockedInAccessKey(
  account: string | null | undefined,
) {
  const { chainId } = useActiveWeb3React();
  const accessKeyContract = useAccessKeyContract();

  const accessKeys = useAccessKeys(account);

  const result = useSingleContractMultipleData(
    accessKeyContract,
    'cmkValue',
    (accessKeys.tokenIds ?? []).map((tokenId) => [tokenId]),
  );

  const totalCmkValue = useMemo(() => {
    return result
      .map(({ result }) => result)
      .filter((result): result is Result => !!result)
      .map((result) => result[0] as BigNumber)
      .reduce((prev, curr) => prev.add(curr), BigNumber.from(0));
  }, [result]);

  const sCmkBalance = useCmkToSCmk(totalCmkValue);

  return {
    loading:
      accessKeys.loading ||
      sCmkBalance.loading ||
      !!result.find((r) => r.loading),
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

export function useUnissuedRewards() {
  const rewardsPoolContract = useRewardsPoolContract();

  const { loading, result: unissuedRewardsResult } = useSingleCallResult(
    rewardsPoolContract,
    'unissuedRewards',
  );

  const unissuedRewards = unissuedRewardsResult?.[0] as BigNumber | undefined;

  return { loading, value: unissuedRewards };
}

export function useNextRewardAmount(account: string | null | undefined) {
  const { chainId } = useActiveWeb3React();

  const { loading: sCmkTotalSupplyLoading, value: sCmkTotalSupply } =
    useSCmkTotalSupply();
  const { loading: unissuedRewardsCmkLoading, value: unissuedRewardsCmk } =
    useUnissuedRewards();
  const { loading: sCmkBalanceLoading, value: sCmkBalance } =
    useSCmkBalance(account);

  const { loading: unissuedRewardsSCmkLoading, value: unissuedRewardsSCmk } =
    useCmkToSCmk(
      sCmkTotalSupply &&
        unissuedRewardsCmk &&
        sCmkBalance &&
        !sCmkTotalSupply.eq(BN_ZERO)
        ? BigNumber.from(sCmkBalance.quotient.toString())
            .mul(unissuedRewardsCmk)
            .div(sCmkTotalSupply)
        : BN_ZERO,
    );

  const loading =
    sCmkBalanceLoading ||
    sCmkTotalSupplyLoading ||
    unissuedRewardsCmkLoading ||
    unissuedRewardsSCmkLoading;

  return {
    loading,
    value: unissuedRewardsSCmk,
  };
}

export function useCmkToUsdcPrice(rawAmount?: BigintIsh) {
  const { chainId } = useActiveWeb3React();

  const currency = chainId ? CMK[chainId] : undefined;

  const amount = currency
    ? CurrencyAmount.fromRawAmount(
        currency,
        rawAmount ??
          JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals)),
      )
    : undefined;

  return useUSDCValue(amount);
}

export function useStakingApyPercent() {
  const { chainId } = useActiveWeb3React();

  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const rewardsPoolContract = useRewardsPoolContract();

  const {
    loading: rewardsPoolEndTimeLoading,
    result: rewardsPoolEndTimeResult,
  } = useSingleCallResult(rewardsPoolContract, 'endTime');

  const {
    loading: rewardsPoolCmkBalanceLoading,
    result: rewardsPoolCmkBalanceResult,
  } = useSingleCallResult(cmkContract, 'balanceOf', [
    chainId ? REWARDS_POOL_ADDRESSES[chainId] : undefined,
  ]);

  const {
    loading: stakedCmkCmkBalanceLoading,
    result: stakedCmkCmkBalanceResult,
  } = useSingleCallResult(cmkContract, 'balanceOf', [
    chainId ? STAKED_CMK_ADDRESSES[chainId] : undefined,
  ]);

  const rewardsPoolEndTime = rewardsPoolEndTimeResult?.[0] as
    | BigNumber
    | undefined;

  const rewardsPoolCmkBalance = rewardsPoolCmkBalanceResult?.[0] as
    | BigNumber
    | undefined;

  const stakedCmkCmkBalance = stakedCmkCmkBalanceResult?.[0] as
    | BigNumber
    | undefined;

  const nowInSec = BigNumber.from(Date.now()).div(1000);
  const timeLeftInSec =
    rewardsPoolEndTime && rewardsPoolEndTime.gt(nowInSec)
      ? rewardsPoolEndTime.sub(nowInSec)
      : undefined;

  return {
    loading:
      rewardsPoolEndTimeLoading ||
      rewardsPoolCmkBalanceLoading ||
      stakedCmkCmkBalanceLoading,
    value:
      rewardsPoolCmkBalance &&
      timeLeftInSec &&
      stakedCmkCmkBalance &&
      !stakedCmkCmkBalance.eq(BN_ZERO) &&
      !timeLeftInSec.eq(BN_ZERO)
        ? new Fraction(
            JSBI.BigInt(
              rewardsPoolCmkBalance.mul(100).mul(SEC_IN_YEAR).toString(),
            ),
            JSBI.BigInt(timeLeftInSec.mul(stakedCmkCmkBalance).toString()),
          )
        : undefined,
  };
}

export function useTotalValueDeposited() {
  const { chainId } = useActiveWeb3React();

  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const { result: stakedCmkCmkBalanceResult } = useSingleCallResult(
    cmkContract,
    'balanceOf',
    [chainId ? STAKED_CMK_ADDRESSES[chainId] : undefined],
  );
  const stakedCmkCmkBalance = stakedCmkCmkBalanceResult?.[0] as
    | BigNumber
    | undefined;

  return useCmkToUsdcPrice(stakedCmkCmkBalance?.toString() ?? '0');
}
