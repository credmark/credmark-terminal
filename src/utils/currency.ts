import { WETH9 } from '@uniswap/sdk-core';

abstract class BaseCurrency {
  /**
   * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
   */
  abstract readonly isNative: boolean;
  /**
   * Returns whether the currency is a token that is usable in Uniswap without wrapping
   */
  abstract readonly isToken: boolean;
  /**
   * The chain ID on which this currency resides
   */
  readonly chainId: number;
  /**
   * The decimals used in representing currency amounts
   */
  readonly decimals: number;
  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  readonly symbol?: string;
  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  readonly name?: string;
  /**
   * Constructs an instance of the base class `BaseCurrency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(
    chainId: number,
    decimals: number,
    symbol?: string,
    name?: string,
  ) {
    if (!Number.isSafeInteger(chainId)) throw new Error('CHAIN_ID');
    if (decimals < 0 || decimals >= 255 || !Number.isInteger(decimals))
      throw new Error('DECIMALS');

    this.chainId = chainId;
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  abstract equals(other: ExtendedCurrency): boolean;

  /**
   * Return the wrapped version of this currency that can be used with the Uniswap contracts. Currencies must
   * implement this to be used in Uniswap
   */
  public abstract get wrapped(): ExtendedToken;
}

export abstract class NativeCurrency extends BaseCurrency {
  public readonly isNative: true = true;
  public readonly isToken: false = false;
  public priceEns?: string;
}

export type ExtendedCurrency = NativeCurrency | ExtendedToken;

export class ExtendedToken extends BaseCurrency {
  public readonly isNative: false = false;
  public readonly isToken: true = true;

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string;
  public readonly id?: string;
  public readonly priceEns?: string;
  public readonly createdAt?: Date;

  public constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    id?: string,
    priceEns?: string,
    createdAt?: Date,
  ) {
    super(chainId, decimals, symbol, name);
    this.address = address;
    this.id = id;
    this.priceEns = priceEns;
    this.createdAt = createdAt;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: ExtendedCurrency): boolean {
    return (
      other.isToken &&
      this.chainId === other.chainId &&
      this.address === other.address
    );
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: ExtendedToken): boolean {
    if (this.chainId !== other.chainId) throw new Error('Different chain IDs');
    if (this.address === other.address) throw new Error('Same addresses');
    return this.address.toLowerCase() < other.address.toLowerCase();
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): ExtendedToken {
    return this;
  }
}

export class Ether extends NativeCurrency {
  constructor(chainId = 1, priceEns?: string) {
    super(chainId, 18, 'ETH', 'Ether');
    this.priceEns = priceEns;
  }

  public equals(other: ExtendedCurrency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  public get wrapped(): ExtendedToken {
    const weth9 = WETH9[this.chainId];
    if (!weth9) throw new Error('No wrapped');
    return weth9;
  }
}

export class Solana extends NativeCurrency {
  constructor(chainId = 101, priceEns?: string) {
    super(chainId, 9, 'SOL', 'Solana');
    this.priceEns = priceEns;
  }

  public equals(other: ExtendedCurrency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  public get wrapped(): ExtendedToken {
    if (this.chainId !== 101) throw new Error('No wrapped');
    return new ExtendedToken(
      101,
      'So11111111111111111111111111111111111111112',
      9,
      'SOL',
      'Wrapped SOL',
      'So11111111111111111111111111111111111111112',
    );
  }
}

export class Avalanche extends NativeCurrency {
  constructor(chainId = 43114, priceEns?: string) {
    super(chainId, 18, 'AVAX', 'Avalanche C-Chain');
    this.priceEns = priceEns;
  }

  public equals(other: ExtendedCurrency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }

  public get wrapped(): ExtendedToken {
    if (this.chainId !== 43114) throw new Error('No wrapped');
    return new ExtendedToken(
      43114,
      '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      18,
      'WAVAX',
      'Wrapped AVAX',
    );
  }
}
