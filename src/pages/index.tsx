import { Img } from '@chakra-ui/image';
import { Box, Container, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import AreaChart from '~/components/Charts/AreaChart';
import MintBox from '~/components/MintBox';
import Navbar from '~/components/Navbar';
import TerminalBox from '~/components/TerminalBox';

export default function IndexPage(): JSX.Element {
  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
      pb="20"
    >
      <Navbar />
      <MintBox />
      <TerminalBox />

      <Container maxW="container.md" p="8" bg="white" shadow="xl" rounded="3xl">
        <VStack align="stretch">
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #CC1662, #3B0066)"
            bgClip="text"
            lineHeight="1.2"
            fontSize="3xl"
          >
            PLATFORM STATS
          </Text>
          <AreaChart
            title="STAKED CMK ($)"
            titleImg="/img/scmk.png"
            yLabel="AMOUNT STAKED"
            xLabel="DATE"
          />
          <AreaChart
            title="PRICE OF CMK ($)"
            titleImg="/img/cmk.png"
            yLabel="CMK TOKEN PRICE"
            xLabel="DATE"
          />
          <AreaChart
            title="ACCESS KEYS"
            titleImg="/img/key.png"
            yLabel="ACCESS KEYS MINTED"
            xLabel="DATE"
          />
        </VStack>
        <HStack p="4" spacing="8">
          <Box flex="1" rounded="3xl" p="4" shadow="lg">
            <Text
              fontFamily="Credmark Regular"
              textAlign="center"
              bgGradient="linear(135deg, #CC1662, #3B0066)"
              bgClip="text"
              lineHeight="1.2"
              fontSize="xl"
              mb="2"
            >
              TOTAL CMK
            </Text>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                Token Price
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $XX.XX
              </Text>
            </HStack>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                MArket Cap
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $XXX,XXX.XX
              </Text>
            </HStack>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                Circulating Supply
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $XXX,XXX.XX
              </Text>
            </HStack>
          </Box>
          <Box flex="1" rounded="3xl" p="4" shadow="lg">
            <Text
              fontFamily="Credmark Regular"
              textAlign="center"
              bgGradient="linear(135deg, #CC1662, #3B0066)"
              bgClip="text"
              lineHeight="1.2"
              fontSize="xl"
              mb="2"
            >
              TOTAL STAKED CMK
            </Text>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                Amount Staked
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $XXX,XXX.XX
              </Text>
            </HStack>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                Staking APR
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                XX.XX%
              </Text>
            </HStack>
            <HStack>
              <Text
                flex="1"
                textAlign="right"
                fontSize="sm"
                color="purple.500"
                fontWeight="300"
              >
                % CMK STAKED
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                XX.XX%
              </Text>
            </HStack>
          </Box>
        </HStack>
        <Flex justify="center">
          <HStack rounded="3xl" p="4" shadow="lg">
            <Img src="/img/key.png" h="12" />
            <VStack spacing="0" pl="4" pr="6">
              <Text fontSize="sm" color="purple.500">
                Total Keys
              </Text>
              <Text
                fontSize="3xl"
                color="#38508C"
                fontFamily="Credmark Regular"
              >
                XX
              </Text>
              <Text fontSize="sm" color="purple.500">
                Minted
              </Text>
            </VStack>
          </HStack>
        </Flex>
      </Container>
    </VStack>
  );
}
