import { useCallback, useMemo, useState } from 'react';

import { ChartLine, CsvData, CsvRow } from '~/types/chart';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { useDeepCompareEffect } from './useDeepCompare';

interface UseLineChartProps {
  lines?: ChartLine[];
  formatter?: 'currency' | 'number';
  fractionDigits?: number;
  loading: boolean;
  error: string | undefined;
}

export function useLineChart({
  lines: _lines = [],
  formatter,
  fractionDigits = 2,
  loading,
  error,
}: UseLineChartProps) {
  const [lines, setLines] = useState<ChartLine[]>(_lines);

  useDeepCompareEffect(() => {
    setLines(_lines);
  }, [_lines]);

  const formatValue = useCallback(
    (value: number) => {
      switch (formatter) {
        case 'currency':
          return '$' + shortenNumber(value, fractionDigits);
        case 'number':
          return shortenNumber(value, fractionDigits);
        default:
          return String(value);
      }
    },
    [formatter, fractionDigits],
  );

  const currentStats = useMemo(() => {
    return lines.map((line) => {
      const latestDataPoint = [...(line.data ?? [])].sort(
        (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf(),
      )[0];

      return {
        label: line.name,
        value: latestDataPoint ? formatValue(latestDataPoint.value) : '-',
      };
    });
  }, [formatValue, lines]);

  const csv = useMemo<CsvData>(() => {
    const csvDataTsMap: Record<
      string,
      Array<{ key: string; value: string }>
    > = {};

    const headers = ['Timestamp'];
    for (const cl of lines) {
      headers.push(cl.name);
      for (const dp of cl.data) {
        const MS_IN_1_HOUR = 3600 * 1000;
        const ts = new Date(
          Math.round(dp.timestamp.valueOf() / MS_IN_1_HOUR) * MS_IN_1_HOUR,
        ).toISOString();

        if (!(ts in csvDataTsMap)) {
          csvDataTsMap[ts] = [];
        }

        csvDataTsMap[ts].push({
          key: cl.name,
          value: formatValue(dp.value),
        });
      }
    }

    const data: CsvRow[] = [];
    for (const ts in csvDataTsMap) {
      data.push({
        Timestamp: ts,
        ...csvDataTsMap[ts].reduce(
          (curr, prev) => ({ ...curr, [prev.key]: prev.value }),
          {},
        ),
      });
    }

    return { data, headers };
  }, [formatValue, lines]);

  return { lines, currentStats, formatValue, csv, loading, error };
}

interface UseSingleLineChartProps {
  name: string;
  color: string;
  data?: ChartLine['data'];
  formatter?: 'currency' | 'number';
  fractionDigits?: number;
  loading: boolean;
  error: string | undefined;
}

export function useSingleLineChart({
  name,
  color,
  data,
  formatter,
  fractionDigits,
  loading: _loading,
  error: _error,
}: UseSingleLineChartProps) {
  const sortedData = [...(data || [])]?.sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const { lines, currentStats, formatValue, csv, loading, error } =
    useLineChart({
      lines: [
        {
          name,
          color,
          data: sortedData,
        },
      ],
      formatter,
      fractionDigits,
      loading: _loading,
      error: _error,
    });

  return {
    lines,
    currentStats,
    formatValue,
    csv,
    loading,
    error,
  };
}
