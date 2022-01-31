import {
  Center,
  Container,
  Heading,
  HStack,
  Img,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import AreaChart from '~/components/Charts/AreaChart';
import CmkMarketStats from '~/components/CmkAnalytics/CmkMarketStats';
import PieChart from '~/components/CmkAnalytics/PieChart';
import Navbar from '~/components/Navbar';
import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';
import { shortenNumber } from '~/utils/formatTokenAmount';

export default function AnalyticsPage() {
  const cmkAnalytics = useCmkAnalyticsData();
  const stakedCmkAnalytics = useStakedCmkAnalyticsData();

  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <Navbar />
      <Container
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
        <Container maxW="container.xl" py="2">
          <Heading
            as="h1"
            fontSize="4xl"
            fontFamily="Credmark Regular"
            color="purple.500"
            textAlign="center"
          >
            CMK Token Analytics
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
                    title="AVERAGE CMK STAKED"
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

          <Heading
            mt="12"
            as="h1"
            fontSize="4xl"
            fontFamily="Credmark Regular"
            color="purple.500"
            textAlign="center"
          >
            MARKETS
          </Heading>
          <CmkMarketStats data={cmkAnalytics.data ?? []} />
        </Container>
      </Container>
    </VStack>
  );
}
