import {
  Box,
  Button,
  Container,
  Heading,
  Center,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';

import { Card } from '~/components/base';
import BarChart from '~/components/shared/Charts/BarChart';
import HistoricalChart from '~/components/shared/Charts/HistoricalChart';
import SearchSelect from '~/components/shared/Form/SearchSelect';
import SEOHeader from '~/components/shared/SEOHeader';
import { Aggregator, BarChartData, ChartLine } from '~/types/chart';
import { aggregateData } from '~/utils/chart';
import { shortenNumber } from '~/utils/formatTokenAmount';

interface ModelUsage {
  ts: string;
  type: string;
  slug: string;
  version: string;
  count: string;
}

type Stat = 'min' | 'max' | 'mean' | 'median';
interface Runtime extends Record<Stat, number> {
  slug: string;
  version: string;
}

export default function ModelUsagePage() {
  const [loading, setLoading] = useState(false);
  const [showLessCalls, setShowLessCalls] = useState(true);
  const [showLessRuntime, setShowLessRuntime] = useState(true);
  const [lines, setLines] = useState<ChartLine[]>([]);

  const [barChartDate, setBarChartDate] = useState<Date>();
  const [barChartDateRange, setBarChartDateRange] = useState<[Date, Date]>();
  const [minBarChartDate, maxBarChartDate] = barChartDateRange ?? [];
  const [aggregationInterval, setAggregationInterval] = useState(1); // In Days
  const [aggregator, setAggregator] = useState<Aggregator>('sum');

  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [stat, setStat] = useState<Stat>('mean');

  const color = '#3B0065';
  const ALL_MODELS = 'All Models';

  useEffect(() => {
    setLoading(true);

    const abortController = new AbortController();
    Promise.all([
      axios({
        method: 'GET',
        signal: abortController.signal,
        url: 'https://gateway.credmark.com/v1/usage/requests',
      }).then((resp) => {
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
      }),

      axios({
        method: 'GET',
        signal: abortController.signal,
        url: 'https://gateway.credmark.com/v1/model/runtime-stats',
      }).then((resp) => {
        setRuntimes(resp.data.runtimes);
      }),
    ]).finally(() => {
      setLoading(false);
    });

    return () => {
      abortController.abort();
    };
  }, []);

  const barChartDataMemoized = useMemo(() => {
    const data: BarChartData = [];
    for (const line of lines) {
      if (line.name === ALL_MODELS) {
        continue;
      }

      let value = 0;
      if (barChartDate) {
        const maxTs = barChartDate.valueOf();
        const aggregatedData = aggregateData(
          line.data,
          maxTs,
          aggregationInterval,
          aggregator,
        );

        value =
          aggregatedData.find((datum) => datum.timestamp.valueOf() === maxTs)
            ?.value ?? 0;
      }

      data.push({
        category: line.name,
        value,
      });
    }

    return data;
  }, [aggregationInterval, aggregator, barChartDate, lines]);

  const barChartData = showLessCalls
    ? barChartDataMemoized.sort((a, b) => b.value - a.value).slice(0, 10)
    : barChartDataMemoized;

  const runtimeBarChartDataMemoized = useMemo<BarChartData>(() => {
    return runtimes.map((runtime) => ({
      category: runtime.slug,
      value: runtime[stat],
    }));
  }, [runtimes, stat]);
  const runtimeBarChartData = showLessRuntime
    ? runtimeBarChartDataMemoized.sort((a, b) => b.value - a.value).slice(0, 10)
    : runtimeBarChartDataMemoized;

  const allModelsUsage = useMemo(() => {
    if (!barChartDate) {
      return 0;
    }

    for (const line of lines) {
      if (line.name === ALL_MODELS) {
        const maxTs = barChartDate.valueOf();
        const aggregatedData = aggregateData(
          line.data,
          maxTs,
          aggregationInterval,
          aggregator,
        );

        return (
          aggregatedData.find((datum) => datum.timestamp.valueOf() === maxTs)
            ?.value ?? 0
        );
      }
    }

    return 0;
  }, [aggregationInterval, aggregator, barChartDate, lines]);

  const [slug, setSlug] = useState(ALL_MODELS);

  return (
    <>
      <SEOHeader title="Model Usage" />
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
          <Stack direction={{ base: 'column', lg: 'row' }} mb="4" spacing="4">
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
                min={minBarChartDate?.toISOString()?.slice(0, 10)}
                max={maxBarChartDate?.toISOString()?.slice(0, 10)}
              />
              <Text pt="4" px="2" fontSize="sm" color="gray.600">
                {barChartDate && aggregationInterval > 1
                  ? `${new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'long',
                    }).format(
                      new Date(
                        barChartDate.valueOf() -
                          aggregationInterval * 24 * 3600 * 1000,
                      ),
                    )} - ${new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'long',
                    }).format(barChartDate)}`
                  : barChartDate
                  ? new Intl.DateTimeFormat(undefined, {
                      dateStyle: 'long',
                    }).format(barChartDate)
                  : ''}
              </Text>
            </Box>
            <Spacer />
            <Box>
              <Text>All Models</Text>
              <Text fontSize="3xl">
                {new Intl.NumberFormat().format(allModelsUsage)}
              </Text>
            </Box>
            <Menu>
              <MenuButton
                alignSelf="center"
                as={Button}
                variant="outline"
                colorScheme="gray"
                size="sm"
                leftIcon={<Icon as={SettingsIcon} />}
              >
                Agg
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  title="Interval"
                  type="radio"
                  value={String(aggregationInterval)}
                  onChange={(value) => setAggregationInterval(Number(value))}
                >
                  <MenuItemOption value="1">Last day</MenuItemOption>
                  <MenuItemOption value="7">Last week</MenuItemOption>
                  <MenuItemOption value="30">Last month</MenuItemOption>
                </MenuOptionGroup>
                <MenuDivider />
                <MenuOptionGroup
                  title="Aggregator"
                  type="radio"
                  value={aggregator}
                  onChange={(value) => setAggregator(value as Aggregator)}
                >
                  <MenuItemOption value="sum">Sum</MenuItemOption>
                  <MenuItemOption value="avg">Average</MenuItemOption>
                  <MenuItemOption value="min">Minimum</MenuItemOption>
                  <MenuItemOption value="max">Maximum</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Stack>

          <BarChart
            loading={loading}
            data={barChartData}
            height={Math.max(barChartData.length * 32, 300)}
            padding={0}
            onClick={(slug) => setSlug(slug)}
          />

          <Center>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowLessCalls(!showLessCalls)}
              rightIcon={
                showLessCalls ? (
                  <Icon as={ExpandMoreIcon} />
                ) : (
                  <Icon as={ExpandLessIcon} />
                )
              }
            >
              {showLessCalls ? 'Show More' : 'Show Less'}
            </Button>
          </Center>
        </Card>
        <Card mt="8">
          <Heading as="h2" fontSize="3xl" mb="8">
            Individual Model Runtime Stats
          </Heading>
          <Stack direction={{ base: 'column', lg: 'row' }} mb="4" spacing="4">
            <Spacer />
            <Menu>
              <MenuButton
                alignSelf="center"
                as={Button}
                variant="outline"
                colorScheme="gray"
                size="sm"
                leftIcon={<Icon as={SettingsIcon} />}
              >
                Stat
              </MenuButton>
              <MenuList minWidth="240px">
                <MenuOptionGroup
                  type="radio"
                  value={stat}
                  onChange={(value) => setStat(value as Stat)}
                >
                  <MenuItemOption value="min">Min</MenuItemOption>
                  <MenuItemOption value="max">Max</MenuItemOption>
                  <MenuItemOption value="mean">Mean</MenuItemOption>
                  <MenuItemOption value="median">Median</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </Stack>
          <BarChart
            loading={loading}
            data={runtimeBarChartData}
            height={Math.max(runtimeBarChartData.length * 32, 300)}
            padding={0}
          />
          <Center>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowLessRuntime(!showLessRuntime)}
              rightIcon={
                showLessRuntime ? (
                  <Icon as={ExpandMoreIcon} />
                ) : (
                  <Icon as={ExpandLessIcon} />
                )
              }
            >
              {showLessRuntime ? 'Show More' : 'Show Less'}
            </Button>
          </Center>
        </Card>
      </Container>
    </>
  );
}
