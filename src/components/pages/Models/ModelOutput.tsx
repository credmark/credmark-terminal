import {
  Box,
  FormControl,
  FormErrorMessage,
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
import _set from 'lodash.set';
import * as _math from 'mathjs';
import React, { Fragment, useCallback, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { JSONTree } from 'react-json-tree';

import HistoricalChart, {
  ChartLine,
} from '~/components/shared/Charts/HistoricalChart';
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

interface ModelOutputProps {
  model: CModelMetadata;
  result: CRecord;
}

type UnreferenceOutput =
  | CTypeObject
  | CTypeArray
  | CTypeString
  | CTypeInteger
  | CTypeBoolean;

interface Key extends BaseCType {
  absolutePath: string;
  relativePath: string;
  basePath: string;
  mathPath: string;
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

export default function ModelOutput({ model, result }: ModelOutputProps) {
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

  const chartValueKeys = useMemo(() => {
    function computeKeys(type: CType, path = '', mathPath = ''): Key[] {
      const output = getUnreferencedOutput(type);
      switch (output.type) {
        case 'object':
          return Object.entries(output.properties ?? {})
            .map(([key, value]) =>
              computeKeys(
                value,
                `${path}${path ? '.' : ''}${key}`,
                `${path}${path ? '.' : ''}${key}`,
              ),
            )
            .flat();

        case 'array': {
          if (path.startsWith('series[0].output')) {
            const outputArray = _get(result, path);
            const arrayLength = Array.isArray(outputArray)
              ? outputArray.length
              : 0;

            const arrayItemKeys: Key[] = [];
            for (let i = 0; i < arrayLength; i++) {
              arrayItemKeys.push(
                ...computeKeys(
                  Array.isArray(output.items) ? output.items[0] : output.items,
                  path + `[${i}]`,
                  mathPath + `[${i + 1}]`,
                ),
              );
            }

            return arrayItemKeys;
          }

          return computeKeys(
            Array.isArray(output.items) ? output.items[0] : output.items,
            path + '[0]',
          );
        }

        case 'string':
        case 'integer':
        case 'number':
        case 'boolean':
        default:
          if (
            path.startsWith('series[0].output') &&
            ['integer', 'number'].includes(output.type)
          ) {
            return [
              {
                absolutePath: path,
                relativePath: path.slice(17),
                basePath: 'series[0].output',
                mathPath: mathPath.slice(17),
                type: output.type,
                title: output.title,
                description: output.description,
              },
            ];
          } else {
            return [];
          }
      }
    }

    return computeKeys(model.output);
  }, [getUnreferencedOutput, model.output, result]);

  const isTransformInputValid = useMemo(() => {
    try {
      const compiled = math.compile(transformInput);
      const scope: Record<string, math.BigNumber> = {
        val: math.bignumber(0),
      };

      for (const key of chartValueKeys) {
        _set(scope, key.relativePath, math.bignumber(0));
      }

      compiled.evaluate(scope);
      return true;
      // eslint-disable-next-line no-empty
    } catch {
      return false;
    }
  }, [chartValueKeys, transformInput]);

  const lines = useMemo<ChartLine[]>(() => {
    let evaluate: (scope: Record<string, math.BigNumber>) => math.BigNumber;
    if (transformInput.trim()) {
      try {
        const compiled = math.compile(transformInput);
        const scope: Record<string, math.BigNumber> = {};
        if (valueKey) {
          scope.val = math.bignumber(0);
        }

        for (const key of chartValueKeys) {
          _set(scope, key.relativePath, math.bignumber(0));
        }

        compiled.evaluate(scope);
        evaluate = compiled.evaluate;
        // eslint-disable-next-line no-empty
      } catch {}
    }

    function getByKey(record: CRecord, key: Key | undefined): number | string {
      return _get(record, key?.relativePath ?? 0) ?? 0;
    }

    const line: ChartLine = {
      color: '#DE1A60',
      name: model.displayName ?? model.slug,
      data: ((result as BlockSeries).series ?? []).map((s) => {
        let value = 0;
        if (evaluate) {
          const scope: Record<string, math.BigNumber> = {};

          if (valueKey) {
            scope.val = math.bignumber(getByKey(s.output, valueKey));
          }

          for (const key of chartValueKeys) {
            _set(
              scope,
              key.relativePath,
              math.bignumber(getByKey(s.output, key)),
            );
          }

          value = evaluate(scope)?.toNumber() ?? 0;
        } else {
          value = Number(getByKey(s.output, valueKey));
        }

        return {
          timestamp: new Date(s.sampleTimestamp * 1000),
          value,
        };
      }),
    };

    return [line];
  }, [
    transformInput,
    model.displayName,
    model.slug,
    result,
    valueKey,
    chartValueKeys,
  ]);

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
                textToHighlight={props.data.title ?? props.data.mathPath}
                highlightTag={({ children }) => <strong>{children}</strong>}
              />
            </Text>
            <Text
              fontSize="sm"
              color={props.isSelected ? 'whiteAlpha.800' : 'gray.600'}
            >
              <Text as="span">
                <Highlighter
                  searchWords={[searchInput]}
                  autoEscape={true}
                  textToHighlight={props.data.mathPath ?? ''}
                  highlightTag={({ children }) => <strong>{children}</strong>}
                />
              </Text>
              <Text as="span">
                <Highlighter
                  searchWords={[searchInput]}
                  autoEscape={true}
                  textToHighlight={props.data.description ?? ''}
                  highlightTag={({ children }) => <strong>{children}</strong>}
                />
              </Text>
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
          {chartValueKeys.length > 0 && <Tab>Chart</Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <JSONTree
              data={result}
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
                  (option.data.title ?? option.data.mathPath)
                    .toLocaleLowerCase()
                    .includes(filterValue.toLocaleLowerCase().trim()) ||
                  (option.data.description ?? '')
                    .toLocaleLowerCase()
                    .includes(filterValue.toLocaleLowerCase().trim())
                }
                getOptionLabel={(option) => option.title ?? option.mathPath}
                components={customComponents}
                onChange={(val) => setValueKey(val ?? undefined)}
                isOptionSelected={(option) =>
                  valueKey?.mathPath === option.mathPath
                }
                chakraStyles={chakraStyles}
                isClearable
                inputValue={searchInput}
                onInputChange={(input) => setSearchInput(input)}
              />
            </FormControl>

            <FormControl mt="4" isInvalid={!isTransformInputValid}>
              <FormLabel>Value transformer expression</FormLabel>
              <Input
                value={transformInput}
                onChange={(e) => setTransformInput(e.target.value)}
                placeholder="val * 1"
              />
              <FormErrorMessage>Invalid expression</FormErrorMessage>
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
                <br />
                Along with{' '}
                <code>
                  <strong>val</strong>
                </code>
                , scope also includes other available data points (
                {chartValueKeys.map((k, i) => (
                  <Fragment key={k.mathPath}>
                    <code>
                      <strong>{k.mathPath}</strong>
                    </code>
                    {i < chartValueKeys.length - 1 && <>, </>}
                  </Fragment>
                ))}
                )
                <br />
                Note: Index starts from 1 in transformer
              </FormHelperText>
            </FormControl>
            <Box mt="8">
              <HistoricalChart
                lines={lines}
                formatValue={(val) => shortenNumber(val, 4)}
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
