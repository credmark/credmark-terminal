import {
  Box,
  BoxProps,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
} from '@chakra-ui/react';
import { Currency } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';

import DexChartBox from './DexChartBox';

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
  return (
    <Box overflowX="auto" py="2" {...boxProps}>
      <HStack>
        <Button
          flexShrink="0"
          size="sm"
          rounded="full"
          colorScheme={!selectedToken ? 'green' : 'gray'}
          color={!selectedToken ? 'purple.500' : undefined}
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
              color={selectedToken?.equals(token) ? 'purple.500' : undefined}
              onClick={() => setSelectedToken(token)}
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
  pools: Array<{ pool: string; tokens: Currency[]; createdAt?: number }>;
}

export default function DexPage({ dex, pools }: DexPageProps) {
  const [selectedToken, setSelectedToken] = useState<Currency>();
  const [expandedPool, setExpandedPool] = useState<string>();

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
    <Container p="8" maxW="full">
      <Flex align="center">
        {/* <Select
          w="200px"
          mr="4"
          variant="filled"
          bg="white"
          border="1px"
          borderColor="gray.100"
        >
          <option>TVL</option>
        </Select> */}
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
          .map(({ pool, tokens, createdAt }) => (
            <GridItem
              minW="0"
              colSpan={expandedPool === pool ? 2 : 1}
              key={pool}
            >
              <DexChartBox
                dex={dex}
                pool={pool}
                tokens={tokens}
                createdAt={createdAt}
                isExpanded={expandedPool === pool}
                onExpand={() =>
                  expandedPool === pool
                    ? setExpandedPool(undefined)
                    : setExpandedPool(pool)
                }
              />
            </GridItem>
          ))}
      </Grid>
    </Container>
  );
}
