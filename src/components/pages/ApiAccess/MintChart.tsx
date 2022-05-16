import { CurrencyAmount } from '@uniswap/sdk-core';
import ReactEChartsCore, { EChartsInstance } from 'echarts-for-react';
import JSBI from 'jsbi';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

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
  setSelectedAmount: (selectedAmount: number) => void;
}

function MintChart({
  activeTier,
  rewardCmkPerSecond,
  totalCmkShares,
  selectedAmount,
  setSelectedAmount,
}: MintChartProps) {
  const { chainId } = useActiveWeb3React();
  const chartRef = useRef<EChartsInstance>();

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

  const updateGraphic = useCallback(() => {
    const myChart = chartRef.current;
    if (!myChart) {
      return;
    }

    function ondrag(this: { position: [number, number] }) {
      const usdcAmount = myChart.convertFromPixel('grid', this.position)[0];
      const nearestUsdcAmount = data.reduce((a, b) => {
        return Math.abs(b[0] - usdcAmount) < Math.abs(a - usdcAmount)
          ? b[0]
          : a;
      }, 0);

      setSelectedAmount(nearestUsdcAmount);
    }

    const apy = usdAmountToApy(selectedAmount);

    if (isFinite(apy)) {
      const position = myChart.convertToPixel({ seriesIndex: 0 }, [
        selectedAmount,
        usdAmountToApy(selectedAmount),
      ]);

      myChart.setOption({
        graphic: [
          {
            type: 'circle',
            shape: {
              r: 25,
            },
            position,
            invisible: true,
            draggable: true,
            z: 100,
            ondrag,
          },
          {
            type: 'image',
            position: [position[0] - 47, position[1] - 50],
            z: 100,
            style: {
              image:
                "data:image/svg+xml,%3Csvg width='96' height='31' viewBox='0 0 96 31' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='path-1-inside-1_1666_3036' fill='white'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.5 0C6.3203 0 0.5 5.8203 0.5 13C0.5 20.1797 6.3203 26 13.5 26H44.1133L47 31L49.8867 26H82.5C89.6797 26 95.5 20.1797 95.5 13C95.5 5.8203 89.6797 0 82.5 0H13.5Z'/%3E%3C/mask%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.5 0C6.3203 0 0.5 5.8203 0.5 13C0.5 20.1797 6.3203 26 13.5 26H44.1133L47 31L49.8867 26H82.5C89.6797 26 95.5 20.1797 95.5 13C95.5 5.8203 89.6797 0 82.5 0H13.5Z' fill='%23de1a60'/%3E%3Cpath d='M44.1133 26L44.9793 25.5L44.6906 25H44.1133V26ZM47 31L46.134 31.5L47 33L47.866 31.5L47 31ZM49.8867 26V25H49.3094L49.0207 25.5L49.8867 26ZM1.5 13C1.5 6.37258 6.87258 1 13.5 1V-1C5.76801 -1 -0.5 5.26801 -0.5 13H1.5ZM13.5 25C6.87259 25 1.5 19.6274 1.5 13H-0.5C-0.5 20.732 5.76802 27 13.5 27V25ZM44.1133 25H13.5V27H44.1133V25ZM43.2472 26.5L46.134 31.5L47.866 30.5L44.9793 25.5L43.2472 26.5ZM47.866 31.5L50.7528 26.5L49.0207 25.5L46.134 30.5L47.866 31.5ZM82.5 25H49.8867V27H82.5V25ZM94.5 13C94.5 19.6274 89.1274 25 82.5 25V27C90.232 27 96.5 20.732 96.5 13H94.5ZM82.5 1C89.1274 1 94.5 6.37258 94.5 13H96.5C96.5 5.26801 90.232 -1 82.5 -1V1ZM13.5 1H82.5V-1H13.5V1Z' fill='%23DB1976' mask='url(%23path-1-inside-1_1666_3036)'/%3E%3Cpath d='M15.4375 5.5C15.5867 5.5 15.7298 5.55926 15.8352 5.66475C15.9407 5.77024 16 5.91332 16 6.0625V7.9375C16 8.08668 15.9407 8.22976 15.8352 8.33525C15.7298 8.44074 15.5867 8.5 15.4375 8.5C15.2883 8.5 15.1452 8.44074 15.0398 8.33525C14.9343 8.22976 14.875 8.08668 14.875 7.9375V6.0625C14.875 5.91332 14.9343 5.77024 15.0398 5.66475C15.1452 5.55926 15.2883 5.5 15.4375 5.5ZM11.8525 6.9775C11.958 6.87216 12.1009 6.813 12.25 6.813C12.3991 6.813 12.542 6.87216 12.6475 6.9775L13.96 8.29C14.0153 8.3415 14.0596 8.4036 14.0903 8.4726C14.1211 8.5416 14.1376 8.61608 14.1389 8.69161C14.1403 8.76714 14.1264 8.84216 14.0981 8.9122C14.0698 8.98224 14.0277 9.04587 13.9743 9.09928C13.9209 9.15269 13.8572 9.1948 13.7872 9.22309C13.7172 9.25138 13.6421 9.26528 13.5666 9.26394C13.4911 9.26261 13.4166 9.24608 13.3476 9.21534C13.2786 9.18459 13.2165 9.14027 13.165 9.085L11.8525 7.7725C11.7472 7.66703 11.688 7.52406 11.688 7.375C11.688 7.22594 11.7472 7.08297 11.8525 6.9775ZM19.0225 6.9775C19.1278 7.08297 19.187 7.22594 19.187 7.375C19.187 7.52406 19.1278 7.66703 19.0225 7.7725L17.71 9.085C17.6585 9.14027 17.5964 9.18459 17.5274 9.21534C17.4584 9.24608 17.3839 9.26261 17.3084 9.26394C17.2329 9.26528 17.1578 9.25138 17.0878 9.22309C17.0178 9.1948 16.9541 9.15269 16.9007 9.09928C16.8473 9.04587 16.8052 8.98224 16.7769 8.9122C16.7486 8.84216 16.7347 8.76714 16.7361 8.69161C16.7374 8.61608 16.7539 8.5416 16.7847 8.4726C16.8154 8.4036 16.8597 8.3415 16.915 8.29L18.2275 6.9775C18.333 6.87216 18.4759 6.813 18.625 6.813C18.7741 6.813 18.917 6.87216 19.0225 6.9775ZM10.375 10.5625C10.375 10.4133 10.4343 10.2702 10.5398 10.1648C10.6452 10.0593 10.7883 10 10.9375 10H12.8125C12.9617 10 13.1048 10.0593 13.2102 10.1648C13.3157 10.2702 13.375 10.4133 13.375 10.5625C13.375 10.7117 13.3157 10.8548 13.2102 10.9602C13.1048 11.0657 12.9617 11.125 12.8125 11.125H10.9375C10.7883 11.125 10.6452 11.0657 10.5398 10.9602C10.4343 10.8548 10.375 10.7117 10.375 10.5625ZM14.875 11.1153C14.875 10.27 15.8665 9.814 16.5078 10.3645L22.8535 15.8035C23.536 16.3885 23.1475 17.5068 22.2498 17.5435L19.3698 17.6583C19.06 17.6703 18.769 17.8083 18.562 18.0385L16.6015 20.23C15.9963 20.9073 14.875 20.4783 14.875 19.57V11.116V11.1153Z' fill='white'/%3E%3Cpath d='M34.4854 18H32.4072L32.4209 16.9268H34.4854C35.1963 16.9268 35.7887 16.7786 36.2627 16.4824C36.7367 16.1816 37.0921 15.7624 37.3291 15.2246C37.5706 14.6823 37.6914 14.0488 37.6914 13.3242V12.7158C37.6914 12.1462 37.623 11.6403 37.4863 11.1982C37.3496 10.7516 37.1491 10.3757 36.8848 10.0703C36.6204 9.76042 36.2969 9.52572 35.9141 9.36621C35.5358 9.20671 35.1006 9.12695 34.6084 9.12695H32.3662V8.04688H34.6084C35.2601 8.04688 35.8548 8.15625 36.3926 8.375C36.9303 8.58919 37.3929 8.90137 37.7803 9.31152C38.1722 9.71712 38.473 10.2093 38.6826 10.7881C38.8923 11.3623 38.9971 12.0094 38.9971 12.7295V13.3242C38.9971 14.0443 38.8923 14.6937 38.6826 15.2725C38.473 15.8467 38.1699 16.3366 37.7734 16.7422C37.3815 17.1478 36.9076 17.46 36.3516 17.6787C35.8001 17.8929 35.1781 18 34.4854 18ZM33.1113 8.04688V18H31.792V8.04688H33.1113ZM42.0527 11.7656V18H40.7881V10.6035H42.0186L42.0527 11.7656ZM44.3633 10.5625L44.3564 11.7383C44.2516 11.7155 44.1514 11.7018 44.0557 11.6973C43.9645 11.6882 43.8597 11.6836 43.7412 11.6836C43.4495 11.6836 43.1921 11.7292 42.9688 11.8203C42.7454 11.9115 42.5563 12.0391 42.4014 12.2031C42.2464 12.3672 42.1234 12.5632 42.0322 12.791C41.9456 13.0143 41.8887 13.2604 41.8613 13.5293L41.5059 13.7344C41.5059 13.2878 41.5492 12.8685 41.6357 12.4766C41.7269 12.0846 41.8659 11.7383 42.0527 11.4375C42.2396 11.1322 42.4766 10.8952 42.7637 10.7266C43.0553 10.5534 43.4017 10.4668 43.8027 10.4668C43.8939 10.4668 43.9987 10.4782 44.1172 10.501C44.2357 10.5192 44.3177 10.5397 44.3633 10.5625ZM49.6201 16.7354V12.9277C49.6201 12.6361 49.5609 12.3831 49.4424 12.1689C49.3285 11.9502 49.1553 11.7816 48.9229 11.6631C48.6904 11.5446 48.4033 11.4854 48.0615 11.4854C47.7425 11.4854 47.4622 11.54 47.2207 11.6494C46.9837 11.7588 46.7969 11.9023 46.6602 12.0801C46.528 12.2578 46.4619 12.4492 46.4619 12.6543H45.1973C45.1973 12.39 45.2656 12.1279 45.4023 11.8682C45.5391 11.6084 45.735 11.3737 45.9902 11.1641C46.25 10.9499 46.5599 10.7812 46.9199 10.6582C47.2845 10.5306 47.6901 10.4668 48.1367 10.4668C48.6745 10.4668 49.1484 10.5579 49.5586 10.7402C49.9733 10.9225 50.2969 11.1982 50.5293 11.5674C50.7663 11.932 50.8848 12.39 50.8848 12.9414V16.3867C50.8848 16.6328 50.9053 16.8949 50.9463 17.1729C50.9919 17.4508 51.0579 17.6901 51.1445 17.8906V18H49.8252C49.7614 17.8542 49.7113 17.6605 49.6748 17.4189C49.6383 17.1729 49.6201 16.945 49.6201 16.7354ZM49.8389 13.5156L49.8525 14.4043H48.5742C48.2142 14.4043 47.8929 14.4339 47.6104 14.4932C47.3278 14.5479 47.0908 14.6322 46.8994 14.7461C46.708 14.86 46.5622 15.0036 46.4619 15.1768C46.3617 15.3454 46.3115 15.5436 46.3115 15.7715C46.3115 16.0039 46.3639 16.2158 46.4688 16.4072C46.5736 16.5986 46.7308 16.7513 46.9404 16.8652C47.1546 16.9746 47.4167 17.0293 47.7266 17.0293C48.1139 17.0293 48.4557 16.9473 48.752 16.7832C49.0482 16.6191 49.2829 16.4186 49.4561 16.1816C49.6338 15.9447 49.7295 15.7145 49.7432 15.4912L50.2832 16.0996C50.2513 16.291 50.1647 16.5029 50.0234 16.7354C49.8822 16.9678 49.693 17.1911 49.4561 17.4053C49.2236 17.6149 48.9456 17.7904 48.6221 17.9316C48.3031 18.0684 47.943 18.1367 47.542 18.1367C47.0407 18.1367 46.6009 18.0387 46.2227 17.8428C45.849 17.6468 45.5573 17.3848 45.3477 17.0566C45.1426 16.724 45.04 16.3525 45.04 15.9424C45.04 15.5459 45.1175 15.1973 45.2725 14.8965C45.4274 14.5911 45.6507 14.3382 45.9424 14.1377C46.234 13.9326 46.585 13.7777 46.9951 13.6729C47.4053 13.568 47.8633 13.5156 48.3691 13.5156H49.8389ZM57.666 10.6035H58.8145V17.8428C58.8145 18.4945 58.6823 19.0505 58.418 19.5107C58.1536 19.971 57.7845 20.3197 57.3105 20.5566C56.8411 20.7982 56.2988 20.9189 55.6836 20.9189C55.4284 20.9189 55.1276 20.8779 54.7812 20.7959C54.4395 20.7184 54.1022 20.584 53.7695 20.3926C53.4414 20.2057 53.1657 19.9528 52.9424 19.6338L53.6055 18.8818C53.9154 19.2555 54.2389 19.5153 54.5762 19.6611C54.918 19.807 55.2552 19.8799 55.5879 19.8799C55.9889 19.8799 56.3353 19.8047 56.627 19.6543C56.9186 19.5039 57.1442 19.2806 57.3037 18.9844C57.4678 18.6927 57.5498 18.3327 57.5498 17.9043V12.2305L57.666 10.6035ZM52.5732 14.3838V14.2402C52.5732 13.6751 52.6393 13.1624 52.7715 12.7021C52.9082 12.2373 53.1019 11.8385 53.3525 11.5059C53.6077 11.1732 53.9154 10.918 54.2754 10.7402C54.6354 10.5579 55.041 10.4668 55.4922 10.4668C55.957 10.4668 56.3626 10.5488 56.709 10.7129C57.0599 10.8724 57.3561 11.1071 57.5977 11.417C57.8438 11.7223 58.0374 12.0915 58.1787 12.5244C58.32 12.9574 58.418 13.4473 58.4727 13.9941V14.623C58.4225 15.1654 58.3245 15.653 58.1787 16.0859C58.0374 16.5189 57.8438 16.888 57.5977 17.1934C57.3561 17.4987 57.0599 17.7334 56.709 17.8975C56.3581 18.057 55.9479 18.1367 55.4785 18.1367C55.0365 18.1367 54.6354 18.0433 54.2754 17.8564C53.9199 17.6696 53.6146 17.4076 53.3594 17.0703C53.1042 16.7331 52.9082 16.3366 52.7715 15.8809C52.6393 15.4206 52.5732 14.9215 52.5732 14.3838ZM53.8379 14.2402V14.3838C53.8379 14.7529 53.8743 15.0993 53.9473 15.4229C54.0247 15.7464 54.141 16.0312 54.2959 16.2773C54.4554 16.5234 54.6582 16.7171 54.9043 16.8584C55.1504 16.9951 55.4443 17.0635 55.7861 17.0635C56.2054 17.0635 56.5518 16.9746 56.8252 16.7969C57.0986 16.6191 57.3151 16.3844 57.4746 16.0928C57.6387 15.8011 57.7663 15.4844 57.8574 15.1426V13.4951C57.8073 13.2445 57.7298 13.0029 57.625 12.7705C57.5247 12.5335 57.3926 12.3239 57.2285 12.1416C57.069 11.9548 56.8708 11.8066 56.6338 11.6973C56.3968 11.5879 56.1188 11.5332 55.7998 11.5332C55.4535 11.5332 55.1549 11.6061 54.9043 11.752C54.6582 11.8932 54.4554 12.0892 54.2959 12.3398C54.141 12.5859 54.0247 12.873 53.9473 13.2012C53.8743 13.5247 53.8379 13.8711 53.8379 14.2402ZM64.8164 8.04688H66.0947L69.3555 16.1611L72.6094 8.04688H73.8945L69.8477 18H68.8496L64.8164 8.04688ZM64.3994 8.04688H65.5273L65.7119 14.1172V18H64.3994V8.04688ZM73.1768 8.04688H74.3047V18H72.9922V14.1172L73.1768 8.04688ZM79.5 18.1367C78.985 18.1367 78.5179 18.0501 78.0986 17.877C77.6839 17.6992 77.3262 17.4508 77.0254 17.1318C76.7292 16.8128 76.5013 16.4346 76.3418 15.9971C76.1823 15.5596 76.1025 15.0811 76.1025 14.5615V14.2744C76.1025 13.6729 76.1914 13.1374 76.3691 12.668C76.5469 12.194 76.7884 11.793 77.0938 11.4648C77.3991 11.1367 77.7454 10.8883 78.1328 10.7197C78.5202 10.5511 78.9212 10.4668 79.3359 10.4668C79.8646 10.4668 80.3203 10.5579 80.7031 10.7402C81.0905 10.9225 81.4072 11.1777 81.6533 11.5059C81.8994 11.8294 82.0817 12.2122 82.2002 12.6543C82.3187 13.0918 82.3779 13.5703 82.3779 14.0898V14.6572H76.8545V13.625H81.1133V13.5293C81.0951 13.2012 81.0267 12.8822 80.9082 12.5723C80.7943 12.2624 80.612 12.0072 80.3613 11.8066C80.1107 11.6061 79.7689 11.5059 79.3359 11.5059C79.0488 11.5059 78.7845 11.5674 78.543 11.6904C78.3014 11.8089 78.0941 11.9867 77.9209 12.2236C77.7477 12.4606 77.6133 12.75 77.5176 13.0918C77.4219 13.4336 77.374 13.8278 77.374 14.2744V14.5615C77.374 14.9124 77.4219 15.2428 77.5176 15.5527C77.6178 15.8581 77.7614 16.127 77.9482 16.3594C78.1396 16.5918 78.3698 16.7741 78.6387 16.9062C78.9121 17.0384 79.222 17.1045 79.5684 17.1045C80.015 17.1045 80.3932 17.0133 80.7031 16.8311C81.013 16.6488 81.2842 16.4049 81.5166 16.0996L82.2822 16.708C82.1227 16.9495 81.9199 17.1797 81.6738 17.3984C81.4277 17.6172 81.1247 17.7949 80.7646 17.9316C80.4092 18.0684 79.9876 18.1367 79.5 18.1367ZM85.3584 8.04688L85.2695 15.1904H84.1279L84.0322 8.04688H85.3584ZM83.9912 17.3643C83.9912 17.1592 84.0527 16.986 84.1758 16.8447C84.3034 16.7035 84.4902 16.6328 84.7363 16.6328C84.9779 16.6328 85.1624 16.7035 85.29 16.8447C85.4222 16.986 85.4883 17.1592 85.4883 17.3643C85.4883 17.5602 85.4222 17.7288 85.29 17.8701C85.1624 18.0114 84.9779 18.082 84.7363 18.082C84.4902 18.082 84.3034 18.0114 84.1758 17.8701C84.0527 17.7288 83.9912 17.5602 83.9912 17.3643Z' fill='white'/%3E%3C/svg%3E%0A",
            },
          },
        ],
      });
    } else {
      myChart.setOption({
        graphic: [],
      });
    }
  }, [data, selectedAmount, setSelectedAmount, usdAmountToApy]);

  useEffect(() => {
    updateGraphic();
  }, [updateGraphic]);

  const option = useMemo(() => {
    const dataWithSelectedAmount = [
      ...data.map((value) => ({ value, symbol: 'none', symbolSize: 0 })),
    ];

    if (isFinite(usdAmountToApy(selectedAmount))) {
      dataWithSelectedAmount.push({
        value: [selectedAmount, usdAmountToApy(selectedAmount)],
        symbol: 'circle',
        symbolSize: 24,
      });

      dataWithSelectedAmount.sort((a, b) => a.value[0] - b.value[0]);
    }

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
          data: dataWithSelectedAmount,
          lineStyle: { color: '#BFBFBF' },
          itemStyle: { color: '#DE1A60' },
          markLine: {
            animation: false,
            label: { show: false },
            symbol: 'none',
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
        },
      ],
    };
  }, [breakevenAmount, data, selectedAmount, usdAmountToApy]);

  return (
    <ReactEChartsCore
      option={option}
      lazyUpdate={true}
      notMerge={false}
      style={{
        height: '100%',
      }}
      onChartReady={(myChart) => {
        chartRef.current = myChart;
        setTimeout(updateGraphic, 100);
      }}
    />
  );
}

export default React.memo(
  MintChart,
  (prevProps, nextProps) =>
    prevProps.activeTier.label === nextProps.activeTier.label &&
    prevProps.selectedAmount === nextProps.selectedAmount &&
    prevProps.setSelectedAmount === nextProps.setSelectedAmount &&
    JSBI.equal(prevProps.rewardCmkPerSecond, nextProps.rewardCmkPerSecond) &&
    JSBI.equal(prevProps.totalCmkShares, nextProps.totalCmkShares),
);
