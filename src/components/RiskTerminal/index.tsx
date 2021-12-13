import { Img } from '@chakra-ui/image';
import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Icon } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { Collapse } from '@chakra-ui/transition';
import React, { useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

import LineChart from '~/components/Charts/LineChart';
import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { AssetKey, GraphKey } from '~/types/terminal';

import { ASSETS, GRAPHS } from './constants';

export default function RiskTerminalData({ dummy }: { dummy: boolean }) {
  const [activeAssets, setActiveAssets] = useState<AssetKey[]>([
    'AAVEV2',
    'COMPOUND',
  ]);

  const [activeGraphs, setActiveGraphs] = useState<GraphKey[]>(
    GRAPHS.map((graph) => graph.key),
  );

  const [lcrDuration, setLcrDuration] = useState(30); // In Days
  const [varDuration, setVarDuration] = useState(30); // In Days

  const lcrData: Record<AssetKey, ReturnType<typeof useLcrData>> = {
    AAVEV2: useLcrData('AAVEV2', 90, dummy),
    COMPOUND: useLcrData('COMPOUND', 90, dummy),
  };

  const lcrLines = (() => {
    const lines: Array<{
      name: string;
      color: string;
      data: Array<{
        timestamp: Date;
        value: number;
      }>;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (lcrData[asset.key].loading) continue;

      const dataPoints = lcrData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const startTs = dataPoints[0].ts;
      const endTs = startTs - lcrDuration * 24 * 3600;

      lines.push({
        name: asset.name,
        color: asset.color.toString(),
        data: dataPoints
          .filter((dp) => dp.ts > endTs)
          .map((dp) => ({
            timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
            value: dp.lcr,
          }))
          .reverse(),
      });
    }

    return lines;
  })();

  const varData: Record<AssetKey, ReturnType<typeof useVarData>> = {
    AAVEV2: useVarData('AAVEV2', 90, dummy),
    COMPOUND: useVarData('COMPOUND', 90, dummy),
  };

  const varLines = (() => {
    const lines: Array<{
      name: string;
      color: string;
      data: Array<{
        timestamp: Date;
        value: number;
      }>;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (varData[asset.key].loading) continue;

      const dataPoints = varData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const startTs = dataPoints[0].ts;
      const endTs = startTs - varDuration * 24 * 3600;

      lines.push({
        name: asset.name,
        color: asset.color.toString(),
        data: dataPoints
          .filter((dp) => dp.ts > endTs)
          .map((dp) => ({
            timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
            value: Number(dp['10_day_99p']),
          }))
          .reverse(),
      });
    }

    return lines;
  })();

  // const varData: Record<AssetKey, ReturnType<typeof useVarData>> = {
  //   AAVEV2: useVarData('AAVEV2', 2, dummy),
  //   COMPOUND: useVarData('COMPOUND', 2, dummy),
  // };

  // const formattedVar = (asset: AssetKey) => {
  //   if (varData[asset].loading) return '??';
  //   if ((varData[asset].data?.length ?? 0) === 0) return '-';
  //   return Number(varData[asset].data?.[0]['10_day_99p']).toFixed(2);
  // };

  // const formattedVarChange = (asset: AssetKey) => {
  //   if (varData[asset].loading) return '';
  //   const curr = varData[asset].data?.[0]?.['10_day_99p'];
  //   const prev = varData[asset].data?.[1]?.['10_day_99p'];
  //   if (curr === undefined) return '';
  //   if (prev === undefined) return '-';

  //   const percChange =
  //     ((parseFloat(prev) - parseFloat(curr)) * 100) / parseFloat(prev);
  //   return (percChange > 0 ? '+' : '') + percChange.toFixed(2) + '%';
  // };

  return (
    <VStack align="stretch" mt="-56px">
      <Box
        zIndex="3"
        alignSelf="center"
        px="6"
        pt="2"
        pb="1"
        bg="white"
        shadow="lg"
        rounded="lg"
        mb="8"
      >
        <Text
          fontFamily="Credmark Regular"
          textAlign="center"
          bgGradient="linear(135deg, #08538C, #3B0065)"
          bgClip="text"
          lineHeight="1.2"
          fontSize="4xl"
        >
          RISK TERMINAL
        </Text>
      </Box>

      <Container maxW="container.md" alignSelf="center">
        <Flex align="center" fontFamily="Credmark Regular">
          <Text color="gray.600" lineHeight="1">
            TOGGLE
            <br />
            ASSETS
          </Text>
          {ASSETS.map((asset) => (
            <HStack key={asset.key}>
              <HStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="8"
                color={asset.color.toString()}
                bg={asset.color.fade(0.875).toString()}
                px="4"
                h="10"
                rounded="md"
                border={activeAssets.includes(asset.key) ? '2px' : '1px'}
                borderColor={asset.color.toString()}
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeAssets.includes(asset.key) ? 1.0 : 0.5}
                onClick={() =>
                  activeAssets.includes(asset.key)
                    ? setActiveAssets(
                        activeAssets.filter((aa) => aa !== asset.key),
                      )
                    : setActiveAssets([...activeAssets, asset.key])
                }
              >
                <Img src={asset.logo} w="6" />
                <Text>{asset.name}</Text>
              </HStack>
              <Link
                href={asset.infoLink}
                isExternal
                _hover={{ color: 'purple.500' }}
              >
                <Icon as={IoInformationCircleOutline} boxSize="20px" />
              </Link>
            </HStack>
          ))}
        </Flex>
        <Flex align="center" mt="4" fontFamily="Credmark Regular">
          <Text color="gray.600" lineHeight="1">
            TOGGLE
            <br />
            GRAPHS
          </Text>
          {GRAPHS.map((graph) => (
            <HStack key={graph.key}>
              <VStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="8"
                color="gray.700"
                bg="gray.50"
                px="4"
                h="10"
                rounded="md"
                border={activeGraphs.includes(graph.key) ? '2px' : '1px'}
                borderColor="#gray.700"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeGraphs.includes(graph.key) ? 1.0 : 0.5}
                onClick={() =>
                  activeGraphs.includes(graph.key)
                    ? setActiveGraphs(
                        activeGraphs.filter((aa) => aa !== graph.key),
                      )
                    : setActiveGraphs([...activeGraphs, graph.key])
                }
                spacing="0"
                justify="center"
              >
                <Text lineHeight="1">{graph.name}</Text>
                <Text fontSize="xs" lineHeight="1">
                  {graph.description}
                </Text>
              </VStack>
              <Link
                href={graph.infoLink}
                isExternal
                _hover={{ color: 'purple.500' }}
              >
                <Icon as={IoInformationCircleOutline} boxSize="20px" />
              </Link>
            </HStack>
          ))}
        </Flex>
        {dummy && (
          <Flex>
            <Text
              textAlign="left"
              mt="6"
              fontSize="sm"
              bg="purple.50"
              px="2"
              py="1"
              rounded="md"
              color="purple.500"
            >
              * Not actual data. To see real data, switch to Mainnet and Stake
              some CMK
            </Text>
          </Flex>
        )}
      </Container>
      <Collapse in={activeGraphs.includes('VAR')}>
        <Box
          position="relative"
          mx="auto"
          mt="12"
          pt="2"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          w="400px"
          zIndex="2"
        >
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            lineHeight="1.2"
            fontSize="xl"
            color="purple.500"
          >
            VAR (VALUE AT RISK)
          </Text>
        </Box>
        <Box
          position="relative"
          bg="gray.50"
          py="8"
          mt="-4"
          zIndex="1"
          rounded="md"
        >
          <LineChart
            lines={varLines}
            formatValue={(val: number) => val.toFixed(1)}
          />
          <Flex pl="20" align="center">
            {[30, 60, 90].map((days) => (
              <Box
                key={days}
                p="2"
                mx="2"
                fontWeight="bold"
                color={varDuration === days ? 'gray.900' : 'gray.300'}
                cursor="pointer"
                borderBottom={varDuration === days ? '2px' : '0'}
                borderColor="gray.700"
                onClick={() => setVarDuration(days)}
                _hover={
                  varDuration === days
                    ? {}
                    : {
                        color: 'gray.700',
                      }
                }
              >
                {days}D
              </Box>
            ))}
            {lcrLines.length !== 0 &&
              !!Object.values(varData).find(({ loading }) => loading) && (
                <Spinner color="purple.500" />
              )}
          </Flex>
          {lcrLines.length === 0 && (
            <Center position="absolute" top="0" left="0" right="0" bottom="0">
              <Spinner color="purple.500" />
            </Center>
          )}
        </Box>
        {/* <Box
          position="relative"
          mx="auto"
          mt="12"
          pt="2"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          w="400px"
          zIndex="2"
        >
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            lineHeight="1.2"
            fontSize="xl"
            color="purple.500"
          >
            VAR (VALUE AT RISK)
          </Text>
        </Box>
        <Box
          position="relative"
          bg="gray.50"
          py="8"
          mt="-4"
          zIndex="1"
          rounded="md"
        >
          <Flex justify="center">
            {activeAssets.map((aa) => {
              const asset = ASSETS.find((a) => a.key === aa);
              if (!asset) throw new Error('Invalid asset');
              return (
                <VStack
                  key={asset.key}
                  color={asset.color.toString()}
                  spacing="0"
                  m="4"
                  px="6"
                  py="2"
                  shadow="md"
                  bg="white"
                  rounded="lg"
                >
                  <Text fontFamily="Credmark Regular">{asset.name}</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {formattedVar(asset.key)}
                  </Text>
                  <Text fontSize="xs">{formattedVarChange(asset.key)}</Text>
                </VStack>
              );
            })}
          </Flex>
        </Box> */}
      </Collapse>

      <Collapse in={activeGraphs.includes('LCR')}>
        <Box
          position="relative"
          mx="auto"
          mt="12"
          pt="2"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          w="400px"
          zIndex="2"
        >
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            lineHeight="1.2"
            fontSize="xl"
            color="purple.500"
          >
            LCR (LIQUIDITY COVERAGE RATIO)
          </Text>
        </Box>
        <Box
          position="relative"
          bg="gray.50"
          py="8"
          mt="-4"
          zIndex="1"
          rounded="md"
        >
          <LineChart
            lines={lcrLines}
            formatValue={(val: number) => (val * 100).toFixed(1) + '%'}
          />
          <Flex pl="20" align="center">
            {[30, 60, 90].map((days) => (
              <Box
                key={days}
                p="2"
                mx="2"
                fontWeight="bold"
                color={lcrDuration === days ? 'gray.900' : 'gray.300'}
                cursor="pointer"
                borderBottom={lcrDuration === days ? '2px' : '0'}
                borderColor="gray.700"
                onClick={() => setLcrDuration(days)}
                _hover={
                  lcrDuration === days
                    ? {}
                    : {
                        color: 'gray.700',
                      }
                }
              >
                {days}D
              </Box>
            ))}
            {lcrLines.length !== 0 &&
              !!Object.values(lcrData).find(({ loading }) => loading) && (
                <Spinner color="purple.500" />
              )}
          </Flex>
          {lcrLines.length === 0 && (
            <Center position="absolute" top="0" left="0" right="0" bottom="0">
              <Spinner color="purple.500" />
            </Center>
          )}
        </Box>
      </Collapse>
    </VStack>
  );
}
