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
import {
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/spinner';
import { Collapse } from '@chakra-ui/transition';
import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
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
      val: number;
    }> = [];

    for (const asset of ASSETS) {
      if (!activeAssets.includes(asset.key)) continue;
      if (varData[asset.key].loading) continue;

      const dataPoints = varData[asset.key].data;
      if (!dataPoints || dataPoints.length === 0) continue;

      const maxVar = {
        name: asset.title,
        val: Number(dataPoints[0]['10_day_99p']) * -1,
        ts: dataPoints[0].ts,
      };

      for (const dp of dataPoints) {
        if (dp.ts > maxVar.ts) {
          maxVar.val = Number(dataPoints[0]['10_day_99p']) * -1;
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
        zIndex="3"
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
        <Flex align="center">
          <Text
            color="gray.600"
            lineHeight="1"
            w="120px"
            fontFamily="Credmark Regular"
          >
            TOGGLE
            <br />
            PROTOCOLS
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
        </Flex>
        <Flex align="center" mt="4" fontFamily="Credmark Regular">
          <Text color="gray.600" lineHeight="1" w="120px">
            TOGGLE
            <br />
            GRAPHS
          </Text>
          {GRAPHS.map((graph) => (
            <VStack
              key={graph.key}
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
              <Text lineHeight="1">{graph.title}</Text>
              <Text fontSize="xs" lineHeight="1">
                {graph.subtitle}
              </Text>
            </VStack>
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
        <HStack
          position="relative"
          mx="auto"
          mt="12"
          pt="1"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          w="400px"
          zIndex="2"
          justify="center"
        >
          <Text
            fontFamily="Credmark Regular"
            pt="1"
            textAlign="center"
            lineHeight="1.2"
            fontSize="xl"
            color="purple.500"
          >
            VAR (VALUE AT RISK)
          </Text>
          <Popover placement="right" gutter={16}>
            <PopoverTrigger>
              <Box>
                <Icon
                  as={IoInformationCircleOutline}
                  boxSize="20px"
                  cursor="pointer"
                  color="purple.500"
                  transitionDuration="normal"
                  transitionProperty="transform"
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                />
              </Box>
            </PopoverTrigger>
            <PopoverContent
              color="purple.500"
              bg="white"
              borderColor="purple.500"
            >
              <PopoverArrow
                borderColor="purple.500"
                borderLeft="1px"
                borderBottom="1px"
              />
              <PopoverCloseButton
                top="-2"
                right="-2"
                bg="purple.500"
                color="white"
                rounded="full"
                _hover={{
                  bg: 'purple.500',
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'scale(0.98)',
                  boxShadow: 'inner',
                }}
              />
              <PopoverBody p="4">
                <Text>
                  {GRAPHS.find((g) => g.key === 'VAR')?.description} <br />
                  <br />
                  <Link
                    href="https://docs.credmark.com/credmark-risk-library/risk-metrics/value-at-risk-var"
                    isExternal
                    textDecoration="underline"
                    pb="1"
                  >
                    Read more about VAR in our Risk Library{' '}
                    <Icon as={FaExternalLinkAlt} />
                  </Link>
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Box
          position="relative"
          bg="gray.50"
          py="8"
          mt="-4"
          zIndex="1"
          rounded="md"
        >
          {varLines.length === 0 &&
            !!Object.values(varData).find(({ loading }) => loading) && (
              <Center py="10">
                <Spinner color="purple.500" />
              </Center>
            )}
          {currentVars.length > 0 && (
            <>
              <Text textAlign="center" color="purple.500" fontSize="lg">
                VAR over 10 days with 99% confidence
              </Text>
              <HStack justify="center">
                {currentVars.map((maxVar) => {
                  const asset = ASSETS.find((a) => a.title === maxVar.name);
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
                      <Text fontFamily="Credmark Regular">{asset.title}</Text>
                      <Text fontSize="2xl" fontWeight="bold">
                        ${maxVar.val.toFixed(2)}B
                      </Text>
                    </VStack>
                  );
                })}
              </HStack>
            </>
          )}
        </Box>
      </Collapse>

      <Collapse in={activeGraphs.includes('LCR')}>
        <HStack
          position="relative"
          mx="auto"
          mt="12"
          pt="1"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          w="400px"
          zIndex="2"
          justify="center"
        >
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            lineHeight="1.2"
            fontSize="xl"
            color="purple.500"
            pt="1"
          >
            LCR (LIQUIDITY COVERAGE RATIO)
          </Text>
          <Popover placement="right" gutter={16}>
            <PopoverTrigger>
              <Box>
                <Icon
                  as={IoInformationCircleOutline}
                  boxSize="20px"
                  cursor="pointer"
                  color="purple.500"
                  transitionDuration="normal"
                  transitionProperty="transform"
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                />
              </Box>
            </PopoverTrigger>
            <PopoverContent
              color="purple.500"
              bg="white"
              borderColor="purple.500"
            >
              <PopoverArrow
                borderColor="purple.500"
                borderLeft="1px"
                borderBottom="1px"
              />
              <PopoverCloseButton
                top="-2"
                right="-2"
                bg="purple.500"
                color="white"
                rounded="full"
                _hover={{
                  bg: 'purple.500',
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                _active={{
                  transform: 'scale(0.98)',
                  boxShadow: 'inner',
                }}
              />
              <PopoverBody p="4">
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
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
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
        </Box>
      </Collapse>
    </VStack>
  );
}
