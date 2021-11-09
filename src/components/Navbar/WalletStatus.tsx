import { Img } from '@chakra-ui/image';
import { Box, Container, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import { CMK, SCMK } from '~/constants/tokens';
import { useActiveWeb3React } from '~/hooks/web3';
import { useSingleCallResult } from '~/state/multicall/hooks';

import { useAccessKeyContract } from '../../hooks/useContract';
import { useTokenBalance } from '../../state/wallet/hooks';
import { formatTokenAmount } from '../../utils/formatTokenAmount';

export default function WalletStatus() {
  const { chainId, account } = useActiveWeb3React();
  const accessKeyContract = useAccessKeyContract();

  const { loading: accessKeysResultLoading, result: accessKeysResult } =
    useSingleCallResult(accessKeyContract, 'balanceOf', [account ?? undefined]);

  const accessKeysMinted: number | undefined =
    accessKeysResult?.[0]?.toNumber();

  const cmkBalance = useTokenBalance(
    account ?? undefined,
    chainId ? CMK[chainId] : undefined,
  );

  const sCmkBalance = useTokenBalance(
    account ?? undefined,
    chainId ? SCMK[chainId] : undefined,
  );

  return (
    <Container
      maxW="container.md"
      bg="white"
      rounded="3xl"
      shadow="xl"
      px="8"
      py="4"
    >
      <Text
        color="purple.500"
        fontFamily="Credmark Regular"
        textAlign="center"
        fontSize="3xl"
      >
        YOUR WALLET
      </Text>
      <Flex align="center" mt="8" mb="4">
        <HStack flex="1" spacing="8">
          <VStack spacing="0">
            <Img src="/img/key.png" h="10" />
            <Text fontWeight="bold" color="purple.500" lineHeight="1.2" pt="2">
              {accessKeysResultLoading || accessKeysMinted === undefined
                ? '??'
                : accessKeysMinted}
            </Text>
            <Text
              fontWeight="300"
              color="purple.500"
              lineHeight="1.2"
              fontSize="sm"
            >
              Key Minted
            </Text>
          </VStack>
          <Box w="2px" h="80px" bgGradient="linear(to-b, purple.500, white)" />
          <VStack spacing="0">
            <Img src="/img/cmk.png" h="10" />
            <Text fontWeight="bold" color="purple.500" lineHeight="1.2" pt="2">
              {cmkBalance
                ? formatTokenAmount(cmkBalance, 2, { shorten: true })
                : '??'}
            </Text>
            <Text
              fontWeight="300"
              color="purple.500"
              lineHeight="1.2"
              fontSize="sm"
            >
              CMK
            </Text>
          </VStack>
          <Box w="2px" h="80px" bgGradient="linear(to-b, purple.500, white)" />
          <VStack spacing="0">
            <Img src="/img/scmk.png" h="10" />
            <Text fontWeight="bold" color="purple.500" lineHeight="1.2" pt="2">
              {sCmkBalance
                ? formatTokenAmount(sCmkBalance, 2, { shorten: true })
                : '??'}
            </Text>
            <Text
              fontWeight="300"
              color="purple.500"
              lineHeight="1.2"
              fontSize="sm"
            >
              Staked CMK
            </Text>
          </VStack>
        </HStack>
        <Box w="256px">
          <HStack>
            <Text
              flex="1"
              textAlign="right"
              fontSize="sm"
              color="purple.500"
              fontWeight="300"
              whiteSpace="nowrap"
            >
              Net Reward Amount
            </Text>
            <Text flex="1" color="purple.500" fontWeight="700">
              X.XXX sCMK
            </Text>
          </HStack>
          <HStack>
            <Text
              flex="1"
              textAlign="right"
              fontSize="sm"
              color="purple.500"
              fontWeight="300"
              whiteSpace="nowrap"
            >
              Net Reward Yield
            </Text>
            <Text flex="1" color="purple.500" fontWeight="700">
              X.XX%
            </Text>
          </HStack>
          <HStack>
            <Text
              flex="1"
              textAlign="right"
              fontSize="sm"
              color="purple.500"
              fontWeight="300"
              whiteSpace="nowrap"
            >
              ROI (5-day rate)
            </Text>
            <Text flex="1" color="purple.500" fontWeight="700">
              X.XX%
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Container>
  );
}
