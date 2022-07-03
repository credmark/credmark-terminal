import {
  Button,
  ButtonProps,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Switch,
} from '@chakra-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import Fuse from 'fuse.js';
import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import React, { useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';

import { ModelCard } from '~/components/pages/Models';
import SEOHeader from '~/components/shared/SEOHeader';
import useDebounce from '~/hooks/useDebounce';
import { useDeepCompareMemo } from '~/hooks/useDeepCompare';
import {
  ModelInfo,
  ModelMetadata,
  ModelRuntime,
  ModelUsage,
  TopModels,
} from '~/types/model';

type SortKey =
  | 'relevance'
  | 'slowest'
  | 'fastest'
  | 'topModel'
  | 'monthlyUsage';

const sorters: Record<SortKey, string> = {
  relevance: 'Relevance',
  fastest: 'Fastest runtime',
  slowest: 'Slowest runtime',
  topModel: 'All time usage',
  monthlyUsage: 'Requests in 30d',
};

interface SortMenuProps extends ButtonProps {
  sortBy: SortKey;
  onSort: (value: SortKey) => void;
}

function SortMenu({
  sortBy,
  onSort,
  ...buttonProps
}: SortMenuProps): JSX.Element {
  return (
    <Menu>
      <MenuButton
        w="102px"
        as={Button}
        size="sm"
        colorScheme="gray"
        bg="gray.100"
        _hover={{
          bg: 'gray.200',
        }}
        _active={{
          bg: 'gray.300',
        }}
        rightIcon={<Icon as={ExpandMoreIcon} />}
        {...buttonProps}
      >
        Sort
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={sortBy}
          type="radio"
          onChange={(value) => {
            onSort((Array.isArray(value) ? value[0] : value) as SortKey);
          }}
        >
          {Object.entries(sorters).map(([value, label]) => (
            <MenuItemOption
              key={value}
              value={value}
              fontWeight={sortBy === value ? 'bold' : undefined}
            >
              {label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

interface CategoryFilterMenuProps extends ButtonProps {
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  setSelectedSubCategories: (subcategories: string[]) => void;
}
interface SubCategoryFilterMenuProps extends ButtonProps {
  subcategories: string[];
  selectedSubCategories: string[];
  setSelectedSubCategories: (categories: string[]) => void;
}

function CategoryFilterMenu({
  categories,
  selectedCategories,
  setSelectedCategories,
  setSelectedSubCategories,
  ...buttonProps
}: CategoryFilterMenuProps): JSX.Element {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        w="150px"
        as={Button}
        size="sm"
        colorScheme="gray"
        bg="gray.100"
        _hover={{
          bg: 'gray.200',
        }}
        _active={{
          bg: 'gray.300',
        }}
        rightIcon={<Icon as={ExpandMoreIcon} />}
        {...buttonProps}
      >
        Category
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={selectedCategories}
          type="checkbox"
          onChange={(value) => {
            setSelectedCategories(Array.isArray(value) ? value : [value]);
            setSelectedSubCategories([]);
          }}
        >
          {categories.map((category) => (
            <MenuItemOption
              key={category}
              value={category}
              fontWeight={
                selectedCategories.includes(category) ? 'bold' : undefined
              }
            >
              {category}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

function SubCategoryFilterMenu({
  subcategories,
  selectedSubCategories,
  setSelectedSubCategories,
  ...buttonProps
}: SubCategoryFilterMenuProps): JSX.Element {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        w="190px"
        as={Button}
        size="sm"
        colorScheme="gray"
        bg="gray.100"
        _hover={{
          bg: 'gray.200',
        }}
        _active={{
          bg: 'gray.300',
        }}
        rightIcon={<Icon as={ExpandMoreIcon} />}
        {...buttonProps}
      >
        Sub Category
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          value={selectedSubCategories}
          type="checkbox"
          onChange={(value) => {
            setSelectedSubCategories(Array.isArray(value) ? value : [value]);
          }}
        >
          {subcategories.map((subcategory) => (
            <MenuItemOption
              key={subcategory}
              value={subcategory}
              fontWeight={
                selectedSubCategories.includes(subcategory) ? 'bold' : undefined
              }
            >
              {subcategory}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

interface ModelPageProps {
  models: ModelInfo[];
}

export default function ModelsPage({ models }: ModelPageProps) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 100);
  const [topModels, setTopModels] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('relevance');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );

  const allCategories = useMemo(
    () =>
      Array.from(
        models.reduce(
          (cats, model) => cats.add(model.category),
          new Set<string>(),
        ),
      ),
    [models],
  );
  const allSubCategories = useMemo(() => {
    const filteredCategories = models.filter(
      (i) => selectedCategories.indexOf(i.category) !== -1,
      selectedCategories,
    );

    const reducedSubCategories = Array.isArray(filteredCategories)
      ? filteredCategories.reduce(
          (cats, model) => cats.add(model.subcategory),
          new Set<string>(),
        )
      : '';

    return Array.from(reducedSubCategories).filter((n) => n);
  }, [models, selectedCategories]);

  const fuse = useMemo(
    () =>
      new Fuse(models, {
        keys: ['slug', 'displayName', 'description', 'developer'],
        isCaseSensitive: false,
        minMatchCharLength: 3,
        threshold: 0.33,
        includeMatches: true,
      }),
    [models],
  );

  const searchedModels = useDeepCompareMemo(() => {
    let _models = !debouncedInput
      ? models
      : fuse.search(debouncedInput).map<ModelInfo>((r) => ({
          ...r.item,
          hSlug: (
            <Highlighter
              textToHighlight={r.item.slug}
              searchWords={[debouncedInput]}
              highlightStyle={{ backgroundColor: '#AFFFE7' }}
              highlightTag="span"
              findChunks={() =>
                r.matches
                  ?.find((match, index) => match.key === 'slug' && index === 0)
                  ?.indices?.map(([start, end]) => ({ start, end: end + 1 })) ??
                []
              }
            />
          ),
          hDescription: (
            <Highlighter
              textToHighlight={r.item.description ?? ''}
              searchWords={[debouncedInput]}
              highlightStyle={{ backgroundColor: '#AFFFE7' }}
              highlightTag="span"
              findChunks={() =>
                r.matches
                  ?.find(
                    (match, index) =>
                      match.key === 'description' && index === 0,
                  )
                  ?.indices?.map(([start, end]) => ({ start, end: end + 1 })) ??
                []
              }
            />
          ),
          hDisplayName: (
            <Highlighter
              textToHighlight={r.item.displayName ?? ''}
              searchWords={[debouncedInput]}
              highlightStyle={{ backgroundColor: '#AFFFE7' }}
              highlightTag="span"
              findChunks={() =>
                r.matches
                  ?.find(
                    (match, index) =>
                      match.key === 'displayName' && index === 0,
                  )
                  ?.indices?.map(([start, end]) => ({ start, end: end + 1 })) ??
                []
              }
            />
          ),
          hDeveloper: (
            <Highlighter
              textToHighlight={r.item.developer ?? ''}
              searchWords={[debouncedInput]}
              highlightStyle={{ backgroundColor: '#AFFFE7' }}
              highlightTag="span"
              findChunks={() =>
                r.matches
                  ?.find(
                    (match, index) => match.key === 'developer' && index === 0,
                  )
                  ?.indices?.map(([start, end]) => ({ start, end: end + 1 })) ??
                []
              }
            />
          ),
        }));

    if (topModels) {
      _models = _models.filter((m) => !!m.allTimeUsageRank);
    }

    if (selectedCategories.length > 0) {
      _models = _models.filter((m) => selectedCategories.includes(m.category));
    }
    if (selectedCategories.length > 0 && selectedSubCategories.length > 0) {
      _models = _models.filter(
        (m) =>
          selectedCategories.includes(m.category) &&
          selectedSubCategories.includes(m.subcategory),
      );
    }

    switch (sortKey) {
      case 'fastest':
        _models = [..._models].sort(
          (a, b) =>
            (a.runtime?.mean ?? Infinity) - (b.runtime?.mean ?? Infinity),
        );
        break;
      case 'slowest':
        _models = [..._models].sort(
          (a, b) =>
            (b.runtime?.mean ?? -Infinity) - (a.runtime?.mean ?? -Infinity),
        );
        break;
      case 'topModel':
        _models = [..._models].sort(
          (a, b) =>
            (a.allTimeUsageRank > 0 ? a.allTimeUsageRank : Infinity) -
            (b.allTimeUsageRank > 0 ? b.allTimeUsageRank : Infinity),
        );
        break;
      case 'monthlyUsage':
        _models = [..._models].sort(
          (a, b) => (b.monthlyUsage ?? 0) - (a.monthlyUsage - 0),
        );
        break;
      case 'relevance':
      default:
        break;
    }

    return _models;
  }, [
    debouncedInput,
    fuse,
    models,
    selectedCategories,
    selectedSubCategories,
    sortKey,
    topModels,
  ]);
  return (
    <>
      <SEOHeader title="Model Overview" />
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
        <HStack mt="4" px="2">
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="top-models" mb="0">
              Top Models
            </FormLabel>
            <Switch
              id="top-models"
              isChecked={topModels}
              onChange={(event) => setTopModels(event.target.checked)}
            />
          </FormControl>
          <CategoryFilterMenu
            categories={allCategories}
            selectedCategories={selectedCategories}
            setSelectedSubCategories={setSelectedSubCategories}
            setSelectedCategories={setSelectedCategories}
          />
          {selectedCategories?.length > 0 && (
            <SubCategoryFilterMenu
              subcategories={allSubCategories}
              selectedSubCategories={selectedSubCategories}
              setSelectedSubCategories={setSelectedSubCategories}
            />
          )}
          <SortMenu sortBy={sortKey} onSort={setSortKey} />
        </HStack>
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt="8">
          {searchedModels.map((model) => (
            <ModelCard model={model} key={model.slug} />
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
    const [models, usageRequests, runtimeStats, topModels] = await Promise.all([
      axios({
        method: 'GET',
        url: 'https://gateway.credmark.com/v1/models',
      }).then((resp) => resp.data as ModelMetadata[]),
      axios({
        method: 'GET',
        url: 'https://gateway.credmark.com/v1/usage/requests',
      }).then((resp) => resp.data as ModelUsage[]),
      axios({
        method: 'GET',
        url: 'https://gateway.credmark.com/v1/model/runtime-stats',
      }).then((resp) => resp.data.runtimes as ModelRuntime[]),
      axios({
        method: 'GET',
        url: 'https://gateway.credmark.com/v1/usage/top',
      }).then((resp) => resp.data as TopModels[]),
    ]);

    const usageEndTime = DateTime.utc().startOf('day');
    const usageStartTime = usageEndTime.minus({ days: 30 });

    return {
      props: {
        models: models.map((model) => ({
          slug: model.slug,
          displayName: model.displayName,
          category: model.category,
          description: model.description,
          developer: model.developer,
          subcategory: model.subcategory,
          monthlyUsage: usageRequests
            .filter(
              (r) =>
                r.slug === model.slug &&
                new Date(r.ts) > usageStartTime.toJSDate() &&
                new Date(r.ts) <= usageEndTime.toJSDate(),
            )
            .reduce((prev, curr) => prev + Number(curr.count), 0),
          runtime: runtimeStats.find((rs) => rs.slug === model.slug) ?? null,
          allTimeUsageRank:
            topModels.findIndex((tm) => tm.slug === model.slug) + 1,
        })),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
