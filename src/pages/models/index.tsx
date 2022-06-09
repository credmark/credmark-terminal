import {
  Box,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Tag,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import Fuse from 'fuse.js';
import { GetServerSideProps } from 'next';
import React, { useRef, useState } from 'react';

import SEOHeader from '~/components/shared/SEOHeader';
import useDebounce from '~/hooks/useDebounce';
import { useDeepCompareMemo } from '~/hooks/useDeepCompare';
import { ModelMetadata } from '~/types/model';

interface ModelPageProps {
  models: ModelMetadata[];
}

export default function ModelsPage({ models }: ModelPageProps) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 100);

  const fuseRef = useRef(
    new Fuse(models, {
      keys: ['slug', 'displayName', 'description', 'developer'],
      isCaseSensitive: true,
      minMatchCharLength: 2,
      threshold: 0.4,
    }),
  );

  const searchedModels = useDeepCompareMemo(() => {
    if (!debouncedInput) return models;
    return fuseRef.current.search(debouncedInput).map((r) => r.item);
  }, [debouncedInput, models]);

  return (
    <>
      <SEOHeader title="Models" />
      <Container maxW="container.lg" p="8">
        <Heading mb="8" color="purple.500">
          Credmark Models
        </Heading>
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          shadow="xl"
          placeholder="Search..."
        />
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt="8">
          {searchedModels.map((model) => (
            <Box key={model.slug} p="4">
              <Tag>{model.slug}</Tag>
              <Heading as="h3" fontSize="xl" mt="1">
                {model.displayName}
              </Heading>
              <Text mt="2">{model.description}</Text>
              {model.developer && (
                <Text fontSize="sm" color="gray.600">
                  {' '}
                  - {model.developer}
                </Text>
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  ModelPageProps
> = async () => {
  try {
    const resp = await axios({
      method: 'GET',
      url: 'https://gateway.credmark.com/v1/models',
    });

    return {
      props: {
        models: resp.data,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
