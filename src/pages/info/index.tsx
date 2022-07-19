import { Container, Grid, GridItem, Img } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import {
  AnalyticsChartBox,
  CmkSupplyDistributions,
} from '~/components/pages/Analytics';
import SEOHeader from '~/components/shared/SEOHeader';
import {
  useCmkAnalyticsData,
  useStakedCmkAnalyticsData,
} from '~/hooks/useAnalyticsData';
import useExpander from '~/hooks/useExpander';

interface MarketInfo {
  app: 'uniswap_v3' | 'sushiswap';
  address: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function AnalyticsPage() {
  const cmkAnalytics = useCmkAnalyticsData(90);
  const stakedCmkAnalytics = useStakedCmkAnalyticsData(90);
  const expander = useExpander();

  const MARKETS: MarketInfo[] = useMemo(
    () => [
      {
        app: 'uniswap_v3',
        address: '0xf7a716e2df2bde4d0ba7656c131b06b1af68513c',
        label: 'CMK/USDC',
        icon: <Img src="/img/cmk-usd.svg" h="6" />,
        color: '#A200FF',
      },
      {
        app: 'uniswap_v3',
        address: '0x59e1f901b5c33ff6fae15b61684ebf17cca7b9b3',
        label: 'CMK/ETH',
        icon: <Img src="/img/cmk-eth.svg" h="6" />,
        color: '#00D89A',
      },
      {
        app: 'sushiswap',
        address: '0x3349217670f9aa55c5640a2b3d806654d27d0569',
        label: 'CMK/WETH',
        icon: <Img src="/img/cmk-eth.svg" h="6" />,
        color: '#A200FF',
      },
      {
        app: 'sushiswap',
        address: '0xb7b42c9145435ef2432620af3bf82b7734704c75',
        label: 'CMK/USDC',
        icon: <Img src="/img/cmk-usd.svg" h="6" />,
        color: '#00D89A',
      },
    ],
    [],
  );

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
          <GridItem
            minW="0"
            colSpan={expander.isExpanded('CMK Token') ? 2 : 1}
            ref={expander.refByKey('CMK Token')}
          >
            <AnalyticsChartBox
              isExpanded={expander.isExpanded('CMK Token')}
              onExpand={() => expander.onExpand('CMK Token')}
              header={{
                logo: '/img/cmk.svg',
                title: 'CMK Token',
              }}
              primaryChart={{
                loading: cmkAnalytics.loading,
                lines: [
                  {
                    name: 'Current Price',
                    color: '#9500FF',
                    data:
                      cmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.usdc_price),
                      })) ?? [],
                  },
                ],
                formatter: 'currency',
                fractionDigits: 2,
              }}
              secondaryCharts={[
                {
                  loading: cmkAnalytics.loading,
                  lines: [
                    {
                      name: '24hr Trading Volume',
                      color: '#9500FF',
                      data:
                        cmkAnalytics.data?.map((val) => ({
                          timestamp: new Date(val.ts * 1000),
                          value:
                            Number(val.volume_24h) * Number(val.usdc_price),
                        })) ?? [],
                    },
                  ],
                  formatter: 'number',
                  fractionDigits: 0,
                },
                {
                  loading: cmkAnalytics.loading,
                  lines: [
                    {
                      name: 'Wallets',
                      color: '#9500FF',
                      data:
                        cmkAnalytics.data?.map((val) => ({
                          timestamp: new Date(val.ts * 1000),
                          value: Number(val.total_holders),
                        })) ?? [],
                    },
                  ],
                  formatter: 'number',
                  fractionDigits: 0,
                },
              ]}
            />
          </GridItem>
          <GridItem
            minW="0"
            colSpan={expander.isExpanded('Staked CMK') ? 2 : 1}
            ref={expander.refByKey('Staked CMK')}
          >
            <AnalyticsChartBox
              isExpanded={expander.isExpanded('Staked CMK')}
              onExpand={() => expander.onExpand('Staked CMK')}
              header={{
                logo: '/img/xcmk.svg',
                title: 'Staked CMK',
              }}
              primaryChart={{
                loading: stakedCmkAnalytics.loading,
                lines: [
                  {
                    name: 'Amount Staked',
                    color: '#FF007A',
                    data:
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.amount_staked_usdc),
                      })) ?? [],
                  },
                ],
                formatter: 'currency',
                fractionDigits: 2,
              }}
              secondaryCharts={[
                {
                  loading: stakedCmkAnalytics.loading,
                  lines: [
                    {
                      name: 'Staked Wallets',
                      color: '#9500FF',
                      data:
                        stakedCmkAnalytics.data?.map((val) => ({
                          timestamp: new Date(val.ts * 1000),
                          value: Number(val.total_holders),
                        })) ?? [],
                    },
                  ],
                  formatter: 'number',
                  fractionDigits: 0,
                },
                {
                  loading: stakedCmkAnalytics.loading,
                  lines: [
                    {
                      name: 'CMK Staked per Wallet',
                      color: '#9500FF',
                      data:
                        stakedCmkAnalytics.data?.map((val) => ({
                          timestamp: new Date(val.ts * 1000),
                          value:
                            Number(val.cmk_balance) / Number(val.total_holders),
                        })) ?? [],
                    },
                  ],
                  formatter: 'number',
                  formatSuffix: ' CMK',
                  fractionDigits: 2,
                },
              ]}
            />
          </GridItem>

          <GridItem
            minW="0"
            colSpan={expander.isExpanded('Supply Distribution') ? 2 : 1}
            ref={expander.refByKey('Supply Distribution')}
          >
            <CmkSupplyDistributions
              cmkData={cmkAnalytics.data?.[cmkAnalytics.data.length - 1]}
              xcmkData={
                stakedCmkAnalytics.data?.[stakedCmkAnalytics.data.length - 1]
              }
              loading={cmkAnalytics.loading || stakedCmkAnalytics.loading}
            />
          </GridItem>
          <GridItem
            minW="0"
            colSpan={expander.isExpanded('Staked CMK APR') ? 2 : 1}
            ref={expander.refByKey('Staked CMK APR')}
          >
            <AnalyticsChartBox
              isExpanded={expander.isExpanded('Staked CMK APR')}
              onExpand={() => expander.onExpand('Staked CMK APR')}
              header={{
                logo: '/img/xcmk.svg',
                title: 'Staked CMK APR',
              }}
              primaryChart={{
                loading: stakedCmkAnalytics.loading,
                lines: [
                  {
                    name: 'Current APR',
                    color: '#FF007A',
                    data:
                      stakedCmkAnalytics.data?.map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value: Number(val.staking_apr_percent),
                      })) ?? [],
                  },
                ],
                formatter: 'percent',
                fractionDigits: 2,
              }}
            />
          </GridItem>
          <GridItem
            minW="0"
            colSpan={expander.isExpanded('Sushiswap 24Hr Volume') ? 2 : 1}
            ref={expander.refByKey('Sushiswap 24Hr Volume')}
          >
            <AnalyticsChartBox
              isExpanded={expander.isExpanded('Sushiswap 24Hr Volume')}
              onExpand={() => expander.onExpand('Sushiswap 24Hr Volume')}
              header={{
                title: 'Sushiswap 24Hr Volume',
              }}
              primaryChart={{
                loading: cmkAnalytics.loading,
                lines: MARKETS.filter((m) => m.app === 'sushiswap').map(
                  (m) => ({
                    name: m.label,
                    color: m.color,
                    icon: m.icon,
                    data:
                      (cmkAnalytics.data ?? []).map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value:
                          Number(
                            val.markets.find(
                              (vm) =>
                                vm.address.toLowerCase() ===
                                m.address.toLowerCase(),
                            )?.volume_24h ?? '0',
                          ) * Number(val.usdc_price),
                      })) ?? [],
                  }),
                ),
                formatter: 'currency',
                fractionDigits: 2,
              }}
            />
          </GridItem>
          <GridItem
            minW="0"
            colSpan={expander.isExpanded('Uniswap 24Hr Volume') ? 2 : 1}
            ref={expander.refByKey('Uniswap 24Hr Volume')}
          >
            <AnalyticsChartBox
              isExpanded={expander.isExpanded('Uniswap 24Hr Volume')}
              onExpand={() => expander.onExpand('Uniswap 24Hr Volume')}
              header={{
                title: 'Uniswap 24Hr Volume',
              }}
              primaryChart={{
                loading: cmkAnalytics.loading,
                lines: MARKETS.filter((m) => m.app === 'uniswap_v3').map(
                  (m) => ({
                    name: m.label,
                    color: m.color,
                    icon: m.icon,
                    data:
                      (cmkAnalytics.data ?? []).map((val) => ({
                        timestamp: new Date(val.ts * 1000),
                        value:
                          Number(
                            val.markets.find(
                              (vm) =>
                                vm.address.toLowerCase() ===
                                m.address.toLowerCase(),
                            )?.volume_24h ?? '0',
                          ) * Number(val.usdc_price),
                      })) ?? [],
                  }),
                ),
                formatter: 'currency',
                fractionDigits: 2,
              }}
            />
          </GridItem>
        </Grid>
      </Container>
    </>
  );
}
