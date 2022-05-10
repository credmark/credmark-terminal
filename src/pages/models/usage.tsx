import { Box, Container, Heading, HStack, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import {
  chakraComponents,
  ChakraStylesConfig,
  GroupBase,
  OptionProps,
  Select,
  SelectComponentsConfig,
} from 'chakra-react-select';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';

import BarChart from '~/components/Charts/BarChart';
import HistoricalChart, {
  Line,
} from '~/components/RiskTerminal/helpers/HistoricalChart';

interface ModelUsage {
  ts: string;
  type: string;
  slug: string;
  version: string;
  count: string;
}

const chakraStyles: ChakraStylesConfig<Line, false, GroupBase<Line>> = {
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

export default function ModelUsagePage() {
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [barChartDateRange, setBarChartDateRange] = useState<[Date, Date]>();

  const [barChartDate, setBarChartDate] = useState<Date>();

  const [minBarChartDate, maxBarChartDate] = barChartDateRange ?? [];

  const loadUsage = useCallback(async () => {
    const resp = await axios({
      method: 'GET',
      url: 'https://gateway.credmark.com/v1/usage/requests',
    });

    return resp.data as ModelUsage[];
  }, []);

  useEffect(() => {
    setLoading(true);
    loadUsage()
      .then((list) => {
        const slugLineMap: Record<string, Line> = {};

        let minDate: Date | undefined;
        let maxDate: Date | undefined;
        for (const usage of list) {
          if (!(usage.slug in slugLineMap)) {
            slugLineMap[usage.slug] = {
              name: usage.slug,
              color: '#DE1A60',
              data: [],
            };
          }

          const timestamp = new Date(usage.ts);
          slugLineMap[usage.slug].data.push({
            timestamp,
            value: Number(usage.count),
          });

          if (!maxDate || timestamp > maxDate) maxDate = timestamp;
          if (!minDate || timestamp < minDate) minDate = timestamp;
        }

        if (minDate && maxDate) {
          setBarChartDateRange([minDate, maxDate]);
          setBarChartDate(maxDate);
        }

        setLines(Object.values(slugLineMap));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadUsage]);

  const barChartData = useMemo(() => {
    const data: Array<{ category: string; value: number }> = [];
    for (const line of lines) {
      data.push({
        category: line.name,
        value:
          line.data.find(
            (datum) => datum.timestamp.valueOf() === barChartDate?.valueOf(),
          )?.value ?? 0,
      });
    }

    return data;
  }, [barChartDate, lines]);

  const [searchInput, setSearchInput] = useState('');
  const [slug, setSlug] = useState('');

  const customComponents = useMemo<
    SelectComponentsConfig<Line, false, GroupBase<Line>>
  >(() => {
    return {
      Option: (props: OptionProps<Line, false, GroupBase<Line>>) => (
        <chakraComponents.Option {...props}>
          <Box>
            <Text fontSize="lg">
              <Highlighter
                searchWords={[searchInput]}
                autoEscape={true}
                textToHighlight={props.data.name}
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
        Credmark Models Usage
      </Heading>

      <HStack align="start" spacing="8">
        <Box flex="1">
          <Input
            type="date"
            value={barChartDate?.toISOString().slice(0, 10)}
            onChange={(event) => {
              if (event.target.value) {
                setBarChartDate(
                  new Date(`${event.target.value}T00:00:00.000Z`),
                );
              } else {
                setBarChartDate(undefined);
              }
            }}
            mb="8"
            min={minBarChartDate?.toISOString()?.slice(0, 10)}
            max={maxBarChartDate?.toISOString()?.slice(0, 10)}
          />

          <BarChart
            loading={loading}
            data={barChartData}
            height={Math.max(barChartData.length * 32, 300)}
            padding={0}
            onClick={(slug) => setSlug(slug)}
          />
        </Box>
        <Box flex="1" position="sticky" top="8" left="0" right="0">
          <Select<Line, false, GroupBase<Line>>
            placeholder="Select a model..."
            options={lines}
            filterOption={(option, filterValue) =>
              option.data.name
                .toLocaleLowerCase()
                .includes(filterValue.toLocaleLowerCase().trim())
            }
            getOptionLabel={(option) => option.name}
            components={customComponents}
            value={lines.find((line) => line.name === slug)}
            onChange={(val) => setSlug(val?.name ?? '')}
            isOptionSelected={(option) => slug === option.name}
            chakraStyles={chakraStyles}
            isClearable
            inputValue={searchInput}
            onInputChange={(input) => setSearchInput(input)}
          />
          <Box h="8"></Box>
          <HistoricalChart
            loading={loading}
            lines={lines.filter((line) => line.name === slug)}
            isAreaChart
            height={540}
          />
        </Box>
      </HStack>
    </Container>
  );
}
