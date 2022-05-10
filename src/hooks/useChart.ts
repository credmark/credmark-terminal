import { useState, useMemo, useCallback } from 'react';

import { Line } from '~/components/RiskTerminal/helpers/HistoricalChart';

interface UseLineChartProps {
  defaultLines?: Line[];
  formatValue?: (value: number) => string;
}

export function useLineChart({
  defaultLines = [],
  formatValue = (value: number) => String(value),
}: UseLineChartProps) {
  const [lines, setLines] = useState<Line[]>(defaultLines);

  const setLine = useCallback((line: Line | undefined) => {
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

  return { lines, setLines, setLine, currentStats, formatValue };
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
    (data: Line['data']) => {
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
  };
}
