import { VStack } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import { useAccessKeys } from '~/hooks/useAccessKeys';
import { useActiveWeb3React } from '~/hooks/web3';

import AccessKeyListItem from './AccessKeyItem';

export default function AccessKeyList() {
  const { account } = useActiveWeb3React();
  const { loading, tokenIds } = useAccessKeys(account);

  if (loading) {
    return (
      <VStack spacing="4" align="stretch">
        <Skeleton
          height="60px"
          bg={'white'}
          border="1px solid"
          borderColor="gray.100"
          rounded="2xl"
        />
        <Skeleton
          height="60px"
          bg={'white'}
          border="1px solid"
          borderColor="gray.100"
          rounded="2xl"
        />
        <Skeleton
          height="60px"
          bg={'white'}
          border="1px solid"
          borderColor="gray.100"
          rounded="2xl"
        />
      </VStack>
    );
  }

  return (
    <VStack align="stretch">
      {(tokenIds ?? [])?.map((tokenId) => (
        <AccessKeyListItem key={tokenId.toString()} tokenId={tokenId} />
      ))}
    </VStack>
  );
}
