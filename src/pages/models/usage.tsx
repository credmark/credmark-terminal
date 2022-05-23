import {
  Box,
  Container,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

import { Card } from '~/components/base';
import BarChart from '~/components/shared/Charts/BarChart';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import SearchSelect from '~/components/shared/Form/SearchSelect';
import { ChartLine } from '~/types/chart';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface ModelUsage {
  ts: string;
  type: string;
  slug: string;
  version: string;
  count: string;
}

export default function ModelUsagePage() {
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState<ChartLine[]>([]);
  const [barChartDateRange, setBarChartDateRange] = useState<[Date, Date]>();

  const [barChartDate, setBarChartDate] = useState<Date>();

  const [minBarChartDate, maxBarChartDate] = barChartDateRange ?? [];

  const color = '#3B0065';
  const ALL_MODELS = 'All Models';

  useEffect(() => {
    setLoading(true);

    const abortController = new AbortController();
    axios({
      method: 'GET',
      signal: abortController.signal,
      url: 'https://gateway.credmark.com/v1/usage/requests',
    })
      .then((resp) => {
        const list = resp.data as ModelUsage[];
        const slugLineMap: Record<string, ChartLine> = {};
        const allModelsDataMap: Record<number, ChartLine['data'][0]> = {};

        let minDate: Date | undefined;
        let maxDate: Date | undefined;

        for (const usage of list) {
          if (!(usage.slug in slugLineMap)) {
            slugLineMap[usage.slug] = {
              name: usage.slug,
              color,
              data: [],
            };
          }

          const timestamp = new Date(usage.ts);
          const value = Number(usage.count);
          slugLineMap[usage.slug].data.push({
            timestamp,
            value,
          });

          if (!(timestamp.valueOf() in allModelsDataMap)) {
            allModelsDataMap[timestamp.valueOf()] = { timestamp, value: 0 };
          }

          allModelsDataMap[timestamp.valueOf()].value += value;

          if (!maxDate || timestamp > maxDate) maxDate = timestamp;
          if (!minDate || timestamp < minDate) minDate = timestamp;
        }

        if (minDate && maxDate) {
          setBarChartDateRange([minDate, maxDate]);
          setBarChartDate(maxDate);
        }

        setLines([
          {
            name: ALL_MODELS,
            color,
            data: Object.values(allModelsDataMap),
          },
          ...Object.values(slugLineMap),
        ]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, []);

  const barChartData = useMemo(() => {
    const data: Array<{ category: string; value: number }> = [];
    for (const line of lines) {
      if (line.name === ALL_MODELS) {
        continue;
      }

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

  const allModelsUsage = useMemo(() => {
    for (const line of lines) {
      if (line.name === ALL_MODELS) {
        return (
          line.data.find(
            (datum) => datum.timestamp.valueOf() === barChartDate?.valueOf(),
          )?.value ?? 0
        );
      }
    }

    return 0;
  }, [barChartDate, lines]);

  const [slug, setSlug] = useState(ALL_MODELS);

  return (
    <Container maxW="container.lg" p="8">
      <Card>
        <Heading as="h2" fontSize="3xl" mb="8">
          Historical API Calls
        </Heading>
        <Box maxW="480px">
          <SearchSelect<ChartLine>
            placeholder={loading ? 'Loading Models...' : 'Select a Model...'}
            options={lines}
            filterOption={(option, filterValue) =>
              option.data.name
                .toLocaleLowerCase()
                .includes(filterValue.toLocaleLowerCase().trim())
            }
            getOptionLabel={(option) => option.name}
            value={lines.find((line) => line.name === slug)}
            onChange={(val) => setSlug(val?.name ?? '')}
            isOptionSelected={(option) => slug === option.name}
          />
        </Box>
        <HistoricalChart
          loading={loading}
          lines={lines.filter((line) => line.name === slug)}
          height={300}
          formatYLabel={(value) => shortenNumber(Number(value), 0)}
          formatValue={(value) => new Intl.NumberFormat().format(value)}
          durations={[30, 60, 90]}
          defaultDuration={90}
          aggregate
        />
      </Card>

      <Card mt="8">
        <Heading as="h2" fontSize="3xl" mb="8">
          Individual Model API Calls
        </Heading>
        <Stack direction={{ base: 'column', lg: 'row' }} mb="4">
          <Box minW="240px" maxW="480px">
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
          </Box>
          <Spacer />
          <Box>
            <Text>All Models</Text>
            <Text fontSize="3xl">
              {new Intl.NumberFormat().format(allModelsUsage)}
            </Text>
          </Box>
        </Stack>

        <BarChart
          loading={loading}
          data={barChartData}
          height={Math.max(barChartData.length * 32, 300)}
          padding={0}
          onClick={(slug) => setSlug(slug)}
        />
      </Card>
    </Container>
  );
}
