import { Price, CurrencyAmount, Currency, Fraction } from '@uniswap/sdk-core';
import JSBI from 'jsbi';

export function shortenNumber(num: number, fixedFigs: number) {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(fixedFigs)}B`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(fixedFigs)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(fixedFigs)}K`;
  } else {
    return num.toFixed(fixedFigs);
  }
}

export function formatTokenAmount(
  amount: CurrencyAmount<Currency> | undefined,
  fixedFigs: number,
  { shorten, withComma }: { shorten?: boolean; withComma?: boolean } = {
    shorten: false,
    withComma: false,
  },
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

  let formatted: string;

  if (shorten) {
    const num = Number(amount.toSignificant(fixedFigs + 3));
    formatted = shortenNumber(num, fixedFigs);
  } else {
    formatted = amount.toFixed(fixedFigs);
  }

  if (withComma) {
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return formatted;
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
  return shortenNumber(num, sigFigs);
}
