import { Container, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { ModelRunner } from '~/components/pages/Models';
import SearchSelect from '~/components/shared/Form/SearchSelect';
import SEOHeader from '~/components/shared/SEOHeader';
import { ModelMetadata } from '~/types/model';

interface ModelPageProps {
  models: ModelMetadata[];
}

export default function ModelsPage({ models }: ModelPageProps) {
  const router = useRouter();
  const slug = router.query.slug;
  const setSlug = (newSlug: string | undefined) => {
    if (newSlug)
      router.push(`/models?slug=${newSlug}`, undefined, { shallow: true });
    else router.push('/models', undefined, { shallow: true });
  };

  const model = useMemo(() => {
    return models.find((model) => model.slug === slug);
  }, [models, slug]);

  return (
    <>
      <SEOHeader title="Model Usage" />
      <Container maxW="container.lg" p="8">
        <Heading mb="8" color="purple.500">
          Credmark Models
        </Heading>
        <SearchSelect<ModelMetadata>
          placeholder="Select a model..."
          options={models}
          filterOption={(option, filterValue) =>
            (option.data.displayName ?? option.data.slug)
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim()) ||
            (option.data.description ?? '')
              .toLocaleLowerCase()
              .includes(filterValue.toLocaleLowerCase().trim())
          }
          getOptionLabel={(option) => option.displayName}
          getOptionDescription={(option) => option.description}
          onChange={(val) => setSlug(val?.slug ?? '')}
          isOptionSelected={(option) => slug === option.slug}
          defaultValue={model}
        />
        {model && <ModelRunner model={model} key={model.slug} />}
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
