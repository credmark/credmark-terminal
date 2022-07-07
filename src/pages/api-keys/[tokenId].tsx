import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Token, CurrencyAmount } from '@uniswap/sdk-core';
import { BigNumber } from 'ethers';
import humanizeDuration from 'humanize-duration';
import JSBI from 'jsbi';
import { Duration } from 'luxon';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { BorderedCard, PrimaryButton } from '~/components/base';
import CurrencyLogo from '~/components/shared/CurrencyLogo';
import { CREDMARK_ACCESS_FACTORY_ADDRESSES } from '~/constants/addresses';
import { CMK, SCMK, USDC } from '~/constants/tokens';
import { useAccessKeyFromTokenId } from '~/hooks/useAccessKeys';
import { useApproveCallback, ApprovalState } from '~/hooks/useApproveCallback';
import { useCredmarkAccessFactoryContract } from '~/hooks/useContract';
import { useActiveWeb3React } from '~/hooks/web3';
import { useWalletModalToggle } from '~/state/application/hooks';
import { useSingleCallResult } from '~/state/multicall/hooks';
import { useTransactionAdder } from '~/state/transactions/hooks';
import { useTokenBalance } from '~/state/wallet/hooks';
import { calculateGasMargin } from '~/utils/calculateGasMargin';
import { formatTokenAmount } from '~/utils/formatTokenAmount';
import { toHex } from '~/utils/toHex';
import { tryParseAmount } from '~/utils/tryParseAmount';

