import { Box, Text } from '@chakra-ui/react';
import {
  chakraComponents,
  ChakraStylesConfig,
  GroupBase,
  OptionProps,
  Select,
  SelectComponentsConfig,
} from 'chakra-react-select';
import React, { useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';

interface SearchSelectProps<T> {
  placeholder: string;
  options: T[];
  filterOption: (
    option: { label: string; value: string; data: T },
    filterValue: string,
  ) => boolean;
  getOptionLabel: (option: T) => string;
  getOptionDescription?: (option: T) => string | undefined;
  defaultValue?: T | null;
  value?: T | null;
  onChange: (value: T | null) => void;
  isOptionSelected: (option: T) => boolean;
}

export default function SearchSelect<T>({
  placeholder,
  options,
  filterOption,
  getOptionLabel,
  getOptionDescription,
  defaultValue,
  value,
  onChange,
  isOptionSelected,
}: SearchSelectProps<T>) {
  const [searchInput, setSearchInput] = useState('');

  const chakraStyles = useMemo<ChakraStylesConfig<T, false, GroupBase<T>>>(
    () => ({
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
    }),
    [],
  );

  const customComponents = useMemo<
    SelectComponentsConfig<T, false, GroupBase<T>>
  >(
    () => ({
      Option: (props: OptionProps<T, false, GroupBase<T>>) => {
        const label = getOptionLabel(props.data);
        const description = getOptionDescription?.(props.data);
        return (
          <chakraComponents.Option {...props}>
            <Box>
              <Text fontSize="lg">
                <Highlighter
                  searchWords={[searchInput]}
                  autoEscape={true}
                  textToHighlight={label}
                  highlightTag={({ children }) => <strong>{children}</strong>}
                />
              </Text>
              {description && (
                <Text
                  fontSize="sm"
                  color={props.isSelected ? 'whiteAlpha.800' : 'gray.600'}
                >
                  <Highlighter
                    searchWords={[searchInput]}
                    autoEscape={true}
                    textToHighlight={description}
                    highlightTag={({ children }) => <strong>{children}</strong>}
                  />
                </Text>
              )}
            </Box>
          </chakraComponents.Option>
        );
      },
    }),
    [getOptionDescription, getOptionLabel, searchInput],
  );

  return (
    <Select<T, false, GroupBase<T>>
      placeholder={placeholder}
      options={options}
      filterOption={filterOption}
      getOptionLabel={getOptionLabel}
      components={customComponents}
      value={value}
      onChange={onChange}
      isOptionSelected={isOptionSelected}
      chakraStyles={chakraStyles}
      isClearable
      inputValue={searchInput}
      onInputChange={(input) => setSearchInput(input)}
      defaultValue={defaultValue}
    />
  );
}
