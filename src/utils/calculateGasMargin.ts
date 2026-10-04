// add 20% (except on optimism)
export function calculateGasMargin(chainId: number, value: bigint): bigint {
  return (value * (10000n + 2000n)) / 10000n;
}
