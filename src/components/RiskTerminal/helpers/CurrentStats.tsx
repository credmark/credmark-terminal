import {
  Box,
  Flex,
  HStack,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import InfoPopover from '~/components/InfoPopover';
import { AssetKey, AssetStatsMap } from '~/types/terminal';

import { ASSETS } from '../constants';

interface CurrentStatsProps {
  loading: boolean;
  activeAssets: AssetKey[];
  stats: AssetStatsMap;
}

export default function CurrentStats({
  loading,
  activeAssets,
  stats,
}: CurrentStatsProps) {
  return (
    <Stack
      justify="center"
      direction={{ base: 'column', md: 'row' }}
      px="4"
      spacing="4"
    >
      {loading
        ? ASSETS.filter((asset) => activeAssets.includes(asset.key)).map(
            (asset) => (
              <Box
                minW="280px"
                key={asset.key}
                spacing="4"
                px="6"
                py="6"
                shadow="md"
                bg="white"
                rounded="lg"
              >
                <SkeletonText
                  my="4"
                  noOfLines={4}
                  spacing="4"
                  startColor={asset.color
                    .desaturate(0.5)
                    .lighten(0.5)
                    .toString()}
                  endColor={asset.color.desaturate(0.7).lighten(0.5).toString()}
                />
              </Box>
            ),
          )
        : Object.entries(stats).map(([assetKey, assetStats]) => {
            const asset = ASSETS.find((a) => a.key === assetKey);
            if (!asset) throw new Error('Invalid asset');

            return (
              <VStack
                minW="280px"
                key={asset.key}
                color={asset.color.toString()}
                spacing="4"
                px="6"
                py="6"
                shadow="md"
                bg="white"
                rounded="lg"
              >
                <Text fontFamily="Credmark Regular">{asset.title}</Text>
                {assetStats.length > 0 && (
                  <Box w="100%" maxW="320px">
                    {assetStats.map((stat, psi) => (
                      <Flex key={psi} align="center">
                        <HStack flex="1.5" justify="center">
                          {stat.tooltip && (
                            <InfoPopover>{stat.tooltip}</InfoPopover>
                          )}
                          <Text textAlign="center" fontSize="14px">
                            {stat.key}
                          </Text>
                        </HStack>
                        <Text
                          ml="2"
                          fontSize="xl"
                          fontWeight="bold"
                          textAlign="left"
                          flex="1"
                        >
                          {stat.value}
                        </Text>
                      </Flex>
                    ))}
                  </Box>
                )}
              </VStack>
            );
          })}
    </Stack>
  );
}
