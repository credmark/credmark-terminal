import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

import LoadingNumber from '~/components/shared/LoadingNumber';
import StatusPopover from '~/components/shared/StatusPopover';
import { Aggregator, ChartLine, CsvData, CsvRow } from '~/types/chart';

export function filterDataByDuration(
  data: ChartLine['data'],
  durationInDays: number,
) {
  const sortedData = [...data].sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const duration = durationInDays * 24 * 3600 * 1000;
  const startTs =
    sortedData.length > 0
      ? sortedData[sortedData.length - 1].timestamp.valueOf()
      : 0;

  const endTs = startTs > 0 ? startTs - duration : 0;
  return sortedData.filter((dp) => dp.timestamp.valueOf() > endTs);
}

export function aggregateData(
  data: ChartLine['data'],
  maxTs: number,
  intervalInDays: number,
  aggregator: Aggregator,
) {
  const interval = intervalInDays * 24 * 3600 * 1000;
  const sortedData = data
    .filter((datum) => datum.timestamp.valueOf() <= maxTs)
    .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());

  const rangedData: { timestamp: Date; data: ChartLine['data'] }[] = [];
  for (const datum of sortedData) {
    const i = Math.floor((maxTs - datum.timestamp.valueOf()) / interval);
    if (!rangedData[i]) {
      rangedData[i] = {
        timestamp: new Date(maxTs - interval * i),
        data: [],
      };
    }

    rangedData[i].data.push(datum);
  }

  return rangedData
    .map(({ timestamp, data }) => {
      let value = 0;
      switch (aggregator) {
        case 'max':
          value = Math.max(...data.map((datum) => datum.value));
          break;
        case 'min':
          value = Math.min(...data.map((datum) => datum.value));
          break;
        case 'sum':
          value = data.reduce((sum, datum) => sum + datum.value, 0);
          break;
        case 'avg':
          value =
            data.reduce((sum, datum) => sum + datum.value, 0) / data.length;
          break;
      }

      return {
        timestamp,
        value,
      };
    })
    .filter((val) => !!val);
}

export function mergeCsvs(...csvs: Array<CsvData>) {
  const dataMap: Record<string, CsvRow> = {};
  const headers: string[] = [];
  for (const csv of csvs) {
    for (const header of csv.headers) {
      if (!headers.includes(header)) {
        headers.push(header);
      }
    }

    for (const datum of csv.data) {
      const ts = datum['Timestamp'];
      for (const [key, value] of Object.entries(datum)) {
        if (key === 'Timestamp') {
          continue;
        }

        if (!(ts in dataMap)) {
          dataMap[ts] = {
            Timestamp: ts,
          };
        }

        dataMap[ts][key] = value;
      }
    }
  }

  return { data: Object.values(dataMap), headers };
}

export function getCurrentStats({
  name,
  description,
  error,
  value,
  loading,
}: {
  name: string;
  description?: React.ReactNode;
  error?: string;
  value?: string;
  loading: boolean;
}) {
  const label = (
    <HStack spacing={1}>
      <Text as="span">{name}</Text>
      {description && (
        <StatusPopover iconProps={{ boxSize: 4, color: 'gray.300' }}>
          {description}
        </StatusPopover>
      )}
    </HStack>
  );

  if (error) {
    return {
      label,
      value: (
        <StatusPopover status="error">
          <Text as="pre" p="4" fontSize="xs" whiteSpace="break-spaces">
            {error}
          </Text>
        </StatusPopover>
      ),
    };
  }

  if (value) {
    return { label, value };
  }

  if (loading) {
    return { label, value: <LoadingNumber /> };
  }

  return { label, value: <>&nbsp;</> };
}
