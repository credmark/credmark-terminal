import { Box, HStack, Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import React from 'react';

import {
  usePercentCmkStaked,
  useSCmkToCmk,
  useStakingApyPercent,
  useTotalValueDeposited,
} from '~/hooks/stats';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export default function GlobalMintInfo() {
  const percentCmkStaked = usePercentCmkStaked();
  const stakingApyPercent = useStakingApyPercent();
  const totalValueDeposited = useTotalValueDeposited();
  const scmkToCmk = useSCmkToCmk(BigNumber.from('1000000000000000000')); // 1 xCMK

  return (
    <Box whiteSpace="nowrap" w="100%">
      <HStack my="2">
        <Text flex="1" textAlign="right" fontWeight="300">
          Staking APR
        </Text>
        <Text flex="1" fontWeight="700">
          {stakingApyPercent.loading || !stakingApyPercent.value
            ? '??'
            : stakingApyPercent.value.toFixed(2) + '%'}
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" fontWeight="300">
          1 xCMK =
        </Text>
        <Text flex="1" fontWeight="700">
          {!scmkToCmk.loading
            ? formatTokenAmount(scmkToCmk.value, 4) + ' CMK'
            : '??'}
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" fontWeight="300">
          Total Value Deposited
        </Text>
        <Text flex="1" fontWeight="700">
          {totalValueDeposited
            ? '$' +
              formatTokenAmount(totalValueDeposited, 2, {
                withComma: true,
              })
            : '??'}
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" fontWeight="300">
          % of CMK Staked
        </Text>
        <Text flex="1" fontWeight="700">
          {percentCmkStaked.loading || !percentCmkStaked.value
            ? '??'
            : percentCmkStaked.value.toFixed(2) + '%'}
        </Text>
      </HStack>
    </Box>
  );
}
