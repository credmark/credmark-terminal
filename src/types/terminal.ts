import type Color from 'color';

export type AssetKey = 'AAVEV2' | 'COMPOUND';
export type GraphKey =
  | 'LCR' // Liquidity Coverage Ratio
  | 'VAR' // Value at Risk
  | 'TA' // Total Assets
  | 'TL' // Total Liabilities
  | 'MC'; // Market Cap

export interface AssetInfo {
  key: AssetKey;
  title: string;
  subtitle?: string;
  logo: string;
  color: Color;
  infoLink: string;
}

export interface GraphInfo {
  key: GraphKey;
  title: string;
  subtitle?: string;
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
  '1_day_95p': string; // -ve Billion $
  '1_day_99p': string; // -ve Billion $
  '10_day_95p': string; // -ve Billion $
  '10_day_99p': string; // -ve Billion $
  var_date_1_day_95p: string; // YYYY-MM-DD format
  var_date_1_day_99p: string; // YYYY-MM-DD format
  var_date_10_day_95p: string; // YYYY-MM-DD format
  var_date_10_day_99p: string; // YYYY-MM-DD format
  total_assets: number; // $
  total_liabilities: number; // $
  relative_var_assets: string; // -ve Billion $
  relative_var_liabilities: string; // -ve Billion $
  ts: number; // in seconds
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

export type AssetStatsMap = Partial<
  Record<
    AssetKey,
    Array<{
      key: string;
      value: string;
      tooltip?: string;
      isPrimary?: boolean;
    }>
  >
>;
