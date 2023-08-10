import { Box, Container, HStack, Spinner, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { ModelRunner } from '~/components/pages/Models';
import SearchSelect from '~/components/shared/Form/SearchSelect';
import SEOHeader from '~/components/shared/SEOHeader';
import env from '~/env';
import { ModelMetadata } from '~/types/model';

export default function ModelRunnerPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [models, setModels] = useState<ModelMetadata[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    setError('');
    setLoading(true);
    axios({
      method: 'GET',
      baseURL: env.apiHost,
      url: 'models',
      signal: abortController.signal,
    })
      .then((resp) => {
        setModels(resp.data);
      })
      .catch(() => {
        if (!abortController.signal.aborted) {
          setError('Unable to load models. Please try again later.');
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  const router = useRouter();
  const slug = router.query.slug;
  const setSlug = (newSlug: string | undefined) => {
    if (newSlug)
      router.push(`${router.pathname}?slug=${newSlug}`, undefined, {
        shallow: true,
      });
    else router.push(router.pathname, undefined, { shallow: true });
  };

  const model = useMemo(() => {
    return models.find((model) => model.slug === slug);
  }, [models, slug]);

  return (
    <>
      <SEOHeader title="Model Runner" />
      <Container maxW="container.lg" p="8">
        <SearchSelect<ModelMetadata>
          placeholder="Select a model..."
          options={models}
          filterOption={(option, filterValue) =>
            (option.data.displayName ?? '')
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim()) ||
            option.data.slug
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim()) ||
            (option.data.description ?? '')
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim())
          }
          getOptionLabel={(option) => option.displayName}
          getOptionDescription={(option) =>
            [`[${option.slug}]`, option.description]
              .filter((val) => !!val)
              .join(' ')
          }
          onChange={(val) => setSlug(val?.slug ?? '')}
          isOptionSelected={(option) => slug === option.slug}
          defaultValue={model}
          noOptionsMessage={
            loading
              ? () => (
                  <HStack justify="center">
                    <Spinner color="green.500" />
                    <Text>Loading models...</Text>
                  </HStack>
                )
              : undefined
          }
        />
        {model && <ModelRunner model={model} key={model.slug} />}
        {error && (
          <Box
            bg="red.50"
            borderWidth="1px"
            borderColor="red.500"
            rounded="base"
            p="8"
            color="red.500"
            textAlign="center"
          >
            {error}
          </Box>
        )}
      </Container>
    </>
  );
}
