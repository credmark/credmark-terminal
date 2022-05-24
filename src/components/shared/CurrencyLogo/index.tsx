import { Center, Icon, Image } from '@chakra-ui/react';
import { Currency } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';
import { FaEthereum } from 'react-icons/fa';

export const getTokenLogoURL = (address: string): string =>
  `https://raw.githubusercontent.com/uniswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

const BAD_SRCS: { [tokenAddress: string]: true } = {};

interface CurrencyLogoProps {
  currency?: Currency;
  size?: number;
}

export default function CurrencyLogo({
  currency,
  size = 24,
}: CurrencyLogoProps): JSX.Element {
  const [, refresh] = useState<number>(0);

  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return [];

    if (currency.isToken) {
      const defaultUrls =
        currency.chainId === 1 ? [getTokenLogoURL(currency.address)] : [];
      return defaultUrls;
    }
    return [];
  }, [currency]);

  const w = `${size}px`;
  const h = `${size}px`;

  if (currency?.symbol === 'CMK') {
    return <Image src="/img/cmk.svg" alt="CMK" w={w} h={h} rounded="full" />;
  }

  if (currency?.isNative) {
    return (
      <Image src="/img/assets/eth.png" alt="ETH" w={w} h={h} rounded="full" />
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
      >
        <Icon as={FaEthereum} w={`${size * 0.6}px`} h={`${size * 0.6}px`} />
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
    />
  );
}
