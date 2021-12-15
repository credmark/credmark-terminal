export interface CmkDataPoint {
  ts: number; // in seconds
  usdc_price: string;
  total_locked: string;
  total_supply: string;
  market_cap_usdc: string;
  circulating_supply: string;
}

export interface CmkGatewayResponse {
  name: 'cmk';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<CmkDataPoint>;
}

export interface StakedCmkDataPoint {
  ts: number; // in seconds
  total_supply: string;
  cmk_balance: string;
  cmk_rate: string;
  amount_staked_usdc: string;
  staking_apr_percent: string;
}

export interface StakedCmkGatewayResponse {
  name: 'xcmk';
  parameters: {
    token: string;
    limit: number;
  };
  dataType: 'time-series';
  data: Array<StakedCmkDataPoint>;
}
