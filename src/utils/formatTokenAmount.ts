import { Price, CurrencyAmount, Currency, Fraction } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

export function formatTokenAmount(
  amount: CurrencyAmount<Currency> | undefined,
  sigFigs: number,
  { shorten } = { shorten: false },
): string {
  if (!amount) {
    return '-';
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0';
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return '<0.00001';
  }

  if (!shorten) {
    return amount.toSignificant(sigFigs);
  }

  const num = Number(amount.toSignificant(sigFigs + 3));
  if (num > 1e9) {
    return `${(num / 1e9).toFixed(sigFigs)}B`;
  } else if (num > 1e6) {
    return `${(num / 1e6).toFixed(sigFigs)}M`;
  } else if (num > 1e3) {
    return `${(num / 1e3).toFixed(sigFigs)}K`;
  } else {
    return num.toFixed(sigFigs);
  }
}

export function formatPrice(
  price: Price<Currency, Currency> | undefined,
  sigFigs: number,
): string {
  if (!price) {
    return '-';
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return '<0.0001';
  }

  const num = Number(price.toSignificant(sigFigs + 3));
  if (num > 1e9) {
    return `${(num / 1e9).toFixed(sigFigs)}B`;
  } else if (num > 1e6) {
    return `${(num / 1e6).toFixed(sigFigs)}M`;
  } else if (num > 1e3) {
    return `${(num / 1e3).toFixed(sigFigs)}K`;
  } else {
    return num.toFixed(sigFigs);
  }
}
