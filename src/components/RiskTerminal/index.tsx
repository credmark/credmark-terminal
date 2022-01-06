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
import { Icon } from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import React, { useState } from 'react';
import {
  IoAlertCircleSharp,
  IoInformationCircleOutline,
} from 'react-icons/io5';

import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { AssetKey, GraphInfo, GraphKey } from '~/types/terminal';

import { ASSETS, GRAPHS, SECONDARY_GRAPHS } from './constants';
import LcrStats from './LcrStats';
import McStats from './McStats';
import TaStats from './TaStats';
import TlStats from './TlStats';
import VarStats from './VarStats';

function GraphToggleButton({
  graph,
  isSelected,
  onToggle,
}: {
  graph: GraphInfo;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <VStack
      cursor="pointer"
      _hover={{
        shadow: 'xl',
      }}
      color="gray.700"
      bg="gray.50"
      px="4"
      h="10"
      rounded="md"
      border={isSelected ? '2px' : '1px'}
      borderColor="#gray.700"
      transitionProperty="box-shadow"
      transitionDuration="normal"
      opacity={isSelected ? 1.0 : 0.5}
      onClick={onToggle}
      spacing="0"
      justify="center"
      whiteSpace="nowrap"
    >
      <Text fontFamily="Credmark Regular" lineHeight="1">
        {graph.title}
      </Text>
      {graph.subtitle && (
        <Text fontFamily="Credmark Regular" fontSize="xs" lineHeight="1">
          {graph.subtitle}
        </Text>
      )}
    </VStack>
  );
}

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

  const [activeGraphs, setActiveGraphs] = useState<GraphKey[]>([
    ...GRAPHS.map((graph) => graph.key),
    ...SECONDARY_GRAPHS.map((graph) => graph.key),
  ]);

  const lcrData: Record<AssetKey, ReturnType<typeof useLcrData>> = {
    AAVEV2: useLcrData('AAVEV2', 90, dummy),
    COMPOUND: useLcrData('COMPOUND', 90, dummy),
  };

  const varData: Record<AssetKey, ReturnType<typeof useVarData>> = {
    AAVEV2: useVarData('AAVEV2', 90, dummy),
    COMPOUND: useVarData('COMPOUND', 90, dummy),
  };

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
            minW={{ base: 'unset', md: '120px' }}
            maxW={{ base: 'unset', md: '120px' }}
            fontFamily="Credmark Regular"
          >
            TOGGLE GRAPHS
          </Text>
          <Wrap spacing="2">
            {GRAPHS.map((graph) => (
              <GraphToggleButton
                key={graph.key}
                graph={graph}
                isSelected={activeGraphs.includes(graph.key)}
                onToggle={() =>
                  activeGraphs.includes(graph.key)
                    ? setActiveGraphs(
                        activeGraphs.filter((aa) => aa !== graph.key),
                      )
                    : setActiveGraphs([...activeGraphs, graph.key])
                }
              />
            ))}
          </Wrap>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} mt="2">
          <Text
            color="gray.600"
            lineHeight="1"
            minW={{ base: 'unset', md: '120px' }}
            maxW={{ base: 'unset', md: '120px' }}
            fontFamily="Credmark Regular"
          ></Text>
          <Wrap spacing="2">
            {SECONDARY_GRAPHS.map((graph) => (
              <GraphToggleButton
                key={graph.key}
                graph={graph}
                isSelected={activeGraphs.includes(graph.key)}
                onToggle={() =>
                  activeGraphs.includes(graph.key)
                    ? setActiveGraphs(
                        activeGraphs.filter((aa) => aa !== graph.key),
                      )
                    : setActiveGraphs([...activeGraphs, graph.key])
                }
              />
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
        <VarStats activeAssets={activeAssets} data={varData} />
      </Collapse>

      <Collapse in={activeGraphs.includes('LCR') && activeAssets.length > 0}>
        <LcrStats activeAssets={activeAssets} data={lcrData} />
      </Collapse>

      <Collapse in={activeGraphs.includes('TA') && activeAssets.length > 0}>
        <TaStats activeAssets={activeAssets} data={varData} />
      </Collapse>

      <Collapse in={activeGraphs.includes('TL') && activeAssets.length > 0}>
        <TlStats activeAssets={activeAssets} data={varData} />
      </Collapse>

      <Collapse in={activeGraphs.includes('MC') && activeAssets.length > 0}>
        <McStats activeAssets={activeAssets} data={lcrData} />
      </Collapse>
    </VStack>
  );
}
