import {
  Box,
  HStack,
  Icon,
  SimpleGrid,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';

import { AssetKey, AssetStatsMap } from '~/types/terminal';

import { ASSETS } from './constants';

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
        : Object.entries(stats).map(([assetKey, list]) => {
            const asset = ASSETS.find((a) => a.key === assetKey);
            if (!asset) throw new Error('Invalid asset');

            const primaryStats = list.filter((li) => li.isPrimary);
            const secondaryStats = list.filter((li) => !li.isPrimary);

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
                {primaryStats.length > 0 && (
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
                    {primaryStats.map((ps, psi) => (
                      <React.Fragment key={psi}>
                        <Text
                          textAlign="center"
                          fontSize="lg"
                          fontWeight="bold"
                        >
                          {ps.key}
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                          {ps.value}
                        </Text>
                      </React.Fragment>
                    ))}
                  </SimpleGrid>
                )}

                {secondaryStats.length > 0 && (
                  <SimpleGrid
                    columns={2}
                    spacingX={4}
                    spacingY={0}
                    alignItems="center"
                  >
                    {secondaryStats.map((ps, psi) => (
                      <React.Fragment key={psi}>
                        {ps.tooltip ? (
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
                                <Text>{ps.tooltip}</Text>
                              </HStack>
                            }
                          >
                            <Text textAlign="right">{ps.key}</Text>
                          </Tooltip>
                        ) : (
                          <Text textAlign="right">{ps.key}</Text>
                        )}
                        <Text fontSize="2xl" fontWeight="bold" textAlign="left">
                          {ps.value}
                        </Text>
                      </React.Fragment>
                    ))}
                  </SimpleGrid>
                )}
              </VStack>
            );
          })}
      {}
    </Stack>
  );
}
