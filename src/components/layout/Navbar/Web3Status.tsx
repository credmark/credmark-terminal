import { Button, Spinner, Text } from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { useMemo } from 'react';

import { NetworkContextName } from '~/constants/misc';
import useENSName from '~/hooks/useENSName';
import { useWalletModalToggle } from '~/state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from '~/state/transactions/hooks';
import { TransactionDetails } from '~/state/transactions/reducer';
import shortenAddress from '~/utils/shortenAddress';

import WalletModal from './WalletModal';

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

function Web3StatusInner() {
  const { account, error } = useWeb3React();

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);

  const toggleWalletModal = useWalletModalToggle();

  const buttonContent = useMemo(() => {
    const hasPendingTransactions = !!pending.length;
    if (account) {
      return hasPendingTransactions ? (
        <>
          <Text>{pending?.length} Pending</Text> <Spinner ml="2" />
        </>
      ) : (
        <Text>{ENSName || shortenAddress(account)}</Text>
      );
    } else if (error) {
      return (
        <Text>
          {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
        </Text>
      );
    } else {
      return 'Connect Wallet';
    }
  }, [ENSName, account, error, pending?.length]);

  return (
    <Button
      onClick={toggleWalletModal}
      rounded="full"
      colorScheme="whiteAlpha"
      color="white"
      variant="outline"
      fontSize="sm"
      px="8"
    >
      {buttonContent}
    </Button>
  );
}

export default function Web3Status(): JSX.Element {
  const { active, account } = useWeb3React();
  const contextNetwork = useWeb3React(NetworkContextName);

  const { ENSName } = useENSName(account ?? undefined);

  const allTransactions = useAllTransactions();

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);
  const confirmed = sortedRecentTransactions
    .filter((tx) => tx.receipt)
    .map((tx) => tx.hash);

  if (!contextNetwork.active && !active) {
    return <></>;
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
      />
    </>
  );
}
