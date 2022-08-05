import {
  Box,
  BoxProps,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Skeleton,
  useColorMode,
} from '@chakra-ui/react';
import { Currency } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';

import CurrencyLogo from '~/components/shared/CurrencyLogo';
import LazyLoad from '~/components/shared/LazyLoad';
import useExpander from '~/hooks/useExpander';

import CurveDexChartBox from './CurveDexChartBox';
import UniDexChartBox from './UniDexChartBox';

interface TokenRadioGroupProps extends BoxProps {
  tokens: Currency[];
  selectedToken?: Currency;
  setSelectedToken: (token?: Currency) => void;
}

function TokenRadioGroup({
  tokens,
  selectedToken,
  setSelectedToken,
  ...boxProps
}: TokenRadioGroupProps) {
  const { colorMode } = useColorMode();
  return (
    <Box overflowX="auto" py="2" {...boxProps}>
      <HStack>
        <Button
          flexShrink="0"
          size="sm"
          rounded="full"
          colorScheme={!selectedToken ? 'green' : 'gray'}
          bg={
            !selectedToken
              ? 'green.500'
              : colorMode === 'dark'
              ? '#1C161F'
              : 'gray.100'
          }
          color={!selectedToken ? 'purple.800' : undefined}
          fontWeight={!selectedToken ? '700' : undefined}
          onClick={() => setSelectedToken(undefined)}
        >
          ALL
        </Button>
        {tokens.map((token) => {
          return (
            <Button
              flexShrink="0"
              size="sm"
              rounded="full"
              key={token.isNative ? 'ETH' : token.address}
              colorScheme={selectedToken?.equals(token) ? 'green' : 'gray'}
              bg={
                selectedToken?.equals(token)
                  ? 'green.500'
                  : colorMode === 'dark'
                  ? '#1C161F'
                  : 'gray.100'
              }
              color={selectedToken?.equals(token) ? 'purple.800' : undefined}
              fontWeight={selectedToken?.equals(token) ? '700' : undefined}
              onClick={() => setSelectedToken(token)}
              leftIcon={<CurrencyLogo currency={token} size={20} />}
            >
              {token.symbol}
            </Button>
          );
        })}
      </HStack>
    </Box>
  );
}

interface DexPageProps {
  dex: 'SUSHISWAP' | 'UNISWAP_V2' | 'UNISWAP_V3' | 'CURVE';
  pools: Array<{
    pool: string;
    tokens: Currency[];
    createdAt?: number;
    varStartTime?: number;
    fee?: number;
  }>;
}

export default function DexPage({ dex, pools }: DexPageProps) {
  const [selectedToken, setSelectedToken] = useState<Currency>();
  const expander = useExpander();

  const tokens = useMemo(
    () =>
      pools.reduce<Currency[]>((tokens, pool) => {
        for (const poolToken of pool.tokens) {
          if (tokens.find((token) => poolToken.equals(token))) {
            continue;
          }

          tokens.push(poolToken);
        }

        return tokens;
      }, []),
    [pools],
  );

  function isPoolTokenSelected(tokens: Currency[]) {
    if (!selectedToken) return true;

    for (const token of tokens) {
      if (token.equals(selectedToken)) return true;
    }

    return false;
  }

  return (
    <Container px="8" py="4" maxW="full">
      <Flex align="center">
        <TokenRadioGroup
          flex="1"
          tokens={tokens}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
      </Flex>

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap="8"
        mt="6"
        mb="16"
      >
        {pools
          .filter((pool) => isPoolTokenSelected(pool.tokens))
          .map(({ pool, tokens, createdAt, fee, varStartTime }) => (
            <GridItem
              minW="0"
              colSpan={expander.isExpanded(pool) ? 2 : 1}
              key={pool}
              ref={expander.refByKey(pool)}
            >
              <LazyLoad placeholder={<Skeleton height="400px" />}>
                {dex === 'CURVE' ? (
                  <CurveDexChartBox
                    pool={pool}
                    tokens={tokens}
                    createdAt={createdAt}
                    fee={fee}
                    isExpanded={expander.isExpanded(pool)}
                    onExpand={() => expander.onExpand(pool)}
                  />
                ) : (
                  <UniDexChartBox
                    dex={dex}
                    pool={pool}
                    tokens={tokens}
                    createdAt={createdAt}
                    fee={fee}
                    varStartTime={varStartTime}
                    isExpanded={expander.isExpanded(pool)}
                    onExpand={() => expander.onExpand(pool)}
                  />
                )}
              </LazyLoad>
            </GridItem>
          ))}
      </Grid>
    </Container>
  );
}
