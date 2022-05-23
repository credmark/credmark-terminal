import { useState, useMemo, useCallback } from 'react';

import { ChartLine } from '~/components/shared/Charts/HistoricalChart';
import { shortenNumber } from '~/utils/formatTokenAmount';

import { useDeepCompareEffectNoCheck } from './useDeepCompareEffect';

interface UseLineChartProps {
  defaultLines?: ChartLine[];
  formatter?: 'currency' | 'number';
  fractionDigits?: number;
}

export interface CsvData extends Record<string, string> {
  Timestamp: string;
}

export function useLineChart({
  defaultLines = [],
  formatter,
  fractionDigits = 2,
}: UseLineChartProps) {
  const [lines, setLines] = useState<ChartLine[]>(defaultLines);

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

  const csv = useMemo(() => {
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

    const data: Array<CsvData> = [];
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

  return { lines, setLines, currentStats, formatValue, csv };
}

interface UseSingleLineChartProps {
  name: string;
  color: string;
  data?: ChartLine['data'];
  formatter?: 'currency' | 'number';
  fractionDigits?: number;
}

export function useSingleLineChart({
  name,
  color,
  data,
  formatter,
  fractionDigits,
}: UseSingleLineChartProps) {
  const sortedData = [...(data || [])]?.sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const { lines, currentStats, setLines, formatValue, csv } = useLineChart({
    defaultLines: [
      {
        name,
        color,
        data: sortedData,
      },
    ],
    formatter,
    fractionDigits,
  });

  const setLine = useCallback(
    (line: ChartLine | undefined) => {
      setLines(line ? [line] : []);
    },
    [setLines],
  );

  useDeepCompareEffectNoCheck(() => {
    setLine({
      name,
      color,
      data: sortedData,
    });
  }, [color, sortedData, name]);

  return {
    line: lines[0],
    onChange: setLine,
    currentStats: currentStats[0],
    formatValue,
    csv,
  };
}
