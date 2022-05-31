export interface ChartLine {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

export type Aggregator = 'min' | 'max' | 'avg' | 'sum';

export interface CsvRow extends Record<string, string> {
  Timestamp: string;
}

export interface CsvData {
  headers: string[];
  data: CsvRow[];
}

export type BarChartData = Array<{
  category: string;
  value: number;
}>;
