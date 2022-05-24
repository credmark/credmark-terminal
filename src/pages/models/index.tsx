import { Box, Container, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import {
  chakraComponents,
  ChakraStylesConfig,
  GroupBase,
  OptionProps,
  Select,
  SelectComponentsConfig,
} from 'chakra-react-select';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { ModelRunner } from '~/components/pages/Models';
import { CModelMetadata } from '~/types/model';

interface ModelPageProps {
  models: CModelMetadata[];
}

const chakraStyles: ChakraStylesConfig<
  CModelMetadata,
  false,
  GroupBase<CModelMetadata>
> = {
  dropdownIndicator: (provided) => ({
    ...provided,
    background: 'transparent',
    p: 0,
    w: '40px',
    borderLeftWidth: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    bg: state.isSelected
      ? 'green.500'
      : state.isFocused
      ? 'gray.50'
      : provided.bg,
  }),
};

export default function ModelsPage({ models }: ModelPageProps) {
  const router = useRouter();
  const slug = router.query.slug;
  const setSlug = (newSlug: string | undefined) => {
    if (newSlug)
      router.push(`/models?slug=${newSlug}`, undefined, { shallow: true });
    else router.push('/models', undefined, { shallow: true });
  };

  const [searchInput, setSearchInput] = useState('');

  const model = useMemo(() => {
    return models.find((model) => model.slug === slug);
  }, [models, slug]);

  const customComponents = useMemo<
    SelectComponentsConfig<CModelMetadata, false, GroupBase<CModelMetadata>>
  >(() => {
    return {
      Option: (
        props: OptionProps<CModelMetadata, false, GroupBase<CModelMetadata>>,
      ) => (
        <chakraComponents.Option {...props}>
          <Box>
            <Text fontSize="lg">
              <Highlighter
                searchWords={[searchInput]}
                autoEscape={true}
                textToHighlight={props.data.displayName}
                highlightTag={({ children }) => <strong>{children}</strong>}
              />
            </Text>
            <Text
              fontSize="sm"
              color={props.isSelected ? 'whiteAlpha.800' : 'gray.600'}
            >
              <Highlighter
                searchWords={[searchInput]}
                autoEscape={true}
                textToHighlight={props.data.description ?? ''}
                highlightTag={({ children }) => <strong>{children}</strong>}
              />
            </Text>
          </Box>
        </chakraComponents.Option>
      ),
    };
  }, [searchInput]);

  return (
    <Container maxW="container.lg" p="8">
      <Heading mb="8" color="purple.500">
        Credmark Models
      </Heading>
      <Select<CModelMetadata, false, GroupBase<CModelMetadata>>
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
        components={customComponents}
        onChange={(val) => setSlug(val?.slug ?? '')}
        isOptionSelected={(option) => slug === option.slug}
        chakraStyles={chakraStyles}
        isClearable
        inputValue={searchInput}
        defaultValue={model}
        onInputChange={(input) => setSearchInput(input)}
      />
      {model && <ModelRunner model={model} key={model.slug} />}
    </Container>
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
