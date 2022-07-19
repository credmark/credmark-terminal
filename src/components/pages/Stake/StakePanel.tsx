import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import React, { useMemo, useState } from 'react';

import { PrimaryButton } from '~/components/base';
import { STAKED_CMK_ADDRESSES } from '~/constants/addresses';
import { CMK } from '~/constants/tokens';
import { useStakingApyPercent } from '~/hooks/stats';
import { ApprovalState, useApproveCallback } from '~/hooks/useApproveCallback';
import { useStakedCredmarkContract } from '~/hooks/useContract';
import { useActiveWeb3React } from '~/hooks/web3';
import { useWalletModalToggle } from '~/state/application/hooks';
import { useTransactionAdder } from '~/state/transactions/hooks';
import { useTokenBalance } from '~/state/wallet/hooks';
import { calculateGasMargin } from '~/utils/calculateGasMargin';
import { toHex } from '~/utils/toHex';
import { tryParseAmount } from '~/utils/tryParseAmount';

export default function StakePanel() {
  const { library, chainId, account } = useActiveWeb3React();

  const toggleWalletModal = useWalletModalToggle();
  const addTransaction = useTransactionAdder();
  const stakedCredmarkContract = useStakedCredmarkContract();
  const stakingApyPercent = useStakingApyPercent();

  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const currency = chainId ? CMK[chainId] : undefined;
  const balance = useTokenBalance(account ?? undefined, currency);

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
  const parsedAmount = tryParseAmount(amount, currency);

  // check whether the user has approved the router on the tokens
  const [approval, approveCallback] = useApproveCallback(
    parsedAmount,
    chainId ? STAKED_CMK_ADDRESSES[chainId] : undefined,
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

  async function onStake() {
    if (!chainId || !library || !account) return;

    if (!stakedCredmarkContract || !parsedAmount) {
      return;
    }

    const data = stakedCredmarkContract.interface.encodeFunctionData(
      'createShare',
      [toHex(parsedAmount.quotient)],
    );

    const txn: { to: string; data: string } = {
      to: STAKED_CMK_ADDRESSES[chainId],
      data,
    };

    setAttemptingTxn(true);

    library
      .getSigner()
      .estimateGas(txn)
      .then((estimate) => {
        console.log(estimate.toString());
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
              summary: `Stake CMK`,
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
    <VStack spacing="4" justify="center" w="full" pt="8">
      <HStack justify="space-between" w="full" px="2">
        <Text fontSize="xl">STAKE CMK</Text>
        <Text>
          Staking APR{' '}
          <strong>
            {stakingApyPercent.loading || !stakingApyPercent.value
              ? '??'
              : stakingApyPercent.value.toFixed(2) + '%'}
          </strong>
        </Text>
      </HStack>
      <InputGroup size="lg">
        <Input
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

      <Box h="8"></Box>

      {(!account ||
        ((approval === ApprovalState.NOT_APPROVED ||
          approval === ApprovalState.PENDING) &&
          isValid)) && (
        <>
          {!account ? (
            <PrimaryButton size="lg" w="320px" onClick={toggleWalletModal}>
              Connect wallet
            </PrimaryButton>
          ) : (
            <>
              {(approval === ApprovalState.NOT_APPROVED ||
                approval === ApprovalState.PENDING) &&
                isValid &&
                showApproval && (
                  <PrimaryButton
                    size="lg"
                    w="320px"
                    onClick={approveCallback}
                    isLoading={approval === ApprovalState.PENDING}
                    loadingText={`Approving ${currency?.symbol}`}
                  >
                    Approve {currency?.symbol}
                  </PrimaryButton>
                )}
            </>
          )}
        </>
      )}

      {account && (
        <PrimaryButton
          size="lg"
          w="320px"
          isLoading={attemptingTxn}
          onClick={onStake}
          isDisabled={!isValid || approval !== ApprovalState.APPROVED}
        >
          {errorMessage ? errorMessage : 'Stake CMK'}
        </PrimaryButton>
      )}
    </VStack>
  );
}
