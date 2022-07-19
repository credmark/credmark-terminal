import { useCallback, useMemo, useState } from 'react';

import { ChartLine, CsvData, CsvRow } from '~/types/chart';
import { getCurrentStats } from '~/utils/chart';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { useDeepCompareEffect } from './useDeepCompare';

type Formatter = 'currency' | 'number' | 'percent';

export interface UseLineChartProps {
  lines?: ChartLine[];
  formatter?: Formatter;
  formatPrefix?: string;
  formatSuffix?: string;
  fractionDigits?: number;
  loading?: boolean;
  error?: string | undefined;
}

export function useLineChart({
  lines: _lines = [],
  formatter,
  formatPrefix = '',
  formatSuffix = '',
  fractionDigits = 2,
  loading = false,
  error = undefined,
}: UseLineChartProps) {
  const [lines, setLines] = useState<ChartLine[]>(_lines);

  useDeepCompareEffect(() => {
    setLines(_lines);
  }, [_lines]);

  const formatValue = useCallback(
    (value: number) => {
      let formatted: string;
      switch (formatter) {
        case 'currency':
          formatted = '$' + shortenNumber(value, fractionDigits);
          break;
        case 'number':
          formatted = shortenNumber(value, fractionDigits);
          break;
        case 'percent':
          formatted = shortenNumber(value, fractionDigits) + '%';
          break;
        default:
          formatted = String(value);
      }

      return formatPrefix + formatted + formatSuffix;
    },
    [formatPrefix, formatSuffix, formatter, fractionDigits],
  );

  const currentStats = useMemo(() => {
    return lines.map((line) => {
      const latestDataPoint = [...(line.data ?? [])].sort(
        (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf(),
      )[0];

      return getCurrentStats({
        name: line.name,
        description: line.description,
        error: line.error ?? error,
        loading,
        value: latestDataPoint ? formatValue(latestDataPoint.value) : undefined,
      });
    });
  }, [error, formatValue, lines, loading]);

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

export interface UseSingleLineChartProps extends Omit<ChartLine, 'data'> {
  data?: ChartLine['data'];
  formatter?: Formatter;
  formatPrefix?: string;
  formatSuffix?: string;
  fractionDigits?: number;
  loading?: boolean;
  error?: string | undefined;
}

export function useSingleLineChart({
  name,
  description,
  color,
  data,
  formatter,
  formatPrefix,
  formatSuffix,
  fractionDigits,
  loading: _loading = false,
  error: _error = '',
}: UseSingleLineChartProps) {
  const sortedData = [...(data || [])]?.sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const { lines, currentStats, formatValue, csv, loading, error } =
    useLineChart({
      lines: [
        {
          name,
          description,
          color,
          data: sortedData,
        },
      ],
      formatter,
      formatPrefix,
      formatSuffix,
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
