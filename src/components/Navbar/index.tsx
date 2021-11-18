import { Badge, Container, HStack, Img, Text, VStack } from '@chakra-ui/react';
import React from 'react';

import { useActiveWeb3React } from '~/hooks/web3';

import Sidebar from './Sidebar';
import WalletStatus from './WalletStatus';
import Web3Status from './Web3Status';

const NETWORK_LABELS: { [chainId: number]: string } = {
  [4]: 'Rinkeby',
  [3]: 'Ropsten',
  [5]: 'Göerli',
  [42]: 'Kovan',
};

export default function Navbar(): JSX.Element {
  const { account, chainId } = useActiveWeb3React();

  return (
    <>
      <Container
        top="0"
        left="0"
        right="0"
        position="sticky"
        maxW="container.md"
        bg="white"
        roundedBottom="3xl"
        shadow="lg"
        px="12"
        py="4"
        zIndex="99"
      >
        <HStack justify="space-between">
          <Img src="/img/cmk-logo-full.png" h="48px" />
          <HStack>
            {chainId && NETWORK_LABELS[chainId] && (
              <Badge
                px="2"
                variant="subtle"
                bg="purple.50"
                fontSize="xs"
                colorScheme="purple"
                rounded="md"
              >
                {NETWORK_LABELS[chainId]}
              </Badge>
            )}
            <Web3Status />
          </HStack>
        </HStack>
        {account && <WalletStatus />}
        <Sidebar />
      </Container>
    </>
  );
}
