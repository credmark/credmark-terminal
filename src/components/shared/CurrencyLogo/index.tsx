import { BoxProps, Center, Flex, Icon, Image } from '@chakra-ui/react';
import HelpIcon from '@mui/icons-material/Help';
import { Currency } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';

export const getTokenLogoURLs = (address: string): string[] => [
  `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
  `https://raw.githubusercontent.com/sushiswap/logos/main/network/ethereum/${address}.jpg`,
  `https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
  `https://raw.githubusercontent.com/curvefi/curve-assets/main/images/assets/${address.toLowerCase()}.png`,
];

const BAD_SRCS: { [badTokenLogoUrl: string]: true } = {};

interface CurrencyLogoProps extends BoxProps {
  currency?: Currency;
  size?: number;
}

export default function CurrencyLogo({
  currency,
  size = 24,

  ...boxProps
}: CurrencyLogoProps): JSX.Element {
  const [, refresh] = useState<number>(0);

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return [];

    if (currency.isToken) {
      const defaultUrls =
        currency.chainId === 1 ? getTokenLogoURLs(currency.address) : [];
      return defaultUrls;
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

  if (currency?.isNative) {
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
  currencies?: Currency[];
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
