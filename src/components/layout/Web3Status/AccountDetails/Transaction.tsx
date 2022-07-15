import { Box, Link, Text, Spinner, HStack, Icon } from '@chakra-ui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import React from 'react';

import { useActiveWeb3React } from '~/hooks/web3';
import { useAllTransactions } from '~/state/transactions/hooks';
import { ExplorerDataType, getExplorerLink } from '~/utils/getExplorerLink';

export default function Transaction({ hash }: { hash: string }): JSX.Element {
  const { chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined');

  if (!chainId) return <></>;

  return (
    <Box>
      <Link
        href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
        isExternal
      >
        <HStack>
          <Text flex="1">{summary ?? hash} ↗</Text>
          {pending ? (
            <Spinner />
          ) : success ? (
            <Icon as={CheckCircleIcon} boxSize="6" color="green.500" />
          ) : (
            <Icon as={ErrorIcon} boxSize="6" color="red.500" />
          )}
        </HStack>
      </Link>
    </Box>
  );
}
