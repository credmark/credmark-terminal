import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Img,
  Spinner,
  Stack,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

import AreaChart from '~/components/Charts/AreaChart';
import CmkMarketStats from '~/components/CmkAnalytics/CmkMarketStats';
import PieChart from '~/components/CmkAnalytics/PieChart';
import Navbar from '~/components/Navbar';
import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';
import { useOnScreen } from '~/hooks/useOnScreen';
import { useActiveWeb3React } from '~/hooks/web3';
import { shortenNumber } from '~/utils/formatTokenAmount';

type AnalyticsKey = 'TOKEN' | 'MARKET';

const ANALYTICS = [
  {
    key: 'TOKEN' as AnalyticsKey,
    title: 'Token Analytics',
    scrollToId: 'token-analytics-container',
  },
  {
    key: 'MARKET' as AnalyticsKey,
    title: 'Market Analytics',
    scrollToId: 'market-analytics-container',
  },
];

export default function AnalyticsPage() {
  const { account } = useActiveWeb3React();

  const cmkAnalytics = useCmkAnalyticsData();
  const stakedCmkAnalytics = useStakedCmkAnalyticsData();

  const [activeAnalytics, setActiveAnalytics] = useState<AnalyticsKey>();

  const refs = {
    TOKEN: useRef(null),
    MARKET: useRef(null),
  };

  const onScreen = {
    TOKEN: useOnScreen(refs.TOKEN),
    MARKET: useOnScreen(refs.MARKET),
  };

  useEffect(() => {
    if (onScreen.TOKEN) setActiveAnalytics('TOKEN');
  }, [onScreen.TOKEN]);

  useEffect(() => {
    if (onScreen.MARKET) setActiveAnalytics('MARKET');
  }, [onScreen.MARKET]);

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
    >
      <Navbar />
      <Stack
        mx="auto"
        maxW="container.sm"
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        position="sticky"
        top={!account ? '88px' : '164px'}
        zIndex="2"
        py="4"
        roundedBottom="lg"
        borderBottom="1px"
        borderLeft="1px"
        borderRight="1px"
        borderColor="gray.50"
        bg="white"
        px="8"
      >
        {ANALYTICS.map((a) => (
          <Button
            key={a.key}
            colorScheme="purple"
            variant={activeAnalytics === a.key ? 'solid' : 'ghost'}
            onClick={() => {
              setActiveAnalytics(a.key);
              const scrollToElem = document.getElementById(a.scrollToId);
              if (scrollToElem)
                window.scrollTo({
                  top: scrollToElem.offsetTop,
                  behavior: 'smooth',
                });
            }}
          >
            {a.title}
          </Button>
        ))}
      </Stack>
      <Container
        mt="8"
        maxW="100vw"
        px={{ base: 2, md: 8 }}
        pt={{ base: 2, md: 8 }}
        bg="white"
        roundedTop="3xl"
        position="relative"
        border="1px"
        borderColor="gray.100"
        pb="40"
      >
        <Container
          id="token-analytics-container"
          ref={refs.TOKEN}
          maxW="container.xl"
          py="2"
        >
          <Heading
            as="h1"
            fontSize="4xl"
            fontFamily="Credmark Regular"
            color="purple.500"
            textAlign="center"
          >
            Token Analytics
          </Heading>

          <HStack mt="8" align="start">
            <VStack flex="1" py="4" align="stretch" px="4">
              <HStack justify="center">
                <Img src="/img/cmk.svg" maxH="10" />
                <Heading
                  as="h2"
                  fontSize="2xl"
                  fontFamily="Credmark Regular"
                  color="purple.500"
                  textAlign="center"
                >
                  CMK
                </Heading>
              </HStack>
              {cmkAnalytics.loading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <>
                  <AreaChart
                    data={
                      cmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.usdc_price),
                      })) ?? []
                    }
                    title="Price of CMK"
                    titleImg="/img/cmk.svg"
                    gradient={['#08538C', '#3B0065']}
                    line
                    formatValue={(val: any) => '$' + val.toFixed(2)}
                    yLabel="PRICE"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  <AreaChart
                    data={
                      cmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.total_holders),
                      })) ?? []
                    }
                    title="CMK Holders"
                    titleImg="/img/holder.svg"
                    gradient={['#DE1A60', '#3B0065']}
                    formatValue={(val: any) => val.toFixed(0)}
                    yLabel="HOLDERS"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  <AreaChart
                    data={
                      cmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.volume_24h) * Number(val.usdc_price),
                      })) ?? []
                    }
                    title="CMK 24H Trading Volume"
                    titleImg="/img/cmk.svg"
                    gradient={['#3B0065', '#08538C']}
                    formatValue={(val: any) => '$' + shortenNumber(val, 2)}
                    yLabel="TOTAL VOLUME"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  {cmkAnalytics.data && (
                    <PieChart
                      data={cmkAnalytics.data[cmkAnalytics.data.length - 1]}
                    />
                  )}
                </>
              )}
            </VStack>
            <VStack flex="1" bg="#FBF3F7" py="4" align="stretch" px="4">
              <HStack justify="center">
                <Img src="/img/xcmk.svg" maxH="10" />
                <Heading
                  as="h2"
                  fontSize="2xl"
                  fontFamily="Credmark Regular"
                  color="purple.500"
                  textAlign="center"
                >
                  xCMK
                </Heading>
              </HStack>
              {stakedCmkAnalytics.loading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <>
                  <AreaChart
                    data={
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.amount_staked_usdc),
                      })) ?? []
                    }
                    title="STAKED CMK"
                    titleImg="/img/xcmk.svg"
                    gradient={['#DE1A60', '#3B0065']}
                    formatValue={(val: any) => '$' + shortenNumber(val, 2)}
                    yLabel="AMOUNT STAKED"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  <AreaChart
                    data={
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.total_holders),
                      })) ?? []
                    }
                    title="STAKED WALLETS"
                    titleImg="/img/wallet.svg"
                    gradient={['#3B0065', '#08538C']}
                    formatValue={(val: any) => val.toFixed(0)}
                    yLabel="WALLETS"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  <AreaChart
                    data={
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value:
                          Number(val.cmk_balance) / Number(val.total_holders),
                      })) ?? []
                    }
                    title="AVERAGE CMK AMOUNT STAKED"
                    titleImg="/img/xcmk.svg"
                    gradient={['#DE1A60', '#3B0065']}
                    formatValue={(val: any) => shortenNumber(val, 2)}
                    yLabel="AMOUNT"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                  <AreaChart
                    data={
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.staking_apr_percent),
                      })) ?? []
                    }
                    title="XCMK APR"
                    titleImg="/img/xcmk.svg"
                    gradient={['#DE1A60', '#3B0065']}
                    formatValue={(val: any) => val.toFixed(2) + '%'}
                    yLabel="AMOUNT"
                    height={400}
                    durations={[30, 60, 90]}
                    defaultDuration={60}
                  />
                </>
              )}
            </VStack>
          </HStack>
        </Container>
        <Container
          id="market-analytics-container"
          ref={refs.MARKET}
          maxW="container.xl"
          py="2"
        >
          <Heading
            mt="12"
            as="h1"
            fontSize="4xl"
            fontFamily="Credmark Regular"
            color="purple.500"
            textAlign="center"
          >
            MARKET ANALYTICS
          </Heading>
          <CmkMarketStats data={cmkAnalytics.data ?? []} />
        </Container>
      </Container>
    </Box>
  );
}
