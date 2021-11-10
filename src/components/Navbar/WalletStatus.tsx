import { Img } from '@chakra-ui/image';
import {
  Box,
  Container,
  Flex,
  HStack,
  LinkBox,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { CMK } from '~/constants/tokens';
import { useAccessKeyBalance, useSCmkBalance } from '~/hooks/stats';
import { useActiveWeb3React } from '~/hooks/web3';
import { useTokenBalance } from '~/state/wallet/hooks';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export default function WalletStatus() {
  const { chainId, account } = useActiveWeb3React();

  const accessKeyBalance = useAccessKeyBalance(account);

  const cmkBalance = useTokenBalance(
    account ?? undefined,
    chainId ? CMK[chainId] : undefined,
  );

  const sCmkBalance = useSCmkBalance(account);

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
          <LinkBox as={VStack} spacing="0">
            <Img src="/img/key.png" h="10" />
            <Text fontWeight="bold" color="purple.500" lineHeight="1.2" pt="2">
              {accessKeyBalance.loading
                ? '??'
                : accessKeyBalance.value?.toString() ?? '??'}
            </Text>
            <NextLink href="/accessKeys" passHref>
              <LinkOverlay>
                <Text
                  fontWeight="300"
                  color="purple.500"
                  lineHeight="1.2"
                  fontSize="sm"
                >
                  Key Minted
                </Text>
              </LinkOverlay>
            </NextLink>
          </LinkBox>
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
              {sCmkBalance.loading || !sCmkBalance.value
                ? '??'
                : formatTokenAmount(sCmkBalance.value, 2, { shorten: true })}
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
