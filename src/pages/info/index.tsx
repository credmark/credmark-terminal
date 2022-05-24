import { Box, Container, Spinner, Grid } from '@chakra-ui/react';
import React from 'react';

import {
  CmkMarketStatistics,
  CmkSupplyDistributions,
} from '~/components/pages/Analytics';
import AreaChart from '~/components/shared/Charts/Area';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface LoadingOrShowDataProps {
  loading: boolean;
  hasData: boolean;
  children: React.ReactNode;
}
const LoadingOrShowData = ({
  loading,
  hasData,
  children,
}: LoadingOrShowDataProps) => {
  if (loading || !hasData) {
    return (
      <Box
        bg="white"
        minWidth="320px"
        width="100%"
        height="400px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="1px"
        borderColor="gray.100"
        shadow="md"
        rounded="base"
      >
        <Spinner />
      </Box>
    );
  }
  return <>{children}</>;
};

export default function AnalyticsPage() {
  const cmkAnalytics = useCmkAnalyticsData(90);
  const stakedCmkAnalytics = useStakedCmkAnalyticsData(90);

  const latestData = cmkAnalytics.data?.sort((a, b) => b.ts - a.ts)[0];
  const lateststakedCmkData = stakedCmkAnalytics.data?.sort(
    (a, b) => b.ts - a.ts,
  )[0];

  return (
    <>
      <SEOHeader title="Token Analytics - Credmark Terminal" />
      <Container p="8" maxW="full">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="8"
          mt="6"
          mb="16"
        >
          <LoadingOrShowData
            loading={cmkAnalytics.loading}
            hasData={!!cmkAnalytics.data}
          >
            <AreaChart
              lineColor="#825F96"
              data={
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.usdc_price),
                })) ?? []
              }
              headerSummary="Current Price:"
              headerAmount={`$${Number(latestData?.usdc_price ?? 0).toFixed(
                2,
              )}`}
              title="Price of CMK"
              titleImg="/img/cmk.svg"
              gradient={['#08538C', '#3B0065']}
              line
              formatValue={(val) => '$' + val.toFixed(2)}
              yLabel="PRICE"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>
          <LoadingOrShowData
            loading={stakedCmkAnalytics.loading}
            hasData={!!stakedCmkAnalytics.data}
          >
            <AreaChart
              data={
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.amount_staked_usdc),
                })) ?? []
              }
              headerSummary="Amount Staked:"
              headerAmount={`$${shortenNumber(
                Number(lateststakedCmkData?.amount_staked_usdc),
                0,
              )}`}
              title="Staked CMK"
              titleImg="/img/xcmk.svg"
              lineColor="#DB197699"
              gradient={['#e215691a', '#ffffff']}
              formatValue={(val) => '$' + shortenNumber(val, 2)}
              yLabel="AMOUNT STAKED"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>

          <LoadingOrShowData
            loading={cmkAnalytics.loading}
            hasData={!!cmkAnalytics.data}
          >
            <AreaChart
              data={
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.total_holders),
                })) ?? []
              }
              headerSummary="Wallets:"
              headerAmount={`${shortenNumber(
                Number(latestData?.total_holders),
                0,
              )}`}
              title="CMK Holders"
              titleImg="/img/holder.svg"
              lineColor="#825F96"
              gradient={['#5b009033', '#ffffff']}
              formatValue={(val) => val.toFixed(0)}
              yLabel="HOLDERS"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>
          <LoadingOrShowData
            loading={stakedCmkAnalytics.loading}
            hasData={!!stakedCmkAnalytics.data}
          >
            <AreaChart
              data={
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.total_holders),
                })) ?? []
              }
              headerSummary="Wallets:"
              headerAmount={`${shortenNumber(
                Number(lateststakedCmkData?.total_holders),
                0,
              )}`}
              title="STAKED WALLETS"
              titleImg="/img/wallet.svg"
              lineColor="#DB197699"
              gradient={['#e215691a', '#ffffff']}
              formatValue={(val) => val.toFixed(0)}
              yLabel="WALLETS"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>

          <LoadingOrShowData
            loading={cmkAnalytics.loading}
            hasData={!!cmkAnalytics.data}
          >
            <AreaChart
              data={
                cmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.volume_24h) * Number(val.usdc_price),
                })) ?? []
              }
              headerSummary="Total Volume:"
              headerAmount={`$${shortenNumber(
                Number(latestData?.volume_24h),
                0,
              )}`}
              title="CMK 24hr Trading Volume"
              titleImg="/img/cmk.svg"
              lineColor="#825F96"
              gradient={['#5b009033', '#ffffff']}
              formatValue={(val) => '$' + shortenNumber(val, 2)}
              yLabel="TOTAL VOLUME"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
              line
            />
          </LoadingOrShowData>
          <LoadingOrShowData
            loading={stakedCmkAnalytics.loading}
            hasData={!!stakedCmkAnalytics.data}
          >
            <AreaChart
              data={
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.cmk_balance) / Number(val.total_holders),
                })) ?? []
              }
              headerSummary="CMK:"
              headerAmount={`$${shortenNumber(
                Number(lateststakedCmkData?.cmk_balance) /
                  Number(lateststakedCmkData?.total_holders),
                0,
              )}`}
              title="Avg CMK Staked per Wallet"
              titleImg="/img/xcmk.svg"
              lineColor="#DB197699"
              gradient={['#e215691a', '#ffffff']}
              formatValue={(val) => shortenNumber(val, 2)}
              yLabel="AMOUNT"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>

          <LoadingOrShowData
            loading={cmkAnalytics.loading}
            hasData={!!(cmkAnalytics.data && stakedCmkAnalytics.data)}
          >
            {cmkAnalytics.data && stakedCmkAnalytics.data && (
              <CmkSupplyDistributions
                titleImg="/img/cmk.svg"
                cmkData={cmkAnalytics.data[cmkAnalytics.data.length - 1]}
                xcmkData={
                  stakedCmkAnalytics.data[stakedCmkAnalytics.data.length - 1]
                }
              />
            )}
          </LoadingOrShowData>
          <LoadingOrShowData
            loading={stakedCmkAnalytics.loading}
            hasData={!!stakedCmkAnalytics.data}
          >
            <AreaChart
              data={
                stakedCmkAnalytics.data?.map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value: Number(val.staking_apr_percent),
                })) ?? []
              }
              headerSummary="Current APR:"
              headerAmount={`${shortenNumber(
                Number(lateststakedCmkData?.staking_apr_percent),
                0,
              )}%`}
              title="XCMK APR"
              titleImg="/img/xcmk.svg"
              lineColor="#DB197699"
              gradient={['#e215691a', '#ffffff']}
              formatValue={(val) => val.toFixed(2) + '%'}
              yLabel="AMOUNT"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
              line
            />
          </LoadingOrShowData>

          <CmkMarketStatistics data={cmkAnalytics.data ?? []} />
        </Grid>
      </Container>
    </>
  );
}
