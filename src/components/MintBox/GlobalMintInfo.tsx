import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import { useAccessKeyTotalSupply, usePercentCmkStaked } from '~/hooks/stats';

export default function GlobalMintInfo() {
  const accessKeyTotalSupply = useAccessKeyTotalSupply();
  const percentCmkStaked = usePercentCmkStaked();

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
          {percentCmkStaked.loading || !percentCmkStaked.value
            ? '??'
            : percentCmkStaked.value.toFixed(2) + '%'}
        </Text>
      </HStack>
      <HStack my="2">
        <Text flex="1" textAlign="right" color="purple.500" fontWeight="300">
          Total Keys Minted
        </Text>
        <Text flex="1" color="purple.500" fontWeight="700">
          {accessKeyTotalSupply.loading
            ? '??'
            : accessKeyTotalSupply.value?.toString() ?? '??'}
        </Text>
      </HStack>
    </Box>
  );
}
