import { Img } from '@chakra-ui/image';
import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/layout';
import { Icon, SimpleGrid, SkeletonText, Tooltip } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { Collapse } from '@chakra-ui/transition';
import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
  IoAlertCircleSharp,
  IoInformationCircleOutline,
} from 'react-icons/io5';

import LineChart from '~/components/Charts/LineChart';
import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { AssetKey, GraphKey } from '~/types/terminal';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { ASSETS, GRAPHS } from './constants';
import StatContainer from './StatContainer';

export default function RiskTerminalData({
  dummy,
  disabled,
}: {
  dummy: boolean;
  disabled: boolean;
}) {
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

  const varData: Record<AssetKey, ReturnType<typeof useVarData>> = {
    AAVEV2: useVarData('AAVEV2', 90, dummy),
    COMPOUND: useVarData('COMPOUND', 90, dummy),
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
        name: asset.title,
        color: asset.color.toString(),
        data: dataPoints
          .filter((dp) => dp.ts > endTs)
          .map((dp) => ({
            timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
            value: dp.lcr * 100,
          }))
          .reverse(),
      });
    }

    return lines;
  })();

  const currentLcrs = (() => {
    const lcrs: Array<{
      name: string;
      lcr: number;
      totalAssets?: number;
      totalLiabilities?: number;
      marketCap?: number;
      v2Ratio?: number;
      ts: number;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (lcrData[asset.key].loading) continue;

      const dataPoints = lcrData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const maxLcr = {
        name: asset.title,
        lcr: Number(dataPoints[0]['lcr']),
        marketCap: dataPoints[0]['market_cap'],
        totalAssets: dataPoints[0]['total_assets'],
        totalLiabilities: dataPoints[0]['total_liabilities'],
        v2Ratio: dataPoints[0]['v2_ratio'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > maxLcr.ts) {
          maxLcr.lcr = Number(dp['lcr']);
          maxLcr.marketCap = dp['market_cap'];
          maxLcr.totalAssets = dp['total_assets'];
          maxLcr.totalLiabilities = dp['total_liabilities'];
          maxLcr.v2Ratio = dp['v2_ratio'];
          maxLcr.ts = dp.ts;
        }
      }

      lcrs.push(maxLcr);
    }

    return lcrs;
  })();

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
        name: asset.title,
        color: asset.color.toString(),
        data: dataPoints
          .filter((dp) => dp.ts > endTs)
          .map((dp) => ({
            timestamp: new Date((dp.ts - (dp.ts % 86400)) * 1000),
            value: Number(dp['10_day_99p']) * -1,
          }))
          .reverse(),
      });
    }

    return lines;
  })();

  const currentVars = (() => {
    const vars: Array<{
      name: string;
      var: number;
      totalAssets: number;
      totalLiabilities: number;
      ts: number;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (varData[asset.key].loading) continue;

      const dataPoints = varData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const maxVar = {
        name: asset.title,
        var: Number(dataPoints[0]['10_day_99p']) * -1,
        totalAssets: dataPoints[0]['total_assets'],
        totalLiabilities: dataPoints[0]['total_liabilities'],
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > maxVar.ts) {
          maxVar.var = Number(dp['10_day_99p']) * -1;
          maxVar.totalAssets = dp['total_assets'];
          maxVar.totalLiabilities = dp['total_liabilities'];
          maxVar.ts = dp.ts;
        }
      }

      vars.push(maxVar);
    }

    return vars;
  })();

  return (
    <VStack align="stretch" mt="-56px">
      <HStack
        zIndex={disabled ? 3 : undefined}
        alignSelf="center"
        px="6"
        pt="2"
        pb="1"
        bg="white"
        shadow="lg"
        rounded="lg"
        mb="8"
        spacing="4"
      >
        <Img src="/img/terminal.svg" h="72px" mt="-20px" />
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
      </HStack>

      <Container maxW="container.md" alignSelf="center">
        <Stack direction={{ base: 'column', md: 'row' }}>
          <Text
            color="gray.600"
            lineHeight="1"
            w={{ base: 'unset', md: '120px' }}
            fontFamily="Credmark Regular"
          >
            TOGGLE PROTOCOLS
          </Text>
          <Wrap spacing="4">
            {ASSETS.map((asset) => (
              <HStack key={asset.key} spacing="1">
                <HStack
                  cursor="pointer"
                  _hover={{
                    shadow: 'xl',
                  }}
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
                  whiteSpace="nowrap"
                >
                  <Box w="6">
                    <Img src={asset.logo} />
                  </Box>
                  <Text fontFamily="Credmark Regular">{asset.title}</Text>
                  {asset.subtitle && (
                    <Text fontSize="xs" fontWeight="500">
                      ({asset.subtitle})
                    </Text>
                  )}
                </HStack>
                <Link href={asset.infoLink} isExternal>
                  <Icon
                    as={IoInformationCircleOutline}
                    boxSize="20px"
                    color="purple.500"
                    transitionDuration="normal"
                    transitionProperty="transform"
                    _active={{
                      transform: 'scale(0.98)',
                    }}
                  />
                </Link>
              </HStack>
            ))}
          </Wrap>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} mt="6">
          <Text
            color="gray.600"
            lineHeight="1"
            w={{ base: 'unset', md: '120px' }}
            fontFamily="Credmark Regular"
          >
            TOGGLE GRAPHS
          </Text>
          <Wrap spacing="4">
            {GRAPHS.map((graph) => (
              <VStack
                key={graph.key}
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
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
                whiteSpace="nowrap"
              >
                <Text fontFamily="Credmark Regular" lineHeight="1">
                  {graph.title}
                </Text>
                <Text
                  fontFamily="Credmark Regular"
                  fontSize="xs"
                  lineHeight="1"
                >
                  {graph.subtitle}
                </Text>
              </VStack>
            ))}
          </Wrap>
        </Stack>
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
      {activeAssets.length === 0 ? (
        <Box pt="8">
          <Center
            bg="gray.50"
            py="20"
            px="4"
            textAlign="center"
            fontSize="2xl"
            flexDirection="column"
            color="gray.600"
            rounded="md"
          >
            <Icon as={IoAlertCircleSharp} boxSize={20} mb="4" />
            Select at least 1 protocol to view graphs
          </Center>
        </Box>
      ) : activeGraphs.length === 0 ? (
        <Box pt="8">
          <Center
            bg="gray.50"
            py="20"
            px="4"
            textAlign="center"
            fontSize="2xl"
            flexDirection="column"
            color="gray.600"
            rounded="md"
          >
            <Icon as={IoAlertCircleSharp} boxSize={20} mb="4" />
            Select at least 1 graph to view
          </Center>
        </Box>
      ) : (
        <></>
      )}
      <Collapse in={activeGraphs.includes('VAR') && activeAssets.length > 0}>
        <StatContainer
          title="VAR (VALUE AT RISK)"
          helpText={
            <Text>
              {GRAPHS.find((g) => g.key === 'VAR')?.description} <br />
              <br />
              <Link
                href="https://docs.credmark.com/credmark-risk-library/risk-metrics/value-at-risk-var"
                isExternal
                textDecoration="underline"
                pb="1"
              >
                Read more about VaR in our Risk Library{' '}
                <Icon as={FaExternalLinkAlt} />
              </Link>
            </Text>
          }
        >
          <Box>
            <Text
              textAlign="center"
              color="gray.600"
              fontSize="lg"
              mt="2"
              mb="4"
            >
              10-day VAR with 99% confidence
            </Text>
            <HStack justify="center">
              {currentVars.length === 0 && (
                <>
                  {ASSETS.map((asset) => (
                    <Box
                      key={asset.key}
                      m="4"
                      px="6"
                      py="4"
                      shadow="md"
                      bg="white"
                      rounded="lg"
                      w="280px"
                    >
                      <SkeletonText
                        my="4"
                        noOfLines={4}
                        spacing="4"
                        startColor={asset.color
                          .desaturate(0.5)
                          .lighten(0.5)
                          .toString()}
                        endColor={asset.color
                          .desaturate(0.7)
                          .lighten(0.5)
                          .toString()}
                      />
                    </Box>
                  ))}
                </>
              )}
              {currentVars.map((maxVar) => {
                const asset = ASSETS.find((a) => a.title === maxVar.name);
                if (!asset) throw new Error('Invalid asset');
                return (
                  <VStack
                    key={asset.key}
                    color={asset.color.toString()}
                    spacing="4"
                    m="4"
                    px="6"
                    py="4"
                    shadow="md"
                    bg="white"
                    rounded="lg"
                  >
                    <Text fontFamily="Credmark Regular">{asset.title}</Text>
                    <SimpleGrid
                      columns={2}
                      spacingX={4}
                      spacingY={0}
                      alignItems="center"
                      bg={asset.color.toString()}
                      color="white"
                      py="1"
                      px="4"
                      w="100%"
                      rounded="md"
                    >
                      <Text textAlign="center" fontSize="lg" fontWeight="bold">
                        VaR
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${maxVar.var.toFixed(1)}B
                      </Text>
                    </SimpleGrid>
                    <SimpleGrid
                      columns={2}
                      spacingX={4}
                      spacingY={0}
                      alignItems="center"
                    >
                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              Total Liabilities (TL) equals the total dollar
                              value of token deposited into the protocol.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">Total Liabilities</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${shortenNumber(maxVar.totalLiabilities, 1)}
                      </Text>

                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              Total Assets (TA) equals the total dollar value of
                              token borrowed from the protocol.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">Total Assets</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${shortenNumber(maxVar.totalAssets, 1)}
                      </Text>

                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              VaR / TL expresses the value at risk as a
                              percentage of the total dollar value of deposits
                              on the platform.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">VaR / TL</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        {(
                          ((maxVar.var * 1e9) / maxVar.totalLiabilities) *
                          100
                        ).toFixed(1)}
                        %
                      </Text>
                    </SimpleGrid>
                  </VStack>
                );
              })}
            </HStack>
          </Box>
        </StatContainer>
        <StatContainer title="Historic VaR">
          <LineChart
            lines={varLines}
            formatValue={(val: number) => '$' + val.toFixed(1) + 'B'}
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
            {varLines.length !== 0 &&
              !!Object.values(varData).find(({ loading }) => loading) && (
                <Spinner color="purple.500" />
              )}
          </Flex>
          {varLines.length === 0 && (
            <Center position="absolute" top="0" left="0" right="0" bottom="0">
              <Spinner color="purple.500" />
            </Center>
          )}
        </StatContainer>
      </Collapse>

      <Collapse in={activeGraphs.includes('LCR') && activeAssets.length > 0}>
        <StatContainer
          title="LCR (LIQUIDITY COVERAGE RATIO)"
          helpText={
            <Text>
              {GRAPHS.find((g) => g.key === 'LCR')?.description} <br />
              <br />
              <Link
                href="https://docs.credmark.com/credmark-risk-library/risk-metrics/liquidity-coverage-ratio-lcr"
                isExternal
                textDecoration="underline"
                pb="1"
              >
                Read more about LCR in our Risk Library{' '}
                <Icon as={FaExternalLinkAlt} />
              </Link>
            </Text>
          }
        >
          <Box>
            <Text
              textAlign="center"
              color="gray.600"
              fontSize="lg"
              mt="2"
              mb="4"
            >
              Latest LCR
            </Text>
            <HStack justify="center">
              {currentVars.length === 0 && (
                <>
                  {ASSETS.map((asset) => (
                    <Box
                      key={asset.key}
                      m="4"
                      px="6"
                      py="4"
                      shadow="md"
                      bg="white"
                      rounded="lg"
                      w="280px"
                    >
                      <SkeletonText
                        my="4"
                        noOfLines={4}
                        spacing="4"
                        startColor={asset.color
                          .desaturate(0.5)
                          .lighten(0.5)
                          .toString()}
                        endColor={asset.color
                          .desaturate(0.7)
                          .lighten(0.5)
                          .toString()}
                      />
                    </Box>
                  ))}
                </>
              )}
              {currentLcrs.map((maxLcr) => {
                const asset = ASSETS.find((a) => a.title === maxLcr.name);
                if (!asset) throw new Error('Invalid asset');
                return (
                  <VStack
                    key={asset.key}
                    color={asset.color.toString()}
                    spacing="4"
                    m="4"
                    px="6"
                    py="4"
                    shadow="md"
                    bg="white"
                    rounded="lg"
                  >
                    <Text fontFamily="Credmark Regular">{asset.title}</Text>
                    <SimpleGrid
                      columns={2}
                      spacingX={4}
                      spacingY={0}
                      alignItems="center"
                      bg={asset.color.toString()}
                      color="white"
                      py="1"
                      px="4"
                      w="100%"
                      rounded="md"
                    >
                      <Text textAlign="center" fontSize="lg" fontWeight="bold">
                        LCR
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        {(maxLcr.lcr * 100).toFixed(1)}%
                      </Text>
                    </SimpleGrid>
                    <SimpleGrid
                      columns={2}
                      spacingX={4}
                      spacingY={0}
                      alignItems="center"
                    >
                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              Total Liabilities (TL) equals the total dollar
                              value of token deposited into the protocol.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">Total Liabilities</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${shortenNumber(maxLcr.totalLiabilities ?? 0, 1)}
                      </Text>

                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              Total Assets (TA) equals the total dollar value of
                              token borrowed from the protocol.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">Total Assets</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${shortenNumber(maxLcr.totalAssets ?? 0, 1)}
                      </Text>

                      <Tooltip
                        bg="white"
                        color="purple.500"
                        border="1px"
                        borderColor="purple.500"
                        rounded="md"
                        fontSize="sm"
                        p="2"
                        label={
                          <HStack>
                            <Icon
                              as={IoInformationCircleOutline}
                              boxSize="20px"
                            />
                            <Text>
                              The Market Cap represents the current market
                              capitalization of the protocol&apos;s native
                              token.
                            </Text>
                          </HStack>
                        }
                      >
                        <Text textAlign="right">Market Cap</Text>
                      </Tooltip>
                      <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                        ${shortenNumber(maxLcr.marketCap ?? 0, 1)}
                      </Text>
                    </SimpleGrid>
                  </VStack>
                );
              })}
            </HStack>
          </Box>
        </StatContainer>
        <StatContainer title="Historic LCR">
          <LineChart
            lines={lcrLines}
            formatValue={(val: number) => val.toFixed(1) + '%'}
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
        </StatContainer>
      </Collapse>
    </VStack>
  );
}
