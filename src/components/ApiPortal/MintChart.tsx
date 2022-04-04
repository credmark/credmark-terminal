import { CurrencyAmount } from '@uniswap/sdk-core';
import ReactEChartsCore from 'echarts-for-react';
import JSBI from 'jsbi';
import React, { useCallback, useMemo } from 'react';

import { TierInfo } from '~/constants/tiers';
import { CMK, USDC } from '~/constants/tokens';
import useUSDCPrice from '~/hooks/useUSDCPrice';
import { useActiveWeb3React } from '~/hooks/web3';
import { tryParseAmount } from '~/utils/tryParseAmount';

interface MintChartProps {
  activeTier: TierInfo;
  rewardCmkPerSecond: JSBI;
  totalCmkShares: JSBI;
  selectedAmount: number;
}

export default function MintChart({
  activeTier,
  rewardCmkPerSecond,
  totalCmkShares,
  selectedAmount,
}: MintChartProps) {
  const { chainId } = useActiveWeb3React();
  // const chartRef = useRef<any>();

  const cmk = chainId ? CMK[chainId] : undefined;
  const usdc = chainId ? USDC[chainId] : undefined;

  const usdcPrice = useUSDCPrice(cmk);

  const usdAmountToApy = useCallback(
    (amount: number) => {
      const parsedUsdcAmount = tryParseAmount(String(amount), usdc);
      const parsedCmkAmount =
        parsedUsdcAmount && usdcPrice
          ? usdcPrice.invert().quote(parsedUsdcAmount)
          : undefined;

      const cmkSharesToMint = parsedCmkAmount
        ? JSBI.multiply(
            parsedCmkAmount.quotient,
            JSBI.BigInt(activeTier.rewardMultiplier),
          )
        : JSBI.BigInt(0);

      const monthlyRewardCmk = JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(cmkSharesToMint, rewardCmkPerSecond),
          JSBI.BigInt(30 * 24 * 3600),
        ),
        JSBI.add(totalCmkShares, cmkSharesToMint),
      );

      const monthlyRewardUsdc =
        usdcPrice && cmk
          ? Number(
              usdcPrice
                .quote(
                  CurrencyAmount.fromRawAmount(
                    cmk,
                    monthlyRewardCmk.toString(),
                  ),
                )
                .toFixed(0),
            )
          : 0;

      return ((monthlyRewardUsdc - activeTier.monthlyFeeUsd) / amount) * 100;
    },
    [activeTier, cmk, rewardCmkPerSecond, totalCmkShares, usdc, usdcPrice],
  );

  const breakevenAmount = useMemo(() => {
    const parsedMonthlyFeeUsdc = tryParseAmount(
      String(activeTier.monthlyFeeUsd),
      usdc,
    );

    if (!usdcPrice || !parsedMonthlyFeeUsdc || !cmk) return 0;

    const monthlyFeeCmk = usdcPrice
      .invert()
      .quote(parsedMonthlyFeeUsdc).quotient;

    const cmkSharesToMint = JSBI.divide(
      JSBI.divide(
        JSBI.multiply(monthlyFeeCmk, totalCmkShares),
        JSBI.subtract(
          JSBI.multiply(rewardCmkPerSecond, JSBI.BigInt(30 * 24 * 3600)),
          monthlyFeeCmk,
        ),
      ),
      JSBI.BigInt(activeTier.rewardMultiplier),
    );

    return usdcPrice
      .quote(CurrencyAmount.fromRawAmount(cmk, cmkSharesToMint.toString()))
      .toFixed(0);
  }, [
    activeTier.monthlyFeeUsd,
    activeTier.rewardMultiplier,
    cmk,
    rewardCmkPerSecond,
    totalCmkShares,
    usdc,
    usdcPrice,
  ]);

  const data = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 100_000; i += 1000) {
      data.push([i, usdAmountToApy(i)]);
    }

    return data;
  }, [usdAmountToApy]);

  // const updateGraphic = useCallback(() => {
  //   const myChart = chartRef.current;
  //   if (!myChart) return;

  //   myChart.setOption({
  //     graphic: [
  //       {
  //         type: 'circle',
  //         shape: {
  //           r: 50,
  //         },
  //         position: myChart.convertToPixel('grid', [
  //           selectedAmount,
  //           usdAmountToApy(selectedAmount),
  //         ]),
  //         invisible: true,
  //         draggable: true,
  //         z: 100,
  //         ondragend: (event: any) => {
  //           console.log(event.offsetX);
  //         },
  //       },
  //     ],
  //   });
  // }, [selectedAmount, usdAmountToApy]);

  // useEffect(() => {
  //   updateGraphic();
  // }, [selectedAmount, updateGraphic]);

  const option = useMemo(() => {
    return {
      backgroundColor: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(0, 199, 142, 0.12)', // color at 0%
          },
          {
            offset: 0.6,
            color: 'transparent', // color at 100%
          },
        ],
        global: false, // default is false
      },
      grid: {
        top: 40,
        left: 50,
        right: 50,
        bottom: 50,
      },
      xAxis: {
        name: 'USD',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#DE1A60',
          },
        },
        minorTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        minorSplitLine: {
          show: false,
        },
      },
      yAxis: {
        name: 'APY',
        min: -100,
        max: 100,
        axisLine: {
          onZero: false,
          lineStyle: {
            color: '#DE1A60',
          },
        },
        minorTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        minorSplitLine: {
          show: false,
        },
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          //   clip: true,
          data: data,
          lineStyle: { color: '#BFBFBF' },
          itemStyle: { color: '#DE1A60' },
          markLine: {
            data: [
              {
                emphasis: {
                  disabled: true,
                },
                lineStyle: {
                  color: '#D8D8D8',
                  type: 'solid',
                },
                yAxis: 0,
              },
              {
                emphasis: {
                  disabled: true,
                },
                lineStyle: {
                  color: '#D8D8D8',
                  type: 'solid',
                },
                xAxis: breakevenAmount,
              },
            ],
          },
          markPoint: {
            data: [{ coord: [selectedAmount, usdAmountToApy(selectedAmount)] }],
          },
        },
      ],
    };
  }, [breakevenAmount, data, selectedAmount, usdAmountToApy]);

  return (
    <ReactEChartsCore
      option={option}
      lazyUpdate={true}
      notMerge={true}
      style={{
        height: '100%',
      }}
      // onChartReady={(myChart) => {
      //   chartRef.current = myChart;
      //   updateGraphic();
      // }}
    />
  );
}
