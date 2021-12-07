import type Color from 'color';

export type AssetKey = 'AAVEV2' | 'COMP' | 'USDC';
export type GraphKey = 'LCR' | 'VAR';

export interface AssetInfo {
  key: AssetKey;
  name: string;
  logo: string;
  color: Color;
}

export interface GraphInfo {
  key: GraphKey;
  name: string;
  description: string;
}

export interface LcrDataPoint {
  ts: number; // in seconds
  lcr: number;
  v2_ratio?: number;
  market_cap?: number;
  total_assets?: number;
  total_liabilities?: number;
}

export interface LcrGatewayResponse {
  name: 'lcr';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<LcrDataPoint>;
}

export interface VarDataPoint {
  '1_day_95p'?: string;
  '1_day_99p'?: string;
  '10_day_95p'?: string;
  '10_day_99p': string;
  ts: number;
}

export interface VarGatewayResponse {
  name: 'var';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<VarDataPoint>;
}
