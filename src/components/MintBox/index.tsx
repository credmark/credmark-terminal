import {
  Button,
  ButtonGroup,
  CloseButton,
  Collapse,
  HStack,
  Icon,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { TransactionResponse } from '@ethersproject/providers';
import { CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';

import { ACCESS_KEY_ADDRESSES } from '~/constants/addresses';
import { CMK } from '~/constants/tokens';
import { ApprovalState, useApproveCallback } from '~/hooks/useApproveCallback';
import { useAccessKeyContract } from '~/hooks/useContract';
import { useActiveWeb3React } from '~/hooks/web3';
import { useWalletModalToggle } from '~/state/application/hooks';
import { useTransactionAdder } from '~/state/transactions/hooks';
import { useTokenBalance } from '~/state/wallet/hooks';
import { calculateGasMargin } from '~/utils/calculateGasMargin';
import { toHex } from '~/utils/toHex';
import { tryParseAmount } from '~/utils/tryParseAmount';

import GlobalMintInfo from './GlobalMintInfo';

export default function MintBox() {
  const { library, chainId, account } = useActiveWeb3React();
  const router = useRouter();
  const isOpen = router.pathname === '/' && router.query.mint === 'true';

  function onOpen() {
    if (isOpen) return;
    router.push('/?mint=true');
  }

  function onClose(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    router.push('/');
  }

  const toggleWalletModal = useWalletModalToggle();
  const addTransaction = useTransactionAdder();
  const accessKeyContract = useAccessKeyContract();

  const [attemptingTxn, setAttemptingTxn] = useState(false);
  const currency = chainId ? CMK[chainId] : undefined;
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

    if (
      currency &&
      parsedAmount.lessThan(
        CurrencyAmount.fromRawAmount(
          currency,
          JSBI.multiply(
            JSBI.BigInt(100),
            JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
          ),
        ),
      )
    ) {
      return 'Minimum 100 CMK';
    }

    return undefined;
  }, [account, currency, maxAmount, parsedAmount]);

  const isValid = !errorMessage;

  function onMax(): void {
    if (maxAmount) {
      setAmount(maxAmount.toExact());
    }
  }

  const atMax = maxAmount && parsedAmount && maxAmount.equalTo(parsedAmount);

  async function onMint() {
    if (!chainId || !library || !account) return;

    if (!accessKeyContract || !parsedAmount) {
      return;
    }

    const data = accessKeyContract.interface.encodeFunctionData('mint', [
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
              summary: `Mint access key`,
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
    <VStack
      flex="1"
      position="relative"
      px="4"
      py={isOpen ? 16 : 4}
      bg="white"
      shadow={isOpen ? 'xl' : 'lg'}
      rounded="3xl"
      spacing="4"
      cursor={isOpen ? undefined : 'pointer'}
      _hover={
        isOpen
          ? {}
          : {
              shadow: '2xl',
            }
      }
      transitionProperty="width,height,box-shadow"
      transitionDuration="normal"
      onClick={onOpen}
    >
      {isOpen && (
        <CloseButton onClick={onClose} position="absolute" top="4" right="4" />
      )}
      <HStack spacing="4">
        <Collapse in={isOpen}>
          <HStack spacing="4">
            <Img src="/img/scmk.png" w="20" />
            <Icon as={IoArrowForward} boxSize={12} color="purple.500" />
          </HStack>
        </Collapse>
        <Img src="/img/key.png" w="14" />
      </HStack>
      <Text
        fontFamily="Credmark Regular"
        textAlign="center"
        bgGradient="linear(135deg, #3D0066, #0A528C)"
        bgClip="text"
        lineHeight="1"
      >
        <Text as="span" fontSize="2xl">
          STAKE CMK
        </Text>
        <br />
        <Text as="span" fontSize="lg">
          TO MINT
        </Text>
        <br />
        <Text as="span" fontSize="2xl">
          ACCESS KEY
        </Text>
      </Text>
      <Collapse in={isOpen}>
        <VStack spacing="8">
          <Text color="purple.500" textAlign="center" maxW="sm">
            Stake at least <strong>100 CMK</strong> to mint an{' '}
            <strong>Access Key</strong>. Earn rewards on your{' '}
            <strong>staked CMK</strong> (sCMK) and receive access to the{' '}
            <strong>Terminal</strong>
          </Text>
          {!account ? (
            <Button
              colorScheme="purple"
              size="lg"
              px="12"
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
              CONNECT WALLET
            </Button>
          ) : (
            <VStack>
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
                onClick={onMint}
                disabled={!isValid || approval !== ApprovalState.APPROVED}
              >
                {errorMessage ? errorMessage : 'Mint Access Key'}
              </Button>
            </VStack>
          )}
          <GlobalMintInfo />
        </VStack>
      </Collapse>
    </VStack>
  );
}
