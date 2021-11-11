import { Img } from '@chakra-ui/image';
import { Box, Container, Flex, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';

import AreaChart from '~/components/Charts/AreaChart';
import MintBox from '~/components/MintBox';
import Navbar from '~/components/Navbar';
import TerminalBox from '~/components/TerminalBox';
import {
  useAccessKeyTotalSupply,
  useCmkCirculatingSupply,
  useCmkToUsdcPrice,
  usePercentCmkStaked,
  useTotalValueDeposited,
} from '~/hooks/stats';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export default function IndexPage(): JSX.Element {
  const accessKeyTotalSupply = useAccessKeyTotalSupply();
  const percentCmkStaked = usePercentCmkStaked();

  const cmkToUsdc = useCmkToUsdcPrice();
  const circulatingSupply = useCmkCirculatingSupply();
  const marketCap = useCmkToUsdcPrice(
    circulatingSupply.loading ? undefined : circulatingSupply.value?.quotient,
  );
  const totalValueDeposited = useTotalValueDeposited();

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
            gradient={['#DE1A60', '#3B0065']}
          />
          <AreaChart
            title="PRICE OF CMK ($)"
            titleImg="/img/cmk.png"
            yLabel="CMK TOKEN PRICE"
            xLabel="DATE"
            gradient={['#3B0065', '#08538C']}
          />
          <AreaChart
            title="ACCESS KEYS"
            titleImg="/img/key.png"
            yLabel="ACCESS KEYS MINTED"
            xLabel="DATE"
            gradient={['#08538C', '#DE1A60']}
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
                {cmkToUsdc
                  ? '$' + formatTokenAmount(cmkToUsdc, 4, { shorten: true })
                  : '??'}
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
                Market Cap
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                {marketCap
                  ? '$' +
                    formatTokenAmount(marketCap, 2, {
                      withComma: true,
                    })
                  : '??'}
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
                {circulatingSupply.loading
                  ? '??'
                  : circulatingSupply.value
                      ?.toFixed(0)
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
                {totalValueDeposited
                  ? '$' +
                    formatTokenAmount(totalValueDeposited, 2, {
                      withComma: true,
                    })
                  : '??'}
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
                {percentCmkStaked.loading || !percentCmkStaked.value
                  ? '??'
                  : percentCmkStaked.value.toFixed(2) + '%'}
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
                {accessKeyTotalSupply.loading
                  ? '??'
                  : accessKeyTotalSupply.value?.toString() ?? '??'}
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
