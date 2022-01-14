import {
  Box,
  Flex,
  HStack,
  Img,
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
                bg={asset.color.toString()}
                color={'white'}
                boxShadow={`0px 0px 20px 0px ${asset.color
                  .fade(0.6)
                  .toString()}`}
                spacing="6"
                px="6"
                pb="6"
                rounded="lg"
              >
                <HStack
                  bg="white"
                  color={asset.color.toString()}
                  px="4"
                  py="1"
                  roundedBottom="md"
                >
                  <Img src={asset.logo} h="20px" />
                  <Text fontFamily="Credmark Regular" pt="2px">
                    {asset.title}
                  </Text>
                </HStack>
                {assetStats.length > 0 && (
                  <VStack w="100%" maxW="320px" align="stretch" spacing="5">
                    {assetStats.map((stat, psi) => (
                      <Flex align="center" direction="column" key={psi}>
                        <HStack justify="center" w="full">
                          <Text fontSize="14px" lineHeight="1">
                            {stat.key}
                          </Text>
                          {stat.tooltip && (
                            <InfoPopover>{stat.tooltip}</InfoPopover>
                          )}
                        </HStack>
                        <Text
                          fontSize="3xl"
                          fontWeight="bold"
                          textAlign="left"
                          lineHeight="1.325"
                        >
                          {stat.value}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </VStack>
            );
          })}
    </Stack>
  );
}
