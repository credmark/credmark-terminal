export interface ChartLine {
  name: string;
  color: string;
  data: Array<{
    timestamp: Date;
    value: number;
  }>;
}

export type Aggregator = 'min' | 'max' | 'avg' | 'sum';
