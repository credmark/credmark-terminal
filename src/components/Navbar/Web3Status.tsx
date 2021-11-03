import { Button, Spinner, Text } from '@chakra-ui/react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import React, { useMemo } from 'react';

import WalletModal from '~/components/WalletModal';
import { NetworkContextName } from '~/constants/misc';
import useENSName from '~/hooks/useENSName';
import { useWalletModalToggle } from '~/state/application/hooks';
import {
  isTransactionRecent,
  useAllTransactions,
} from '~/state/transactions/hooks';
import { TransactionDetails } from '~/state/transactions/reducer';
import shortenAddress from '~/utils/shortenAddress';

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

  const hasPendingTransactions = !!pending.length;
  const toggleWalletModal = useWalletModalToggle();

  if (account) {
    return (
      <Button
        onClick={toggleWalletModal}
        rounded="full"
        colorScheme="purple"
        variant="outline"
        fontSize="sm"
        px="8"
      >
        {hasPendingTransactions ? (
          <>
            <Text>{pending?.length} Pending</Text> <Spinner ml="2" />
          </>
        ) : (
          <>
            <Text>{ENSName || shortenAddress(account)}</Text>
          </>
        )}
      </Button>
    );
  } else if (error) {
    return (
      <Button
        onClick={toggleWalletModal}
        rounded="full"
        colorScheme="purple"
        variant="outline"
        fontSize="sm"
        px="8"
      >
        <Text>
          {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
        </Text>
      </Button>
    );
  } else {
    return (
      <Button
        onClick={toggleWalletModal}
        rounded="full"
        colorScheme="purple"
        variant="outline"
        fontSize="sm"
        px="8"
      >
        CONNECT WALLET
      </Button>
    );
  }
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
