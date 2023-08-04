import {
  Box,
  Button,
  Center,
  chakra,
  Divider,
  Flex,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Token } from '@uniswap/sdk-core';
import React, { useMemo } from 'react';

import { Card } from '~/components/base';
import { CurrenciesLogo } from '~/components/shared/CurrencyLogo';
import LoadingNumber from '~/components/shared/LoadingNumber';
import { useModelRunner } from '~/hooks/useModel';

export interface IchiVault {
  vault: string;
  owner: string;
  pool: string;
  token0_address: string;
  token0_symbol: string;
  token1_symbol: string;
  token1_address: string;
  allow_token0: boolean;
  allow_token1: boolean;
  total_supply_scaled: number;
}

interface VaultPerformance {
  vault: string;
  token0: string;
  token1: string;
  tvl: number;
  token0_symbol: string;
  token1_symbol: string;
  token0_amount: number;
  token1_amount: number;
  allowed_token: string;
  allowed_token_n: number;
  deployment_block_number: number;
  deployment_block_timestamp: number;
  first_deposit_block_number: number;
  first_deposit_block_timestamp: number;
  days_since_first_deposit: number;
  days_since_deployment: number;
  vault_token_ratio_current: number;
  vault_token_ratio_start: number;
  return_rate: number;
  irr_cashflow: number;
  irr_cashflow_non_zero: number;
  qty_hold: number;
  qty_vault: number;
  vault_token_ratio_7: number;
  return_rate_7: number;
  irr_cashflow_7: number;
  irr_cashflow_non_zero_7: number;
  qty_vault_7: number;
  vault_token_ratio_30: number;
  return_rate_30: number;
  irr_cashflow_30: number;
  irr_cashflow_non_zero_30: number;
  qty_vault_30: number;
  vault_token_ratio_60: number;
  return_rate_60: number;
  irr_cashflow_60: number;
  irr_cashflow_non_zero_60: number;
  qty_vault_60: number;
  vault_token_ratio_365: number;
  return_rate_365: number;
  irr_cashflow_365: number;
  irr_cashflow_non_zero_365: number;
  qty_vault_365: number;
}

interface IchiPerformanceCardProps {
  vault: IchiVault;
  blockNumber: number;
  layout?: 'grid' | 'list';
}

const ErrorOverlay = chakra(Center, {
  baseStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pl: 10,
    pr: 8,
    pb: 16,
    backdropFilter: 'blur(4px)',
    bg: 'blackAlpha.500',
  },
});

