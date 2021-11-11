import {
  Currency,
  CurrencyAmount,
  Price,
  Token,
  TradeType,
} from '@uniswap/sdk-core';
import { useMemo } from 'react';

import { USDC } from '~/constants/tokens';

import { useClientSideV3Trade } from './useClientSideV3Trade';
import { useActiveWeb3React } from './web3';

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough for mainnet to filter low liquidity pairs.
const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [1]: CurrencyAmount.fromRawAmount(USDC[1], 100_000e6),
  [4]: CurrencyAmount.fromRawAmount(USDC[4], 1e6),
  [3]: CurrencyAmount.fromRawAmount(USDC[3], 1e6),
  [5]: CurrencyAmount.fromRawAmount(USDC[5], 1e6),
  [42]: CurrencyAmount.fromRawAmount(USDC[42], 1e6),
};

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(
  currency?: Currency,
): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React();

  const amountOut = chainId ? STABLECOIN_AMOUNT_OUT[chainId] : undefined;
  const stablecoin = amountOut?.currency;

  const v3USDCTrade = useClientSideV3Trade(
    TradeType.EXACT_OUTPUT,
    amountOut,
    currency,
  );

  return useMemo(() => {
    if (!currency || !stablecoin) {
      return undefined;
    }

    // handle usdc
    if (currency?.wrapped.equals(stablecoin)) {
      return new Price(stablecoin, stablecoin, '1', '1');
    }

    // use v2 price if available, v3 as fallback
    if (v3USDCTrade.trade) {
      const { numerator, denominator } = v3USDCTrade.trade.route.midPrice;
      return new Price(currency, stablecoin, denominator, numerator);
    }

    return undefined;
  }, [currency, stablecoin, v3USDCTrade.trade]);
}

export function useUSDCValue(
  currencyAmount: CurrencyAmount<Currency> | undefined | null,
) {
  const price = useUSDCPrice(currencyAmount?.currency);

  return useMemo(() => {
    if (!price || !currencyAmount) return null;
    try {
      return price.quote(currencyAmount);
    } catch (error) {
      return null;
    }
  }, [currencyAmount, price]);
}
