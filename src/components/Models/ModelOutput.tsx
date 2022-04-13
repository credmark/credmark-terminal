import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  chakraComponents,
  ChakraStylesConfig,
  GroupBase,
  OptionProps,
  Select,
  SelectComponentsConfig,
} from 'chakra-react-select';
import _get from 'lodash.get';
import * as _math from 'mathjs';
import React, { useCallback, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { JSONTree } from 'react-json-tree';

import {
  BaseCType,
  CType,
  CTypeArray,
  CTypeBoolean,
  CTypeInteger,
  CTypeObject,
  CTypeString,
  CModelMetadata,
  CRecord,
} from '~/types/model';
import { shortenNumber } from '~/utils/formatTokenAmount';

import HistoricalChart, { Line } from '../RiskTerminal/helpers/HistoricalChart';

interface ModelOutputProps {
  model: CModelMetadata;
  output: CRecord;
}

type UnreferenceOutput =
  | CTypeObject
  | CTypeArray
  | CTypeString
  | CTypeInteger
  | CTypeBoolean;

interface Key extends BaseCType {
  path: string;
  type: 'boolean' | 'integer' | 'number' | 'string' | 'object' | 'array';
}

interface BlockSeries {
  series: Array<{
    blockNumber: number;
    blockTimestamp: number;
    sampleTimestamp: number;
    output: CRecord;
  }>;
}

const math = _math.create(_math.all, { number: 'BigNumber', precision: 64 });

const chakraStyles: ChakraStylesConfig<Key, false, GroupBase<Key>> = {
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
      ? 'pink.500'
      : state.isFocused
      ? 'gray.50'
      : provided.bg,
  }),
};

export default function ModelOutput({ model, output }: ModelOutputProps) {
  const [valueKey, setValueKey] = useState<Key>();
  const [searchInput, setSearchInput] = useState('');
  const [transformInput, setTransformInput] = useState('');

  const getUnreferencedOutput = useCallback(
    (output: CType): UnreferenceOutput => {
      if ('$ref' in output) {
        const refKey = Object.keys(model.output.definitions ?? {}).find(
          (def) => def === output.$ref.split('/').pop(),
        );

        if (!refKey) {
          throw new Error('Invalid ref');
        }

        return (model.output.definitions ?? {})[refKey] as UnreferenceOutput;
      } else if ('allOf' in output) {
        return getUnreferencedOutput(output.allOf[0]);
      }

      return output;
    },

    [model.output.definitions],
  );

  const isBlockSeries =
    model.output.title?.startsWith('BlockSeries[') &&
    Array.isArray(output.series);

  const keys = useMemo<Key[]>(() => {
    function computeKeys(type: CType, path = ''): Key[] {
      const output = getUnreferencedOutput(type);
      switch (output.type) {
        case 'object':
          return Object.entries(output.properties ?? {})
            .map(([key, value]) =>
              computeKeys(value, `${path}${path ? '.' : ''}${key}`),
            )
            .flat();
        case 'array':
          return computeKeys(
            Array.isArray(output.items) ? output.items[0] : output.items,
            path + '[]',
          );
        case 'string':
        case 'integer':
        case 'number':
        case 'boolean':
        default:
          return [
            {
              path,
              type: output.type,
              title: output.title,
              description: output.description,
            },
          ];
      }
    }

    return computeKeys(model.output);
  }, [getUnreferencedOutput, model.output]);

  const chartValueKeys = useMemo(() => {
    return keys
      .filter(
        ({ path, type }) =>
          path.startsWith('series[].output') &&
          ['integer', 'number'].includes(type),
      )
      .map(({ path, ...key }) => ({ ...key, path: path.slice(16) }));
  }, [keys]);

  const lines = useMemo<Line[]>(() => {
    let evaluate: (scope: { val: number }) => _math.BigNumber;
    if (transformInput.trim()) {
      try {
        const compiled = math.compile(
          transformInput.replaceAll('val', 'bignumber(val)'),
        );

        compiled.evaluate({ val: 0 });

        evaluate = compiled.evaluate;
        // eslint-disable-next-line no-empty
      } catch {}
    }

    const line: Line = {
      color: '#DE1A60',
      name: model.displayName ?? model.slug,
      data: ((output as BlockSeries).series ?? []).map((s) => {
        let value = 0;
        if (evaluate) {
          value =
            evaluate({
              val: _get(s.output, valueKey?.path ?? 0) ?? 0,
            })?.toNumber() ?? 0;
        } else {
          value = _get(s.output, valueKey?.path ?? 0) ?? 0;
        }

        return {
          timestamp: new Date(s.sampleTimestamp * 1000),
          value,
        };
      }),
    };

    return [line];
  }, [transformInput, model.displayName, model.slug, output, valueKey?.path]);

  const customComponents = useMemo<
    SelectComponentsConfig<Key, false, GroupBase<Key>>
  >(() => {
    return {
      Option: (props: OptionProps<Key, false, GroupBase<Key>>) => (
        <chakraComponents.Option {...props}>
          <Box>
            <Text fontSize="lg">
              <Highlighter
                searchWords={[searchInput]}
                autoEscape={true}
                textToHighlight={props.data.title ?? props.data.path}
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
    <VStack align="stretch">
      <Heading size="md">Model Run Result</Heading>
      <Tabs>
        <TabList>
          <Tab>JSON</Tab>
          {isBlockSeries && <Tab>Chart</Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <JSONTree
              data={output}
              theme={{ tree: { borderRadius: '4px', padding: '16px 8px' } }}
              hideRoot
            />
          </TabPanel>
          <TabPanel>
            <FormControl>
              <FormLabel>Select y-axis key of series output</FormLabel>
              <Select<Key, false, GroupBase<Key>>
                placeholder="Select value path"
                options={chartValueKeys}
                filterOption={(option, filterValue) =>
                  (option.data.title ?? option.data.path)
                    .toLocaleLowerCase()
                    .includes(filterValue.toLocaleLowerCase().trim()) ||
                  (option.data.description ?? '')
                    .toLocaleLowerCase()
                    .includes(filterValue.toLocaleLowerCase().trim())
                }
                getOptionLabel={(option) => option.title ?? option.path}
                components={customComponents}
                onChange={(val) => setValueKey(val ?? undefined)}
                isOptionSelected={(option) => valueKey?.path === option.path}
                chakraStyles={chakraStyles}
                isClearable
                inputValue={searchInput}
                onInputChange={(input) => setSearchInput(input)}
              />
            </FormControl>

            <FormControl mt="4">
              <FormLabel>Value transformer expression</FormLabel>
              <Input
                value={transformInput}
                onChange={(e) => setTransformInput(e.target.value)}
                placeholder="val * 1"
              />
              <FormHelperText>
                Use{' '}
                <code>
                  <strong>val</strong>
                </code>{' '}
                to reference y-axis data points. Refer syntax at{' '}
                <Link
                  href="https://mathjs.org/docs/expressions/syntax.html"
                  isExternal
                >
                  https://mathjs.org/docs/expressions/syntax.html
                </Link>
              </FormHelperText>
            </FormControl>
            <Box mt="8">
              <HistoricalChart
                lines={lines}
                formatValue={(val) => shortenNumber(val, 1)}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
