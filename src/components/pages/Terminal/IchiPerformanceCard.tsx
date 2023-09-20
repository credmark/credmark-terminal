import {
  Button,
  chakra,
  HStack,
  Img,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Td,
  Text,
  Tr,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { Token } from '@uniswap/sdk-core';
import React, { useMemo } from 'react';

import CurrencyLogo, { CurrenciesLogo } from '~/components/shared/CurrencyLogo';

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

export interface VaultPerformance {
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
  chainId: number;
  vault: IchiVault;
  performance: VaultPerformance;
  duration: number;
}

export default function IchiPerformanceCard({
  chainId,
  duration,
  vault,
  performance,
}: IchiPerformanceCardProps) {
  const { colorMode } = useColorMode();

  const hypothetical = useDisclosure();

  const currencies = useMemo(() => {
    return [
      new Token(chainId, vault.token0_address, 18, vault.token0_symbol),
      new Token(chainId, vault.token1_address, 18, vault.token1_symbol),
    ];
  }, [
    chainId,
    vault.token0_address,
    vault.token0_symbol,
    vault.token1_address,
    vault.token1_symbol,
  ]);

  const depositToken = vault.allow_token0 ? currencies[0] : currencies[1];
  const pairedToken = vault.allow_token0 ? currencies[1] : currencies[0];

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

    const number = typeof key === 'number' ? key : performance[key];
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

  function getNetworkUrl() {
    if (chainId === 1) {
      return '/img/chains/ethereum.svg';
    } else if (chainId === 137) {
      return '/img/chains/polygon.svg';
    } else if (chainId === 42161) {
      return '/img/chains/arbitrum.svg';
    }

    throw new Error('Chain id not supported');
  }

  return (
    <>
      <LinkBox
        as={Tr}
        bg={colorMode === 'dark' ? '#18131b' : 'white'}
        _hover={{
          transform: 'scale(0.99)',
        }}
        transitionDuration="normal"
        transitionProperty="common"
      >
        <Td roundedLeft="lg" py="8">
          <LinkOverlay
            href={`https://app.ichi.org/vault/token/${depositToken.address}/`}
            target="_blank"
          >
            <HStack>
              <CurrencyLogo currency={depositToken} />
              <chakra.span>{depositToken.symbol}</chakra.span>
            </HStack>
          </LinkOverlay>
        </Td>
        <Td>
          <HStack>
            <CurrencyLogo currency={pairedToken} />
            <chakra.span>{pairedToken.symbol}</chakra.span>
          </HStack>
        </Td>
        <Td>
          <Img src={getNetworkUrl()} />
        </Td>
        <Td>
          {formatNumber('irr_cashflow_365', {
            multiplier: 100,
            suffix: '%',
          })}
        </Td>
        <Td>
          {formatNumber(`irr_cashflow_${duration}` as keyof VaultPerformance, {
            multiplier: 100,
            suffix: '%',
          })}
        </Td>
        <Td>{formatNumber('tvl', { prefix: '$' })}</Td>
        <Td roundedRight="lg">
          <Button bg="green.500" onClick={hypothetical.onToggle}>
            Simulate+
          </Button>
        </Td>
      </LinkBox>
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
              <CurrenciesLogo currencies={[depositToken, pairedToken]} />
              <Text fontSize="xl" fontWeight={600}>
                {depositToken.symbol} / {pairedToken.symbol}
              </Text>
            </HStack>
          </ModalHeader>

          <ModalBody>
            <HStack fontSize="xl" fontWeight={600} mb="4">
              <Text>Hypothetical Deposit</Text>
              <Spacer />
              <Text color="green.500">{formatNumber('qty_hold')}</Text>
            </HStack>
            <HStack fontSize="xl" fontWeight={600} mb="2">
              <Text>Quantity returned if deposited:</Text>
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