export default function AccessKeyDetailsPage() {
  const router = useRouter();
  const tokenId = router.query.tokenId as string;
  const { accessKey, loading } = useAccessKeyFromTokenId(
    BigNumber.from(tokenId),
  );

  const { library, chainId, account } = useActiveWeb3React();

  const toggleWalletModal = useWalletModalToggle();
  const addTransaction = useTransactionAdder();
  const credmarkAccessFactoryContract = useCredmarkAccessFactoryContract();

  const [attemptingTxn, setAttemptingTxn] = useState(false);

  const cmk = chainId ? CMK[chainId] : undefined;
  const xcmk = chainId ? SCMK[chainId] : undefined;
  const usdc = chainId ? USDC[chainId] : undefined;

  const cmkPerSec: BigNumber | undefined = useSingleCallResult(
    credmarkAccessFactoryContract,
    'cmkPerSec',
  ).result?.[0];

  const xcmkPerSec: BigNumber | undefined = useSingleCallResult(
    credmarkAccessFactoryContract,
    'xcmkPerSec',
  ).result?.[0];

  const usdcPerSec: BigNumber | undefined = useSingleCallResult(
    credmarkAccessFactoryContract,
    'usdcPerSec',
  ).result?.[0];

  const [currency, setCurrency] = useState<Token | undefined>(cmk);
  const balance = useTokenBalance(account ?? undefined, currency);

  // Resetting to CMK on network change
  useEffect(() => {
    setCurrency(chainId ? CMK[chainId] : undefined);
  }, [chainId]);

  const maxAmount = useMemo(() => {
    if (!balance) {
      return undefined;
    }

    // If balance has no decimal places (i.e. a whole number) return as it is
    if (
      JSBI.equal(
        JSBI.remainder(
          balance.quotient,
          JSBI.exponentiate(
            JSBI.BigInt(10),
            JSBI.BigInt(balance.currency.decimals),
          ),
        ),
        JSBI.BigInt(0),
      )
    ) {
      return balance;
    }

    // If balance <= 0.00001
    if (
      JSBI.lessThanOrEqual(
        balance.quotient,
        JSBI.exponentiate(
          JSBI.BigInt(10),
          JSBI.BigInt(balance.currency.decimals - 5),
        ),
      )
    ) {
      return balance;
    }

    // Reduce 0.00001 from balance
    return balance.subtract(
      CurrencyAmount.fromRawAmount(
        balance.currency,
        JSBI.exponentiate(
          JSBI.BigInt(10),
          JSBI.BigInt(balance.currency.decimals - 5),
        ),
      ),
    );
  }, [balance]);

  const [amount, setAmount] = useState('');

  // Resetting amount on currency change
  useEffect(() => {
    setAmount('');
  }, [currency]);

  const parsedAmount = tryParseAmount(amount, currency);

  const duration = useMemo(() => {
    if (!parsedAmount || !currency) return undefined;
    if (cmk && currency.equals(cmk) && cmkPerSec) {
      return Duration.fromObject({
        seconds: BigNumber.from(parsedAmount.quotient.toString())
          .div(cmkPerSec)
          .toNumber(),
      });
    } else if (xcmk && currency.equals(xcmk) && xcmkPerSec) {
      return Duration.fromObject({
        seconds: BigNumber.from(parsedAmount.quotient.toString())
          .div(xcmkPerSec)
          .toNumber(),
      });
    } else if (usdc && currency.equals(usdc) && usdcPerSec) {
      return Duration.fromObject({
        seconds: BigNumber.from(parsedAmount.quotient.toString())
          .div(usdcPerSec)
          .toNumber(),
      });
    }

    return undefined;
  }, [
    cmk,
    cmkPerSec,
    currency,
    parsedAmount,
    usdc,
    usdcPerSec,
    xcmk,
    xcmkPerSec,
  ]);

  // check whether the user has approved the router on the tokens
  const [approval, approveCallback] = useApproveCallback(
    parsedAmount,
    chainId ? CREDMARK_ACCESS_FACTORY_ADDRESSES[chainId] : undefined,
  );

  const showApproval = approval !== ApprovalState.APPROVED && !!parsedAmount;

  const errorMessage: string | undefined = useMemo(() => {
    if (!account) {
      return 'Wallet not connected';
    }

    if (!parsedAmount) {
      return 'Enter an amount';
    }

    if (parsedAmount && balance && balance.lessThan(parsedAmount)) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [account, balance, parsedAmount]);

  const isValid = !errorMessage;

  function onMax(): void {
    if (maxAmount) {
      setAmount(maxAmount.toExact());
    }
  }

  const atMax =
    maxAmount &&
    parsedAmount &&
    balance &&
    JSBI.greaterThanOrEqual(parsedAmount.quotient, maxAmount.quotient) &&
    JSBI.lessThanOrEqual(parsedAmount.quotient, balance.quotient);

  async function onExtendExpiry() {
    if (!chainId || !library || !account || !tokenId) return;

    if (!credmarkAccessFactoryContract || !parsedAmount) {
      return;
    }

    const data = credmarkAccessFactoryContract.interface.encodeFunctionData(
      'extendTokenExpiry',
      [
        toHex(tokenId),
        toHex(
          cmk && currency && currency.equals(cmk) ? parsedAmount.quotient : '0',
        ),
        toHex(
          xcmk && currency && currency.equals(xcmk)
            ? parsedAmount.quotient
            : '0',
        ),
        toHex(
          usdc && currency && currency.equals(usdc)
            ? parsedAmount.quotient
            : '0',
        ),
      ],
    );

    const txn: { to: string; data: string } = {
      to: CREDMARK_ACCESS_FACTORY_ADDRESSES[chainId],
      data,
    };

    setAttemptingTxn(true);

    library
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(chainId, estimate),
        };

        return library
          .getSigner()
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            setAmount('');
            addTransaction(response, {
              summary: `Extend NFT validity`,
            });
          });
      })
      .catch((error) => {
        console.error('Failed to send transaction', error);
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error);
        }
      })
      .finally(() => {
        setAttemptingTxn(false);
      });
  }

  return (
    <Container maxW="container.lg" p="8">
      {loading && !accessKey && (
        <Center p="8">
          <Spinner />
        </Center>
      )}
      {accessKey && (
        <>
          <Heading mb="8" color="purple.500">
            Access Key NFT #{accessKey.tokenId.toString()}{' '}
            {loading && <Spinner />}
          </Heading>
          <Text mt="2" fontSize="lg">
            Expires on{' '}
            {new Intl.DateTimeFormat(undefined, {
              dateStyle: 'long',
            }).format(accessKey.expiryTime)}
          </Text>

          <PrimaryButton mt="4">Generate API key</PrimaryButton>
          <VStack
            h="100%"
            position="relative"
            px="8"
            py="16"
            spacing="4"
            align="stretch"
          >
            <VStack spacing="4" w="100%">
              <Text color="purple.500" textAlign="center" px="2" fontSize="lg">
                Extend token validity
              </Text>
              <BorderedCard py="8" px="16" w="container.sm">
                <HStack>
                  <InputGroup size="lg" bg="gray.50" flex="1">
                    <Input
                      flex="1"
                      rounded="base"
                      placeholder="999.99"
                      isDisabled={attemptingTxn}
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                    <InputRightElement>
                      <ButtonGroup pr="4">
                        <Button
                          size="sm"
                          variant="ghost"
                          color="gray.400"
                          onClick={onMax}
                          isDisabled={atMax || attemptingTxn}
                        >
                          MAX
                        </Button>
                      </ButtonGroup>
                    </InputRightElement>
                  </InputGroup>
                  <Select
                    maxW="40"
                    size="lg"
                    value={currency?.address}
                    onChange={(event) => {
                      const currency = [cmk, xcmk, usdc].filter(
                        (c) => c?.address === event.target.value,
                      )[0];

                      if (currency) setCurrency(currency);
                    }}
                  >
                    <option value={cmk?.address}>
                      <CurrencyLogo currency={cmk} /> CMK
                    </option>
                    <option value={xcmk?.address}>
                      <CurrencyLogo currency={xcmk} /> xCMK
                    </option>
                    <option value={usdc?.address}>
                      <CurrencyLogo currency={usdc} /> USDC
                    </option>
                  </Select>
                </HStack>
                <Text p="1" fontSize="sm" color="gray.600" textAlign="right">
                  Available {formatTokenAmount(maxAmount, 2, { shorten: true })}{' '}
                  {currency?.symbol}
                </Text>

                <Box
                  py="8"
                  fontSize="lg"
                  textAlign="center"
                  display="flex"
                  justifyContent="center"
                >
                  <Text
                    bg="green.50"
                    color="green.600"
                    rounded="base"
                    px="4"
                    py="2"
                  >
                    Extend by{' '}
                    {duration
                      ? humanizeDuration(duration.as('milliseconds'), {
                          largest: 2,
                        })
                      : '??'}
                  </Text>
                </Box>

                <Center>
                  {(!account ||
                    ((approval === ApprovalState.NOT_APPROVED ||
                      approval === ApprovalState.PENDING) &&
                      isValid)) && (
                    <>
                      {!account ? (
                        <Button
                          variant="outline"
                          bg="white"
                          border="1px"
                          borderColor="gray.100"
                          colorScheme="purple"
                          size="lg"
                          w="320px"
                          rounded="base"
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg',
                          }}
                          _active={{
                            transform: 'scale(0.98)',
                            boxShadow: 'inner',
                          }}
                          onClick={toggleWalletModal}
                        >
                          Connect wallet
                        </Button>
                      ) : (
                        <>
                          {(approval === ApprovalState.NOT_APPROVED ||
                            approval === ApprovalState.PENDING) &&
                            isValid &&
                            showApproval && (
                              <Button
                                variant="outline"
                                bg="white"
                                border="1px"
                                borderColor="gray.100"
                                colorScheme="purple"
                                size="lg"
                                w="320px"
                                rounded="base"
                                _hover={{
                                  transform: 'translateY(-2px)',
                                  boxShadow: 'lg',
                                }}
                                _active={{
                                  transform: 'scale(0.98)',
                                  boxShadow: 'inner',
                                }}
                                onClick={approveCallback}
                                isLoading={approval === ApprovalState.PENDING}
                                loadingText={`Approving ${currency?.symbol}`}
                              >
                                Approve {currency?.symbol}
                              </Button>
                            )}
                        </>
                      )}
                    </>
                  )}

                  {account && (
                    <Button
                      variant="outline"
                      bg="white"
                      border="1px"
                      borderColor="gray.100"
                      colorScheme="purple"
                      size="lg"
                      w="320px"
                      rounded="base"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      _active={{
                        transform: 'scale(0.98)',
                        boxShadow: 'inner',
                      }}
                      isLoading={attemptingTxn}
                      onClick={onExtendExpiry}
                      disabled={!isValid || approval !== ApprovalState.APPROVED}
                    >
                      {errorMessage ? errorMessage : `Extend validity`}
                    </Button>
                  )}
                </Center>
              </BorderedCard>
            </VStack>
          </VStack>
        </>
      )}
    </Container>
  );
}
