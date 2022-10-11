import {
  Box,
  Button,
  Center,
  Heading,
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
import React, { useEffect, useMemo, useState } from 'react';

import { Card } from '~/components/base';
import BarChart from '~/components/shared/Charts/BarChart';
import { Aggregator, BarChartData, ChartLine } from '~/types/chart';
import { ModelMetadata, ModelUsage } from '~/types/model';
import { aggregateData } from '~/utils/chart';

import { tooltipFormatter } from './utils';

interface ModelsUsageCardProps {
  modelsMetadata: ModelMetadata[];
  loading: boolean;
  modelsUsage: ModelUsage[];
  error?: string;
}

export default function ModelsUsageCard({
  modelsMetadata,
  loading,
  modelsUsage,
}: ModelsUsageCardProps) {
  const [showLess, setShowLess] = useState(true);
  const [barChartDate, setBarChartDate] = useState<Date>();
  const [barChartDateRange, setBarChartDateRange] = useState<[Date, Date]>();
  const [minBarChartDate, maxBarChartDate] = barChartDateRange ?? [];
  const [aggregationInterval, setAggregationInterval] = useState(1); // In Days
  const [aggregator, setAggregator] = useState<Aggregator>('sum');

  useEffect(() => {
    let minDate: Date | undefined;
    let maxDate: Date | undefined;
    for (const usage of modelsUsage) {
      const timestamp = new Date(usage.ts);
      if (!maxDate || timestamp > maxDate) maxDate = timestamp;
      if (!minDate || timestamp < minDate) minDate = timestamp;
    }

    if (minDate && maxDate) {
      setBarChartDateRange([minDate, maxDate]);
      setBarChartDate(maxDate);
    }
  }, [modelsUsage]);

  const lines = useMemo(() => {
    const slugLineMap: Record<string, ChartLine> = {};
    for (const usage of modelsUsage) {
      if (!(usage.slug in slugLineMap)) {
        slugLineMap[usage.slug] = {
          name: usage.slug,
          color: '#A200FF',
          data: [],
        };
      }

      const timestamp = new Date(usage.ts);
      const value = Number(usage.count);
      slugLineMap[usage.slug].data.push({
        timestamp,
        value,
      });
    }

    return Object.values(slugLineMap);
  }, [modelsUsage]);

  const data = useMemo(() => {
    const data: BarChartData = [];

    for (const line of lines) {
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

    return data
      .sort((a, b) => b.value - a.value)
      .slice(0, showLess ? 10 : Infinity);
  }, [aggregationInterval, aggregator, barChartDate, lines, showLess]);

  const allModelsUsage = useMemo(() => {
    if (!barChartDate) {
      return 0;
    }

    const allModelsDataMap: Record<number, ChartLine['data'][number]> = {};
    for (const usage of modelsUsage) {
      const timestamp = new Date(usage.ts);
      const value = Number(usage.count);
      if (!(timestamp.valueOf() in allModelsDataMap)) {
        allModelsDataMap[timestamp.valueOf()] = { timestamp, value: 0 };
      }

      allModelsDataMap[timestamp.valueOf()].value += value;
    }

    const maxTs = barChartDate.valueOf();
    const aggregatedData = aggregateData(
      Object.values(allModelsDataMap),
      maxTs,
      aggregationInterval,
      aggregator,
    );

    return (
      aggregatedData.find((datum) => datum.timestamp.valueOf() === maxTs)
        ?.value ?? 0
    );
  }, [aggregationInterval, aggregator, barChartDate, modelsUsage]);

  const tooltip = useMemo(
    () => tooltipFormatter(modelsMetadata),
    [modelsMetadata],
  );

  return (
    <Card mt="8" px="6" py="4">
      <Heading as="h2" fontSize="3xl" mb="8">
        Individual Model API Calls
      </Heading>
      <Stack direction={{ base: 'column', lg: 'row' }} mb="4" spacing="4">
        <Box minW="240px" maxW="480px">
          <Input
            type="date"
            value={barChartDate?.toISOString().slice(0, 10) ?? ''}
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
        data={data}
        height={Math.max(data.length * 32, 335)}
        padding={0}
        // onClick={(slug) => setSlug(slug)}
        tooltipFormatter={tooltip}
      />
      <Center>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLess(!showLess)}
          rightIcon={
            showLess ? (
              <Icon as={ExpandMoreIcon} />
            ) : (
              <Icon as={ExpandLessIcon} />
            )
          }
        >
          {showLess ? 'Show More' : 'Show Less'}
        </Button>
      </Center>
    </Card>
  );
}
