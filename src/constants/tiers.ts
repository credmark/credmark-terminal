const TIER_KEYS = ['BUIDL', 'DYOR', 'WAGMI'] as const;

export type TierKey = typeof TIER_KEYS[number];

export function isValidTierKey(x: string): x is TierKey {
  return TIER_KEYS.includes(x as TierKey);
}

export interface TierInfo {
  label: TierKey;
  rewardMultiplier: number;
  monthlyFeeUsd: number;
  lockupPeriod: false | string;
  modelFramework: boolean;
  terminalAccess: boolean;
  apiGatewayAccess: false | string;
  custom: boolean;
  isActive?: boolean;
}

export const TIERS: ReadonlyArray<TierInfo> = [
  {
    label: 'BUIDL',
    rewardMultiplier: 1,
    monthlyFeeUsd: 0,
    lockupPeriod: false,
    modelFramework: true,
    terminalAccess: true,
    apiGatewayAccess: false,
    custom: false,
  },
  {
    label: 'DYOR',
    rewardMultiplier: 2,
    monthlyFeeUsd: 500,
    lockupPeriod: '1 week',
    modelFramework: true,
    terminalAccess: true,
    apiGatewayAccess: 'API Access (10,000 calls/day)',
    custom: false,
  },
  {
    label: 'WAGMI',
    rewardMultiplier: 4,
    monthlyFeeUsd: 5000,
    lockupPeriod: '1 month',
    modelFramework: true,
    terminalAccess: true,
    apiGatewayAccess: 'Unlimited API Access',
    custom: true,
    isActive: true,
  },
] as const;
