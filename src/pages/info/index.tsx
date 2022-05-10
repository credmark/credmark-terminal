import { Box, Container, Spinner } from '@chakra-ui/react';
import React from 'react';

import AreaChart from '~/components/Charts/Area';
import CmkMarketStatistics from '~/components/CmkAnalytics/CmkMarketStatistics';
import CmkSupplyDistributions from '~/components/CmkAnalytics/CmkSupplyDistributions';
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
      <Container
        minWidth="320px"
        width="100%"
        height="390px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="1px solid #DEDEDE"
        shadow=" rgba(224, 227, 234, 0.6) 0px 0px 10px"
      >
        <Spinner />
      </Container>
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
    <Box
      minH="100vh"
      width="100%"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
    >
      <Container
        maxWidth="100%"
        width="100%"
        bg="white"
        display="flex"
        flexDirection="column"
        position="relative"
        gap="10"
        paddingTop="10"
        paddingBottom="50"
      >
        <Container
          maxWidth="100%"
          gap="10"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
          <LoadingOrShowData
            loading={cmkAnalytics.loading}
            hasData={!!cmkAnalytics.data}
          >
            <AreaChart
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
              gradient={['#DE1A60', '#3B0065']}
              formatValue={(val) => '$' + shortenNumber(val, 2)}
              yLabel="AMOUNT STAKED"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>
        </Container>
        <Container
          maxWidth="100%"
          gap="10"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
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
              gradient={['#DE1A60', '#3B0065']}
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
              gradient={['#E21569', '#ebebeb']}
              formatValue={(val) => val.toFixed(0)}
              yLabel="WALLETS"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
            />
          </LoadingOrShowData>
        </Container>
        <Container
          maxWidth="100%"
          gap="10"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
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
              gradient={['#3B0065', '#08538C']}
              formatValue={(val) => '$' + shortenNumber(val, 2)}
              yLabel="TOTAL VOLUME"
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
              gradient={['#DE1A60']}
              formatValue={(val) => shortenNumber(val, 2)}
              yLabel="AMOUNT"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
              line
            />
          </LoadingOrShowData>
        </Container>
        <Container
          maxWidth="100%"
          gap="10"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
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
              gradient={['#DE1A60']}
              formatValue={(val) => val.toFixed(2) + '%'}
              yLabel="AMOUNT"
              height={380}
              durations={[30, 60, 90]}
              defaultDuration={60}
              line
            />
          </LoadingOrShowData>
        </Container>
        <Container
          maxWidth="100%"
          gap="10"
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
        >
          <CmkMarketStatistics data={cmkAnalytics.data ?? []} />
        </Container>
      </Container>
    </Box>
  );
}
