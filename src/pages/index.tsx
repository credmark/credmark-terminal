import { Img } from '@chakra-ui/image';
import { Box, Container, HStack, Text, VStack } from '@chakra-ui/layout';
import { Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import AreaChart from '~/components/Charts/AreaChart';
import Navbar from '~/components/Navbar';
import StakeBox from '~/components/StakeBox';
import TerminalBox from '~/components/TerminalBox';
import {
  useCmkCirculatingSupply,
  useCmkToUsdcPrice,
  usePercentCmkStaked,
  useStakingApyPercent,
  useTotalValueDeposited,
} from '~/hooks/stats';
import { useCmkData, useStakedCmkData } from '~/hooks/usePlatformData';
import { useActiveWeb3React } from '~/hooks/web3';
import { formatTokenAmount, shortenNumber } from '~/utils/formatTokenAmount';

export default function IndexPage(): JSX.Element {
  const router = useRouter();
  const { chainId } = useActiveWeb3React();

  const isStakeBoxOpen = router.query.stake === 'true';

  const percentCmkStaked = usePercentCmkStaked();
  const stakingApyPercent = useStakingApyPercent();

  const cmkToUsdc = useCmkToUsdcPrice();
  const circulatingSupply = useCmkCirculatingSupply();
  const marketCap = useCmkToUsdcPrice(
    circulatingSupply.loading ? undefined : circulatingSupply.value?.quotient,
  );
  const totalValueDeposited = useTotalValueDeposited();

  const onMainnet = chainId === 1;

  const cmkData = useCmkData(365, !onMainnet);
  const stakedCmkData = useStakedCmkData(365, !onMainnet);

  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
      pb="20"
    >
      <Navbar />
      <Container maxW="container.sm" p="0">
        <Stack
          w="full"
          spacing="8"
          direction={
            isStakeBoxOpen ? { base: 'column' } : { base: 'column', md: 'row' }
          }
        >
          <StakeBox />
          <TerminalBox />
        </Stack>
      </Container>

      <Container
        maxW="container.md"
        p={{ base: 2, md: 8 }}
        bg="white"
        shadow="xl"
        rounded="3xl"
      >
        <Stack
          p="4"
          spacing="8"
          direction={{ base: 'column', md: 'row' }}
          mt="4"
        >
          <Box
            flex="1"
            rounded="md"
            p="4"
            shadow="lg"
            border="1px"
            borderColor="gray.100"
          >
            <HStack mb="4">
              <Img src="/img/cmk.svg" h="32px" />
              <Text
                fontFamily="Credmark Regular"
                textAlign="center"
                color="purple.500"
                lineHeight="1"
                fontSize="xl"
                mb="2"
              >
                TOTAL CMK
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
          <Box
            flex="1"
            rounded="md"
            p="4"
            shadow="lg"
            border="1px"
            borderColor="gray.100"
          >
            <HStack mb="4">
              <Img src="/img/xcmk.svg" h="32px" />
              <Text
                fontFamily="Credmark Regular"
                textAlign="center"
                color="purple.500"
                lineHeight="1"
                fontSize="xl"
                mb="2"
              >
                TOTAL STAKED CMK
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
                {stakingApyPercent.loading || !stakingApyPercent.value
                  ? '??'
                  : stakingApyPercent.value.toFixed(2) + '%'}
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
        </Stack>{' '}
        <VStack align="stretch">
          <AreaChart
            data={cmkData.data?.map((point) => ({
              timestamp: new Date(point.ts * 1000),
              value: parseFloat(point.usdc_price),
            }))}
            formatValue={(val) =>
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(val)
            }
            loading={cmkData.loading}
            title="PRICE OF CMK ($)"
            titleImg="/img/cmk.svg"
            yLabel="CMK TOKEN PRICE"
            lineColor="#3B0065"
          />
          <AreaChart
            data={stakedCmkData.data?.map((point) => ({
              timestamp: new Date(point.ts * 1000),
              value: parseFloat(point.amount_staked_usdc),
            }))}
            formatValue={(val) => '$' + shortenNumber(val, 1)}
            loading={stakedCmkData.loading}
            title="STAKED CMK ($)"
            titleImg="/img/xcmk.svg"
            yLabel="AMOUNT STAKED"
            gradient={['#DE1A60', '#3B0065']}
          />
        </VStack>
      </Container>
    </VStack>
  );
}
