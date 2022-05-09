import React from 'react';

import { CmkAnalyticsDataPoint } from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

import AreaChart from '../../Charts/Area';

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

interface CmkMarketStatsProps {
  data: CmkAnalyticsDataPoint[];
}

export default function CmkMarketStats({ data }: CmkMarketStatsProps) {
  function getMarketLink(market: MarketInfo) {
    if (market.app === 'sushiswap') {
      return `https://analytics.sushi.com/pairs/${market.address}`;
    } else if (market.app === 'uniswap_v3') {
      return `https://info.uniswap.org/#/pools/${market.address}`;
    }
  }

  function getCurrentVolume(market: MarketInfo) {
    if (data.length === 0) {
      return '';
    }

    const val = data[data.length - 1];
    const foo =
      Number(
        val.markets.find(
          (vm) => vm.address.toLowerCase() === market.address.toLowerCase(),
        )?.volume_24h ?? '0',
      ) * Number(val.usdc_price);

    return '$' + shortenNumber(foo, 0);
  }

  return (
    <>
      {MARKETS.map((m) => (
        <AreaChart
          title={m.label}
          key={m.address}
          info={{
            volume: getCurrentVolume(m),
            link: getMarketLink(m),
            platform: { uniswap_v3: 'Uniswap', sushiswap: 'Sushiswap' }[m.app],
            app: m.app,
          }}
          data={
            data.map((val) => ({
              timestamp: new Date(val.ts * 1000),
              value:
                Number(
                  val.markets.find(
                    (vm) =>
                      vm.address.toLowerCase() === m.address.toLowerCase(),
                  )?.volume_24h ?? '0',
                ) * Number(val.usdc_price),
            })) ?? []
          }
          titleImg={m.titleImg}
          formatValue={(val) => '$' + shortenNumber(val, 0)}
          gradient={['#DE1A60', '#3B0065']}
          yLabel="Amount"
          durations={[30, 60, 90]}
          defaultDuration={60}
          height={380}
          minHeight={450}
        />
      ))}
    </>
  );
}
