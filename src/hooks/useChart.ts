import { useState, useMemo, useCallback } from 'react';

import { ChartLine } from '~/components/shared/Charts/HistoricalChart';

interface UseLineChartProps {
  defaultLines?: ChartLine[];
  formatValue?: (value: number) => string;
}

export interface CsvData extends Record<string, string> {
  Timestamp: string;
}

export function useLineChart({
  defaultLines = [],
  formatValue = (value: number) => String(value),
}: UseLineChartProps) {
  const [lines, setLines] = useState<ChartLine[]>(defaultLines);

  const setLine = useCallback((line: ChartLine | undefined) => {
    setLines(line ? [line] : []);
  }, []);

  const currentStats = useMemo(() => {
    return lines.map((line) => {
      const latestDataPoint = (line.data ?? []).sort(
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

  return { lines, setLines, setLine, currentStats, formatValue, csv };
}

interface UseSingleLineChartProps {
  formatValue?: (value: number) => string;
  name: string;
  color: string;
}

export function useSingleLineChart({
  formatValue,
  name,
  color,
}: UseSingleLineChartProps) {
  const {
    lines,
    currentStats,
    setLine,
    formatValue: _formatValue,
    csv,
  } = useLineChart({
    defaultLines: [
      {
        name,
        color,
        data: [],
      },
    ],
    formatValue,
  });

  const updateData = useCallback(
    (data: ChartLine['data']) => {
      setLine({
        name,
        color,
        data: data.sort(
          (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf(),
        ),
      });
    },
    [color, name, setLine],
  );

  return {
    line: lines[0],
    onChange: setLine,
    currentStats: currentStats[0],
    formatValue: _formatValue,
    updateData,
    csv,
  };
}
