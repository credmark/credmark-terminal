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
import { Collapse, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
  IoAlertCircleSharp,
  IoInformationCircleOutline,
} from 'react-icons/io5';

import { useLcrData, useVarData } from '~/hooks/useTerminalData';
import { AssetKey, MetricGroupInfo, MetricGroupKey } from '~/types/terminal';

import { ASSETS, METRIC_GROUPS } from './constants';
import CoreMetrics from './CoreMetrics';
import RiskMetrics from './RiskMetrics';

function GraphToggleButton({
  metricGroup,
  isSelected,
  onToggle,
}: {
  metricGroup: MetricGroupInfo;
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
      pt="1"
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
        {metricGroup.title}
      </Text>
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

  const [activeMetricGroups, setActiveMetricGroups] = useState<
    MetricGroupKey[]
  >(METRIC_GROUPS.map((mg) => mg.key));

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
            TOGGLE METRICS
          </Text>
          <Wrap spacing="2">
            {METRIC_GROUPS.map((metricGroup) => (
              <GraphToggleButton
                key={metricGroup.key}
                metricGroup={metricGroup}
                isSelected={activeMetricGroups.includes(metricGroup.key)}
                onToggle={() =>
                  activeMetricGroups.includes(metricGroup.key)
                    ? setActiveMetricGroups(
                        activeMetricGroups.filter(
                          (aa) => aa !== metricGroup.key,
                        ),
                      )
                    : setActiveMetricGroups([
                        ...activeMetricGroups,
                        metricGroup.key,
                      ])
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
      ) : activeMetricGroups.length === 0 ? (
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

      <Collapse
        in={activeMetricGroups.includes('RISK') && activeAssets.length > 0}
      >
        <RiskMetrics
          activeAssets={activeAssets}
          varData={varData}
          lcrData={lcrData}
        />
      </Collapse>

      <Collapse
        in={activeMetricGroups.includes('CORE') && activeAssets.length > 0}
      >
        <CoreMetrics
          activeAssets={activeAssets}
          varData={varData}
          lcrData={lcrData}
        />
      </Collapse>
    </VStack>
  );
}
