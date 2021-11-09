import { Button, ButtonGroup } from '@chakra-ui/button';
import { Box, VStack, Text } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { CurrencyAmount } from '@uniswap/sdk-core';
import React, { useMemo, useState } from 'react';

import { ACCESS_KEY_ADDRESSES } from '~/constants/addresses';
import { CMK } from '~/constants/tokens';
import { ApprovalState, useApproveCallback } from '~/hooks/useApproveCallback';
import { useAccessKeyContract } from '~/hooks/useContract';
import { useActiveWeb3React } from '~/hooks/web3';
import { useWalletModalToggle } from '~/state/application/hooks';
import { useSingleCallResult } from '~/state/multicall/hooks';
import { useTransactionAdder } from '~/state/transactions/hooks';
import { useTokenBalance } from '~/state/wallet/hooks';
import { calculateGasMargin } from '~/utils/calculateGasMargin';
import { formatTokenAmount } from '~/utils/formatTokenAmount';
import { toHex } from '~/utils/toHex';
import { tryParseAmount } from '~/utils/tryParseAmount';

interface AccessKeyListItemProps {
  tokenId: BigNumber;
}

export default function AccessKeyListItem({ tokenId }: AccessKeyListItemProps) {
  const { chainId, account, library } = useActiveWeb3React();
  const addTransaction = useTransactionAdder();

  const accessKeyContract = useAccessKeyContract();
  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const [burned, setBurned] = useState(false);

  const currency = chainId ? CMK[chainId] : undefined;

  const { result: cmkValueResult } = useSingleCallResult(
    accessKeyContract,
    'cmkValue',
    [tokenId],
  );

  const cmkValue =
    cmkValueResult && currency
      ? CurrencyAmount.fromRawAmount(currency, cmkValueResult?.[0].toString())
      : undefined;

  const { result: feesAccumulatedResult } = useSingleCallResult(
    accessKeyContract,
    'feesAccumulated',
    [tokenId],
  );

  const feesAccumulated =
    feesAccumulatedResult && currency
      ? CurrencyAmount.fromRawAmount(
          currency,
          feesAccumulatedResult?.[0].toString(),
        )
      : undefined;

  const toggleWalletModal = useWalletModalToggle();

  const maxAmount = useTokenBalance(account ?? undefined, currency);

  const [amount, setAmount] = useState('');
  const parsedAmount = tryParseAmount(amount, currency);

  // check whether the user has approved the router on the tokens
  const [approval, approveCallback] = useApproveCallback(
    parsedAmount,
    chainId ? ACCESS_KEY_ADDRESSES[chainId] : undefined,
  );

  const showApproval = approval !== ApprovalState.APPROVED && !!parsedAmount;

  const errorMessage: string | undefined = useMemo(() => {
    if (!account) {
      return 'Wallet not connected';
    }

    if (!parsedAmount) {
      return 'Enter an amount';
    }

    if (parsedAmount && maxAmount && maxAmount.lessThan(parsedAmount)) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [account, maxAmount, parsedAmount]);

  const isValid = !errorMessage;

  function onMax(): void {
    if (maxAmount) {
      setAmount(maxAmount.toExact());
    }
  }

  const atMax = maxAmount && parsedAmount && maxAmount.equalTo(parsedAmount);

  async function onAddCmk() {
    if (!chainId || !library || !account) return;

    if (!accessKeyContract || !parsedAmount) {
      return;
    }

    const data = accessKeyContract.interface.encodeFunctionData('addCmk', [
      toHex(tokenId.toString()),
      toHex(parsedAmount.quotient),
    ]);

    const txn: { to: string; data: string } = {
      to: ACCESS_KEY_ADDRESSES[chainId],
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
              summary: `Add CMK to access key`,
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

  async function onBurn() {
    if (!chainId || !library || !account) return;

    if (!accessKeyContract) {
      return;
    }

    const data = accessKeyContract.interface.encodeFunctionData('burn', [
      toHex(tokenId.toString()),
    ]);

    const txn: { to: string; data: string } = {
      to: ACCESS_KEY_ADDRESSES[chainId],
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
            setBurned(true);
            addTransaction(response, {
              summary: `Burn access key`,
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
    <Box p="4" shadow="2xl" rounded="xl">
      CMK Value: {formatTokenAmount(cmkValue, 2, { shorten: true })}
      <br />
      Fees Accumulated:{' '}
      {formatTokenAmount(feesAccumulated, 2, { shorten: true })} CMK
      <br />
      <br />
      {!burned && (
        <VStack spacing="4" mb="4">
          <Text>Add CMK</Text>
          <InputGroup w="md" shadow="lg" mb="4" size="lg" rounded="lg">
            <Input
              borderWidth="0"
              placeholder="999.99"
              textAlign="center"
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

          {(!account ||
            ((approval === ApprovalState.NOT_APPROVED ||
              approval === ApprovalState.PENDING) &&
              isValid)) && (
            <>
              {!account ? (
                <Button
                  colorScheme="purple"
                  size="lg"
                  w="200px"
                  rounded="2xl"
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
                        colorScheme="purple"
                        size="lg"
                        w="200px"
                        rounded="2xl"
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

          <Button
            colorScheme="purple"
            size="lg"
            w="200px"
            rounded="2xl"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'scale(0.98)',
              boxShadow: 'inner',
            }}
            isLoading={attemptingTxn}
            onClick={onAddCmk}
            disabled={!isValid || approval !== ApprovalState.APPROVED}
          >
            {errorMessage ? errorMessage : 'Add CMK'}
          </Button>
        </VStack>
      )}
      {cmkValue && feesAccumulated && (
        <ButtonGroup>
          <Button
            colorScheme="red"
            onClick={onBurn}
            isLoading={attemptingTxn}
            isDisabled={burned}
          >
            {burned ? 'Burned' : 'Burn'}
          </Button>
          {cmkValue.lessThan(feesAccumulated) && !burned && (
            <Button>Liquidate</Button>
          )}
        </ButtonGroup>
      )}
    </Box>
  );
}