export default function IchiPerformanceCard({
  vault,
  blockNumber,
  layout = 'list',
}: IchiPerformanceCardProps) {
  const baseQuantity = 1000;
  const performanceModel = useModelRunner<VaultPerformance>({
    chainId: 137,
    slug: 'ichi/ichi.vault-performance',
    input: {
      address: vault.vault,
      days_horizon: [7, 30, 60, 365],
      base: baseQuantity,
    },
    blockNumber,
  });

  const error = performanceModel.loading
    ? undefined
    : performanceModel.errorMessage;

  const hypothetical = useDisclosure();

  const perf = performanceModel.output;

  const currencies = useMemo(() => {
    return [
      new Token(137, vault.token0_address, 18, vault.token0_symbol),
      new Token(137, vault.token1_address, 18, vault.token1_symbol),
    ];
  }, [
    vault.token0_address,
    vault.token0_symbol,
    vault.token1_address,
    vault.token1_symbol,
  ]);

  function formatNumber(
    key: keyof VaultPerformance | number,
    {
      multiplier,
      prefix,
      suffix,
      ...numberFormatOptions
    }: {
      multiplier?: number;
      prefix?: string;
      suffix?: string;
    } & Intl.NumberFormatOptions = {},
  ) {
    multiplier ??= 1;
    prefix ??= '';
    suffix ??= '';
    numberFormatOptions = {
      maximumFractionDigits: 2,
      ...numberFormatOptions,
    };

    if (performanceModel.loading && !performanceModel.output) {
      return (
        <>
          {prefix}{' '}
          <LoadingNumber
            fractionDigits={numberFormatOptions.maximumFractionDigits}
          />{' '}
          {suffix}
        </>
      );
    }

    const number = typeof key === 'number' ? key : perf?.[key];
    if (number === undefined || number === null) {
      return '-';
    }

    if (typeof number === 'string') {
      throw new Error(`${key} => ${number} is Not a valid number`);
    }

    return (
      prefix +
      new Intl.NumberFormat(undefined, numberFormatOptions).format(
        number * multiplier,
      ) +
      suffix
    );
  }

  function listCard() {
    return (
      <Card position="relative">
        <Flex
          justifyContent="space-between"
          minH="30px"
          roundedTop="md"
          px="8"
          py="8"
        >
          <HStack>
            <CurrenciesLogo currencies={currencies} size={40} />
            <Text fontSize="xl" fontWeight={600}>
              {vault.token0_symbol} / {vault.token1_symbol}
            </Text>
          </HStack>
          <Flex alignItems="center" gap="16px">
            <Text color="green.500" fontSize="xl" fontWeight={600}>
              TVL {formatNumber('tvl', { prefix: '$' })}
            </Text>
          </Flex>
          <HStack>
            <Button variant="ghost" onClick={hypothetical.onToggle}>
              Example
            </Button>
            <Button bg="green.500" isDisabled={!!error} w="32">
              Earn
            </Button>
          </HStack>
        </Flex>

        {performanceModel.loading ? (
          <Progress isIndeterminate h="1px" />
        ) : (
          <Divider />
        )}

        <Flex justifyContent="space-between" px="8" py="4">
          <HStack>
            <Text>IRR Annualized</Text>
            <Text fontWeight={600}>
              {formatNumber('irr_cashflow_365', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack>
            <Text>IRR Since inception</Text>
            <Text fontWeight={600}>
              {formatNumber('irr_cashflow', { multiplier: 100, suffix: '%' })}
            </Text>
          </HStack>
          <HStack color="gray.500">
            <Text>IRR Last 7</Text>
            <Text fontWeight={600}>
              {formatNumber('irr_cashflow_7', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack color="gray.500">
            <Text>IRR Last 30</Text>
            <Text fontWeight={600}>
              {formatNumber('irr_cashflow_30', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack color="gray.500">
            <Text>IRR Last 60</Text>
            <Text fontWeight={600}>
              {formatNumber('irr_cashflow_60', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
        </Flex>
        {error && (
          <ErrorOverlay>
            <Text
              as="pre"
              bg="red.50"
              color="red.600"
              p="4"
              rounded="md"
              fontSize="xs"
              w="100%"
              whiteSpace="break-spaces"
            >
              {error}
            </Text>
          </ErrorOverlay>
        )}
      </Card>
    );
  }

  function gridCard() {
    return (
      <Card position="relative">
        <HStack minH="30px" roundedTop="md" px="8" py="10">
          <CurrenciesLogo currencies={currencies} />
          <Text fontSize="xl" fontWeight={600}>
            {vault.token0_symbol} / {vault.token1_symbol}
          </Text>
          <Spacer />
          <Flex alignItems="center" gap="16px">
            <Text color="green.500" fontSize="xl" fontWeight={600}>
              TVL {formatNumber('tvl', { prefix: '$' })}
            </Text>
          </Flex>
        </HStack>

        {performanceModel.loading ? (
          <Progress isIndeterminate h="1px" />
        ) : (
          <Divider />
        )}

        <Box px="8" py="10">
          <HStack fontSize="xl" fontWeight={600} mb="4">
            <Text>IRR Annualized</Text>
            <Spacer />
            <Text>
              {formatNumber('irr_cashflow_365', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack fontSize="xl" fontWeight={600} mb="1">
            <Text>IRR Since inception</Text>
            <Spacer />
            <Text>
              {formatNumber('irr_cashflow', { multiplier: 100, suffix: '%' })}
            </Text>
          </HStack>
          <HStack mb="1" color="gray.500">
            <Text>IRR Last 7</Text>
            <Spacer />
            <Text>
              {formatNumber('irr_cashflow_7', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack mb="1" color="gray.500">
            <Text>IRR Last 30</Text>
            <Spacer />
            <Text>
              {formatNumber('irr_cashflow_30', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack mb="5" color="gray.500">
            <Text>IRR Last 60</Text>
            <Spacer />
            <Text>
              {formatNumber('irr_cashflow_60', {
                multiplier: 100,
                suffix: '%',
              })}
            </Text>
          </HStack>
          <HStack mb="5" color="gray.500">
            <Text>Days Since Creation</Text>
            <Spacer />
            <Text>
              {formatNumber('days_since_deployment', {
                maximumFractionDigits: 0,
              })}
            </Text>
          </HStack>
        </Box>

        <Box px="8" mb="2">
          <Link
            href={`https://app.ichi.org/vault/token/${
              vault.allow_token0 ? vault.token0_address : vault.token1_address
            }/`}
            target="_blank"
          >
            <Button bg="green.500" w="100%" size="lg" isDisabled={!!error}>
              Earn
            </Button>
          </Link>
        </Box>
        <Center mb="4">
          <Button variant="ghost" size="lg" onClick={hypothetical.onToggle}>
            View Hypothetical
          </Button>
        </Center>
        {error && (
          <ErrorOverlay>
            <Text
              as="pre"
              bg="red.50"
              color="red.600"
              p="4"
              rounded="md"
              fontSize="xs"
              w="100%"
              whiteSpace="break-spaces"
            >
              {error}
            </Text>
          </ErrorOverlay>
        )}
      </Card>
    );
  }

  return (
    <>
      {layout === 'list' ? listCard() : gridCard()}
      <Modal
        isOpen={hypothetical.isOpen}
        onClose={hypothetical.onClose}
        isCentered
        size="lg"
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
        <ModalContent rounded="base" bg="purple.800" color="white" shadow="2xl">
          <ModalCloseButton />
          <ModalHeader>
            <HStack>
              <CurrenciesLogo currencies={currencies} />
              <Text fontSize="xl" fontWeight={600}>
                {vault.token0_symbol} / {vault.token1_symbol}
              </Text>
            </HStack>
          </ModalHeader>

          <ModalBody>
            <HStack fontSize="xl" fontWeight={600} mb="4">
              <Text>Hypothetical Deposit</Text>
              <Spacer />
              <Text color="green.500">{formatNumber(baseQuantity)}</Text>
            </HStack>
            <HStack fontSize="xl" fontWeight={600} mb="2">
              <Text>Quantities if deposited...</Text>
            </HStack>
            <HStack mb="1">
              <Text>Since Inception</Text>
              <Spacer />
              <Text>{formatNumber('qty_vault')}</Text>
            </HStack>
            <HStack mb="1">
              <Text>7 days ago</Text>
              <Spacer />
              <Text>{formatNumber('qty_vault_7')}</Text>
            </HStack>
            <HStack mb="1">
              <Text>30 days ago</Text>
              <Spacer />
              <Text>{formatNumber('qty_vault_30')}</Text>
            </HStack>
            <HStack mb="5">
              <Text>60 days ago</Text>
              <Spacer />
              <Text>{formatNumber('qty_vault_60')}</Text>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
