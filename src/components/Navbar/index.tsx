import { Container, HStack, Img, Text } from '@chakra-ui/react';
import React from 'react';

import { useActiveWeb3React } from '~/hooks/web3';

import Sidebar from './Sidebar';
import WalletStatus from './WalletStatus';
import Web3Status from './Web3Status';

export default function Navbar(): JSX.Element {
  const { account } = useActiveWeb3React();

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
        py="8"
        zIndex="99"
      >
        <HStack justify="space-between">
          <HStack spacing="3">
            <Img src="/img/terminal.png" h="12" />
            <Text
              lineHeight="1"
              fontFamily="Credmark Regular"
              fontSize="lg"
              bgGradient="linear(to-b, #440163 0%, #8A0C64 100%)"
              bgClip="text"
            >
              CREDMARK
              <br />
              <Text as="span" fontSize="2xl">
                TERMINAL
              </Text>
            </Text>
          </HStack>
          <Web3Status />
        </HStack>
        <Sidebar />
      </Container>

      {account && <WalletStatus />}
    </>
  );
}
