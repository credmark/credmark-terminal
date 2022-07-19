import {
  Box,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Spacer,
  Tag,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { Card } from '~/components/base';
import { ModelInfo } from '~/types/model';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface ModelCardProps {
  model: ModelInfo;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Card>
      <LinkBox key={model.slug} p="4">
        <HStack pb="4">
          <Text fontWeight={300}>{model.hSlug || model.slug}</Text>

          <Spacer />

          {!!model.allTimeUsageRank && (
            <Tag bg="purple.800" variant="solid">
              Top #{model.allTimeUsageRank}
            </Tag>
          )}
        </HStack>
        <Box flex="1">
          <Heading as="h3" fontSize="xl" mt="1">
            <LinkOverlay
              href={`https://gateway.credmark.com/model-docs?section=${model.category}#operation/model-${model.slug}`}
              isExternal
              _hover={{ textDecoration: 'underline' }}
            >
              {model.hDisplayName || model.displayName}
            </LinkOverlay>
          </Heading>
          <Text mt="2" fontSize="sm">
            {model.hDescription || model.description}
          </Text>
          {model.developer && (
            <Text fontSize="sm" color="gray.600">
              {' '}
              - {model.hDeveloper || model.developer}
            </Text>
          )}
        </Box>
        <HStack alignItems="flex-start" mt="4" spacing="2">
          <Tag colorScheme="green">{model.category}</Tag>
          <Text fontSize="sm" px="1">
            <Text as="span" fontWeight="bold">
              {shortenNumber(model.monthlyUsage ?? 0, 0)}
            </Text>{' '}
            <Text as="span" fontWeight="thin">
              reqs in 30d
            </Text>
          </Text>
          <Text fontSize="sm" px="1">
            <Text as="span" fontWeight="bold">
              {model.runtime
                ? `${(model.runtime.mean / 1000).toFixed(2)}s`
                : '-'}
            </Text>{' '}
            <Text as="span" fontWeight="thin">
              runtime
            </Text>
          </Text>
        </HStack>
      </LinkBox>
    </Card>
  );
}
