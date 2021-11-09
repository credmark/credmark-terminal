import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  HStack,
  Icon,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { TransactionResponse } from '@ethersproject/providers';
import { BigintIsh, CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
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
import { tryParseAmount } from '~/utils/tryParseAmount';

/**
 * Converts a big int to a hex string
 * @param bigintIsh
 * @returns The hex encoded calldata
 */
export function toHex(bigintIsh: BigintIsh) {
  const bigInt = JSBI.BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = `0${hex}`;
  }
  return `0x${hex}`;
}

export default function MintBox() {
  const { library, chainId, account } = useActiveWeb3React();
  const { isOpen, onOpen } = useDisclosure();
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
      w={isOpen ? 'container.md' : 'md'}
      px="8"
      py={isOpen ? 16 : 8}
      bg="white"
      shadow={isOpen ? 'xl' : 'lg'}
      rounded="3xl"
      spacing="6"
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
      <HStack spacing="4">
        <Collapse in={isOpen}>
          <HStack spacing="4">
            <Img src="/img/scmk.png" w="20" />
            <Icon as={IoArrowForward} boxSize={12} color="purple.500" />
          </HStack>
        </Collapse>
        <Img src="/img/key.png" w="20" />
      </HStack>
      <Text
        fontFamily="Credmark Regular"
        textAlign="center"
        bgGradient="linear(135deg, #3D0066, #0A528C)"
        bgClip="text"
        lineHeight="1.2"
      >
        <Text as="span" fontSize="4xl">
          STAKE CMK
        </Text>
        <br />
        <Text as="span" fontSize="xl">
          TO MINT
        </Text>
        <br />
        <Text as="span" fontSize="4xl">
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
          <Box whiteSpace="nowrap" w="100%">
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Staking APY
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                123.12%
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Total Value Deposited
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $123,456.78
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                % of CMK Staked
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                12.23%
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Total Keys Minted
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                67
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Collapse>
    </VStack>
  );
}
