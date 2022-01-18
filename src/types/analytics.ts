interface MarketInfo {
  app: string; // 'uniswap_v3' | 'sushiswap';
  address: string;
  label: string;
  volume_24h: string;
}

export interface CmkAnalyticsDataPoint {
  ts: number; // in seconds
  usdc_price: string;
  total_locked: string;
  total_supply: string;
  market_cap_usdc: string;
  circulating_supply: string;
  total_holders: number;
  volume_24h: string;
  markets: MarketInfo[];
}

export interface CmkAnalyticsGatewayResponse {
  name: 'cmk';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<CmkAnalyticsDataPoint>;
}

export interface StakedCmkAnalyticsDataPoint {
  ts: number; // in seconds
  total_supply: string;
  cmk_balance: string;
  cmk_rate: string;
  amount_staked_usdc: string;
  staking_apr_percent: string;
  total_holders: number;
}

export interface StakedCmkAnalyticsGatewayResponse {
  name: 'xcmk';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<StakedCmkAnalyticsDataPoint>;
}
