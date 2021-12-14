import type Color from 'color';

export type AssetKey = 'AAVEV2' | 'COMPOUND';
export type GraphKey = 'LCR' | 'VAR';

export interface AssetInfo {
  key: AssetKey;
  name: string;
  logo: string;
  color: Color;
  infoLink: string;
}

export interface GraphInfo {
  key: GraphKey;
  name: string;
  description: string;
  infoLink: string;
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
  '10_day_99p': string;
  var_date_10_day_99p: string;
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
