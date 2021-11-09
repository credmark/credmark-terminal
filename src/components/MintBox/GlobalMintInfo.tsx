import { Box, HStack, Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';

import { CMK_ADDRESSES, STAKED_CMK_ADDRESSES } from '~/constants/addresses';
import { useAccessKeyContract, useTokenContract } from '~/hooks/useContract';
import { useActiveWeb3React } from '~/hooks/web3';
import { useSingleCallResult } from '~/state/multicall/hooks';

export default function GlobalMintInfo() {
  const { chainId } = useActiveWeb3React();
  const accessKeyContract = useAccessKeyContract();
  const cmkContract = useTokenContract(
    chainId ? CMK_ADDRESSES[chainId] : undefined,
  );

  const { result: totalSupplyResult } = useSingleCallResult(
    accessKeyContract,
    'totalSupply',
  );

  const totalSupply = totalSupplyResult?.[0]?.toString();

  const { result: cmkTotalSupplyResult } = useSingleCallResult(
    cmkContract,
    'totalSupply',
  );

  const cmkTotalSupply = cmkTotalSupplyResult?.[0] as BigNumber | undefined;

  const { result: sCmkBalanceResult } = useSingleCallResult(
    cmkContract,
    'balanceOf',
    [chainId ? STAKED_CMK_ADDRESSES[chainId] : undefined],
  );

  const sCmkBalance = sCmkBalanceResult?.[0] as BigNumber | undefined;

  const percCmkStaked =
    sCmkBalance && cmkTotalSupply
      ? sCmkBalance.mul(1000000).div(cmkTotalSupply).toNumber() / 10000
      : undefined;

  return (
    <Box whiteSpace="nowrap" w="100%">
      <HStack my="2">
        <Text flex="1" textAlign="right" color="purple.500" fontWeight="300">
          Staking APY
        </Text>
        <Text flex="1" color="purple.500" fontWeight="700">
          XXX.XX%
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" color="purple.500" fontWeight="300">
          Total Value Deposited
        </Text>
        <Text flex="1" color="purple.500" fontWeight="700">
          $XXX,XXX.XX
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" color="purple.500" fontWeight="300">
          % of CMK Staked
        </Text>
        <Text flex="1" color="purple.500" fontWeight="700">
          {percCmkStaked?.toFixed(2)}%
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" color="purple.500" fontWeight="300">
          Total Keys Minted
        </Text>
        <Text flex="1" color="purple.500" fontWeight="700">
          {totalSupply}
        </Text>
      </HStack>
    </Box>
  );
}
