import { BoxProps, Center, Flex, Icon, Image } from '@chakra-ui/react';
import HelpIcon from '@mui/icons-material/Help';
import React, { useMemo, useState } from 'react';

import {
  ExtendedCurrency,
  ExtendedToken,
  NativeCurrency,
} from '~/utils/currency';

export enum ChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  XDAI = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  PALM_TESTNET = 11297108099,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  HARDHAT = 31337,
  MOONBEAM = 1284,
  OPTIMISM = 10,
  KAVA = 2222,
  SOLANA = 101,
}

const BLOCKCHAIN: Record<number, string> = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'binance',
  [ChainId.CELO]: 'celo',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.AVALANCHE_TESTNET]: 'fuji',
  [ChainId.FUSE]: 'fuse',
  [ChainId.HARMONY]: 'harmony',
  [ChainId.HECO]: 'heco',
  [ChainId.MATIC]: 'matic',
  [ChainId.MOONRIVER]: 'moonriver',
  [ChainId.OKEX]: 'okex',
  [ChainId.PALM]: 'palm',
  [ChainId.TELOS]: 'telos',
  [ChainId.XDAI]: 'xdai',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.AVALANCHE]: 'avalanchec',
  [ChainId.MOONBEAM]: 'moonbeam',
  [ChainId.HARDHAT]: 'hardhat',
  [ChainId.SOLANA]: 'solana',
};

export const getTokenLogoURLs = (currency: ExtendedToken): string[] => {
  const { chainId, address, id } = currency;
  const asset = id ?? address;
  const urls: string[] = [];
  if (chainId === ChainId.ETHEREUM) {
    urls.push(
      `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${asset}/logo.png`,
    );
  }

  if (chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/sushiswap/logos/main/network/${BLOCKCHAIN[chainId]}/${asset}.jpg`,
      `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/${BLOCKCHAIN[chainId]}/assets/${asset}/logo.png`,
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[chainId]}/assets/${asset}/logo.png`,
    );
  }

  if (chainId === ChainId.ETHEREUM) {
    urls.push(
      `https://raw.githubusercontent.com/curvefi/curve-assets/main/images/assets/${asset.toLowerCase()}.png`,
    );
  }

  return urls;
};

export const getNativeTokenLogoURLs = (currency: NativeCurrency): string[] => {
  const { chainId } = currency;
  const urls: string[] = [];
  if (chainId in BLOCKCHAIN) {
    urls.push(
      `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${BLOCKCHAIN[chainId]}/info/logo.png`,
    );
  }

  return urls;
};

const BAD_SRCS: { [badTokenLogoUrl: string]: true } = {};

interface CurrencyLogoProps extends BoxProps {
  currency?: ExtendedCurrency;
  size?: number;
}

export default function CurrencyLogo({
  currency,
  size = 24,

  ...boxProps
}: CurrencyLogoProps): JSX.Element {
  const [, refresh] = useState<number>(0);

  const srcs: string[] = useMemo(() => {
    if (!currency) return [];

    if (currency.isNative) {
      return getNativeTokenLogoURLs(currency);
    }

    if (currency.isToken) {
      return getTokenLogoURLs(currency);
    }

    return [];
  }, [currency]);

  const w = `${size}px`;
  const h = `${size}px`;

  if (currency?.symbol === 'CMK') {
    return (
      <Image
        src="/img/cmk.svg"
        alt="CMK"
        w={w}
        h={h}
        rounded="full"
        {...boxProps}
      />
    );
  }

  if (currency?.isNative && currency.symbol === 'ETH') {
    return (
      <Image
        src="/img/assets/eth.png"
        alt="ETH"
        w={w}
        h={h}
        rounded="full"
        {...boxProps}
      />
    );
  }

  const src: string | undefined = srcs.find((src) => !BAD_SRCS[src]);

  if (!src) {
    return (
      <Center
        rounded="full"
        border="1px solid"
        borderColor="gray.600"
        w={w}
        h={h}
        bg="gray.50"
        color="gray.800"
        {...boxProps}
      >
        <Icon as={HelpIcon} />
      </Center>
    );
  }

  return (
    <Image
      rounded="full"
      src={src}
      w={w}
      h={h}
      onError={() => {
        if (src) BAD_SRCS[src] = true;
        refresh((i) => i + 1);
      }}
      {...boxProps}
    />
  );
}

interface CurrenciesLogoProps {
  currencies?: ExtendedCurrency[];
  size?: number;
}

export function CurrenciesLogo({
  currencies = [],
  size = 24,
}: CurrenciesLogoProps): JSX.Element {
  return (
    <Flex position="relative">
      {currencies.map((currency, i) => (
        <CurrencyLogo
          key={i}
          currency={currency}
          ml={size * -0.2 + 'px'}
          size={size}
        />
      ))}
    </Flex>
  );
}
