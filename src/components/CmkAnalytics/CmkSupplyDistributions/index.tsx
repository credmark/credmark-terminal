import { Box } from '@chakra-ui/layout';
import { Img, HStack, Text, Container, IconButton } from '@chakra-ui/react';
import ReactEChartsCore from 'echarts-for-react';
import React, { useMemo, useState } from 'react';

import { CmkDownloadIcon } from '~/components/Icons';
import CmkFullScreenIcon from '~/components/Icons/CmkFullScreenIcon';
import {
  CmkAnalyticsDataPoint,
  StakedCmkAnalyticsDataPoint,
} from '~/types/analytics';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface PieChartProps {
  cmkData: CmkAnalyticsDataPoint;
  xcmkData: StakedCmkAnalyticsDataPoint;
  titleImg: string;
}

export default function CmkSupplyDistributions({
  cmkData,
  xcmkData,
  titleImg,
}: PieChartProps): JSX.Element {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const option = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: {
          marker: string;
          name: string;
          value: number;
        }) => {
          return `
                <div style="display: flex; margin-bottom: 2px;">
                  <div>${params.marker}</div>
                  <div style="flex: 1">${params.name}</div>
                  <strong style="margin-left: 16px">${shortenNumber(
                    params.value,
                    1,
                  )} CMK</strong>
                </div>
                `;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['0%', '50%'],
          label: {
            position: 'inner',
            fontSize: 10,
            fontWeight: 900,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value:
                1e8 -
                (Number(cmkData.supply_distribution.community_treasury) +
                  Number(cmkData.supply_distribution.dao_treasury) +
                  Number(cmkData.supply_distribution.investor) +
                  Number(cmkData.supply_distribution.team_allocated) +
                  Number(cmkData.supply_distribution.team_unallocated) +
                  Number(cmkData.supply_distribution.vesting_unallocated)),
              itemStyle: { color: '#DB1976' },
              name: 'Public',
            },
            {
              value:
                Number(cmkData.supply_distribution.community_treasury) +
                Number(cmkData.supply_distribution.dao_treasury),
              itemStyle: { color: '#3B0065' },
              name: 'Treasury',
            },
            {
              value:
                Number(cmkData.supply_distribution.investor) +
                Number(cmkData.supply_distribution.team_allocated) +
                Number(cmkData.supply_distribution.team_unallocated) +
                Number(cmkData.supply_distribution.vesting_unallocated),
              itemStyle: { color: '#00BD84' },
              name: 'Locked',
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          type: 'pie',
          radius: ['55%', '70%'],
          data: [
            {
              value:
                1e8 -
                (Number(cmkData.supply_distribution.community_treasury) +
                  Number(cmkData.supply_distribution.dao_treasury) +
                  Number(cmkData.supply_distribution.investor) +
                  Number(cmkData.supply_distribution.team_allocated) +
                  Number(cmkData.supply_distribution.team_unallocated) +
                  Number(cmkData.supply_distribution.vesting_unallocated) +
                  Number(xcmkData.cmk_balance)),
              itemStyle: { color: '#DB1976' },
              name: 'Public Circulating Supply',
            },
            {
              value: xcmkData.cmk_balance,
              itemStyle: { color: '#BC1565' },
              name: 'CMK Staked',
            },
            {
              value: cmkData.supply_distribution.community_treasury,
              itemStyle: { color: '#420069' },
              name: 'Community Rewards',
            },
            {
              value: cmkData.supply_distribution.dao_treasury,
              itemStyle: { color: '#590099' },
              name: 'DAO Treasury',
            },
            {
              value: cmkData.supply_distribution.investor,
              itemStyle: { color: '#00996B' },
              name: 'Investors',
            },
            {
              value: cmkData.supply_distribution.team_allocated,
              itemStyle: { color: '#00AD7A' },
              name: 'Team & Founders',
            },
            {
              value: cmkData.supply_distribution.team_unallocated,
              itemStyle: { color: '#00BD84' },
              name: 'Team Unallocated',
            },
            {
              value: cmkData.supply_distribution.vesting_unallocated,
              itemStyle: { color: '#00D696' },
              name: 'Vesting Unallocated',
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }, [
    cmkData.supply_distribution.community_treasury,
    cmkData.supply_distribution.dao_treasury,
    cmkData.supply_distribution.investor,
    cmkData.supply_distribution.team_allocated,
    cmkData.supply_distribution.team_unallocated,
    cmkData.supply_distribution.vesting_unallocated,
    xcmkData.cmk_balance,
  ]);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document?.getElementById('CMK-Supply-Distribution')?.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document?.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <Container
      minWidth="320px"
      width="100%"
      padding={0}
      border="1px solid #DEDEDE"
      shadow=" rgba(224, 227, 234, 0.6) 0px 0px 10px"
      id="CMK-Supply-Distribution"
      backgroundColor="#fff"
    >
      <Box
        borderBottom="1px solid #DEDEDE"
        display="grid"
        gridTemplateColumns="1fr 20px 20px"
        gap="5"
        paddingLeft="3"
        paddingRight="5"
        alignItems="center"
      >
        <HStack bg="transparent">
          <Img src={titleImg} h="4" />
          <Text fontSize="md" color="purple.500">
            CMK Supply Distribution
          </Text>
        </HStack>

        <IconButton
          aria-label="Fullscreen"
          cursor="pointer"
          backgroundColor="transparent"
          icon={<CmkDownloadIcon fontSize="15" fill="#999999" />}
        />
        <IconButton
          aria-label="Fullscreen"
          cursor="pointer"
          backgroundColor="transparent"
          icon={<CmkFullScreenIcon fontSize="15" fill="#999999" />}
          onClick={toggleFullScreen}
        />
      </Box>

      <Box position="relative">
        <Box position="absolute" top={0} left={1}>
          <Text
            fontSize="sm"
            pt="1"
            color="purple.500"
            paddingLeft="2"
            paddingBottom="2"
          >
            Total Supply:{' '}
            <strong>
              {' '}
              {shortenNumber(Number(cmkData.total_supply), 0)} CMK
            </strong>
          </Text>
        </Box>

        <ReactEChartsCore
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{
            height: isFullScreen ? '70vh' : '360px',
          }}
        />
      </Box>
    </Container>
  );
}
