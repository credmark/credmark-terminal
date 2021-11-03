import {
  Box,
  Container,
  Flex,
  HStack,
  Img,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { useActiveWeb3React } from '~/hooks/web3';

import Sidebar from './Sidebar';
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

      {account && (
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
                <Text
                  fontWeight="bold"
                  color="purple.500"
                  lineHeight="1.2"
                  pt="2"
                >
                  1
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
              <Box
                w="2px"
                h="80px"
                bgGradient="linear(to-b, purple.500, white)"
              />
              <VStack spacing="0">
                <Img src="/img/cmk.png" h="10" />
                <Text
                  fontWeight="bold"
                  color="purple.500"
                  lineHeight="1.2"
                  pt="2"
                >
                  123,456.78
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
              <Box
                w="2px"
                h="80px"
                bgGradient="linear(to-b, purple.500, white)"
              />
              <VStack spacing="0">
                <Img src="/img/scmk.png" h="10" />
                <Text
                  fontWeight="bold"
                  color="purple.500"
                  lineHeight="1.2"
                  pt="2"
                >
                  789.12
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
                  0.123 sCMK
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
                  0.45%
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
                  7.89%
                </Text>
              </HStack>
            </Box>
          </Flex>
        </Container>
      )}
    </>
  );
}
