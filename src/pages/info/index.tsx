import {
  Container,
  Grid,
  Icon,
  Link,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import React, { useState } from 'react';

import {
  AnalyticsChartBox,
  CmkSupplyDistributions,
} from '~/components/pages/Analytics';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';

interface MarketInfo {
  app: 'uniswap_v3' | 'sushiswap';
  address: string;
  label: string;
  titleImg: string;
}

const MARKETS: MarketInfo[] = [
  {
    app: 'uniswap_v3',
    address: '0xf7a716e2df2bde4d0ba7656c131b06b1af68513c',
    label: 'Uniswap (CMK-USDC)',
    titleImg: '/img/cmk-usd.svg',
  },
  {
    app: 'uniswap_v3',
    address: '0x59e1f901b5c33ff6fae15b61684ebf17cca7b9b3',
    label: 'Uniswap (CMK-ETH)',
    titleImg: '/img/cmk-eth.svg',
  },
  {
    app: 'sushiswap',
    address: '0x3349217670f9aa55c5640a2b3d806654d27d0569',
    label: 'Sushiswap (CMK-WETH)',
    titleImg: '/img/cmk-eth.svg',
  },
  {
    app: 'sushiswap',
    address: '0xb7b42c9145435ef2432620af3bf82b7734704c75',
    label: 'Sushiswap (CMK-USDC)',
    titleImg: '/img/cmk-usd.svg',
  },
];

export default function AnalyticsPage() {
  const cmkAnalytics = useCmkAnalyticsData(90);
  const stakedCmkAnalytics = useStakedCmkAnalyticsData(90);

  function getMarketLink(market: MarketInfo) {
    if (market.app === 'sushiswap') {
      return `https://analytics.sushi.com/pairs/${market.address}`;
    } else if (market.app === 'uniswap_v3') {
      return `https://info.uniswap.org/#/pools/${market.address}`;
    }
  }

  const [stakedCmkUnit, setStakedCmkUnit] = useState<'CMK' | 'USDC'>('CMK');

  return (
    <>
      <SEOHeader title="CMK Analytics" />
      <Container p="8" maxW="full">
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="8"
          mt="6"
          mb="16"
        >
          <AnalyticsChartBox
            title="Price of CMK"
            titleImg="/img/cmk.svg"
            name="Current Price"
            loading={cmkAnalytics.loading}
            data={
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.usdc_price),
              })) ?? []
            }
            color="#825F96"
            formatter="currency"
            fractionDigits={2}
          />
          <AnalyticsChartBox
            title="Staked CMK"
            titleImg="/img/xcmk.svg"
            actions={
              <RadioGroup
                onChange={(val: 'CMK' | 'USDC') => setStakedCmkUnit(val)}
                value={stakedCmkUnit}
              >
                <Stack direction="row" spacing="3">
                  <Radio value="CMK" colorScheme="purple">
                    CMK
                  </Radio>
                  <Radio value="USDC" colorScheme="green">
                    USDC
                  </Radio>
                </Stack>
              </RadioGroup>
            }
            name="Amount Staked"
            loading={stakedCmkAnalytics.loading}
            data={
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value:
                  stakedCmkUnit === 'CMK'
                    ? Number(val.cmk_balance)
                    : Number(val.amount_staked_usdc),
              })) ?? []
            }
            color="#DB197699"
            formatter={stakedCmkUnit === 'CMK' ? 'number' : 'currency'}
            formatSuffix={stakedCmkUnit === 'CMK' ? ' CMK' : ''}
            fractionDigits={2}
            isArea
          />
          <AnalyticsChartBox
            title="CMK Holders"
            titleImg="/img/holder.svg"
            name="Wallets"
            loading={cmkAnalytics.loading}
            data={
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.total_holders),
              })) ?? []
            }
            color="#825F96"
            formatter="number"
            fractionDigits={0}
            isArea
          />
          <AnalyticsChartBox
            title="Staked Wallets"
            titleImg="/img/wallet.svg"
            name="Wallets"
            loading={stakedCmkAnalytics.loading}
            data={
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.total_holders),
              })) ?? []
            }
            color="#DB197699"
            formatter="number"
            fractionDigits={0}
            isArea
          />
          <AnalyticsChartBox
            title="CMK 24hr Trading Volume"
            titleImg="/img/cmk.svg"
            name="Total Volume"
            loading={cmkAnalytics.loading}
            data={
              cmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.volume_24h) * Number(val.usdc_price),
              })) ?? []
            }
            color="#825F96"
            formatter="number"
            fractionDigits={0}
          />
          <AnalyticsChartBox
            title="Avg CMK Staked per Wallet"
            titleImg="/img/xcmk.svg"
            name="CMK"
            loading={stakedCmkAnalytics.loading}
            data={
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.cmk_balance) / Number(val.total_holders),
              })) ?? []
            }
            color="#DB197699"
            formatter="currency"
            fractionDigits={2}
            isArea
          />

          {cmkAnalytics.data && stakedCmkAnalytics.data && (
            <CmkSupplyDistributions
              titleImg="/img/cmk.svg"
              cmkData={cmkAnalytics.data[cmkAnalytics.data.length - 1]}
              xcmkData={
                stakedCmkAnalytics.data[stakedCmkAnalytics.data.length - 1]
              }
              loading={cmkAnalytics.loading || stakedCmkAnalytics.loading}
            />
          )}
          <AnalyticsChartBox
            title="XCMK APR"
            titleImg="/img/xcmk.svg"
            name="Current APR"
            loading={stakedCmkAnalytics.loading}
            data={
              stakedCmkAnalytics.data?.map((val) => ({
                timestamp: new Date(val.ts * 1000),
                value: Number(val.staking_apr_percent),
              })) ?? []
            }
            color="#DB197699"
            formatter="percent"
            fractionDigits={2}
          />

          {MARKETS.map((market) => (
            <AnalyticsChartBox
              key={market.address}
              title={market.label}
              titleImg={market.titleImg}
              name="24hr Volume"
              loading={cmkAnalytics.loading}
              data={
                (cmkAnalytics.data ?? []).map((val) => ({
                  timestamp: new Date(val.ts * 1000),
                  value:
                    Number(
                      val.markets.find(
                        (vm) =>
                          vm.address.toLowerCase() ===
                          market.address.toLowerCase(),
                      )?.volume_24h ?? '0',
                    ) * Number(val.usdc_price),
                })) ?? []
              }
              color="#825F96"
              formatter="currency"
              fractionDigits={2}
              footer={
                <Link
                  isExternal
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                  color="purple.500"
                  href={getMarketLink(market)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on{' '}
                  {
                    { uniswap_v3: 'Uniswap', sushiswap: 'Sushiswap' }[
                      market.app
                    ]
                  }
                  <Icon cursor="pointer" as={ArrowForwardOutlinedIcon} />
                </Link>
              }
            />
          ))}
        </Grid>
      </Container>
    </>
  );
}
