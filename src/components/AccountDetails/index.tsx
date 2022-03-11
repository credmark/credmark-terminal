import {
  Text,
  Button,
  Flex,
  Box,
  Heading,
  Link,
  Badge,
  Divider,
  VStack,
} from '@chakra-ui/react';
import React from 'react';

import { injected, walletlink } from '~/connectors';
import { SUPPORTED_WALLETS } from '~/constants/wallet';
import { useActiveWeb3React } from '~/hooks/web3';
import { useETHBalances } from '~/state/wallet/hooks';
import { ExplorerDataType, getExplorerLink } from '~/utils/getExplorerLink';

import Transaction from './Transaction';

const NETWORK_LABELS: { [chainId: number]: string } = {
  [4]: 'Rinkeby',
  [3]: 'Ropsten',
  [5]: 'Göerli',
  [42]: 'Kovan',
};

interface AccountDetailsProps {
  pendingTransactions: string[];
  confirmedTransactions: string[];
  ENSName?: string;
  openOptions: () => void;
}

export default function AccountDetails({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
}: AccountDetailsProps): JSX.Element {
  const { chainId, account, connector } = useActiveWeb3React();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[
    account ?? ''
  ];

  function formatConnectorName() {
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter(
        (k) =>
          SUPPORTED_WALLETS[k].connector === connector &&
          (connector !== injected || isMetaMask === (k === 'METAMASK')),
      )
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return <Text color="white">Connected with {name}</Text>;
  }

  return (
    <Box pb="8">
      <Flex mb="8">
        <Text flex="1" color="gray.500">
          {formatConnectorName()}
        </Text>
        {connector !== injected && connector !== walletlink && (
          <Button
            size="xs"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (connector as any).close();
            }}
          >
            Disconnect
          </Button>
        )}
        <Button
          colorScheme="pink"
          size="xs"
          onClick={() => {
            openOptions();
          }}
        >
          Change
        </Button>
      </Flex>
      <Flex align={'center'} justify="center" mb="4">
        <Flex textAlign="center">
          {account && (
            <Badge
              variant="subtle"
              fontSize="md"
              colorScheme="pink"
              px="4"
              roundedLeft="md"
              roundedRight={chainId && NETWORK_LABELS[chainId] ? 'none' : 'md'}
            >
              {userEthBalance?.toSignificant(4) ?? '0.00'} ETH
            </Badge>
          )}
          {chainId && NETWORK_LABELS[chainId] && (
            <Badge
              variant="outline"
              fontSize="md"
              colorScheme="pink"
              px="4"
              roundedLeft="none"
              roundedRight="md"
            >
              {NETWORK_LABELS[chainId]}
            </Badge>
          )}
        </Flex>
      </Flex>
      <Box>
        <Heading as="h3" fontSize="md">
          {ENSName ? <>{ENSName}</> : <>{account}</>}
        </Heading>
      </Box>
      {chainId && account && (
        <Box>
          <Link
            color="gray.300"
            fontSize="xs"
            fontWeight="medium"
            target="_blank"
            href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}
          >
            View on Etherscan
          </Link>
        </Box>
      )}
      <Divider mt="6" mb="4" bg="purple.500" />
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <Box>
          <Heading as="h6" fontSize="md">
            Recent Transactions
          </Heading>
          <VStack align="stretch" spacing="2" mt="3">
            {[...pendingTransactions, ...confirmedTransactions].map(
              (transaction) => (
                <Transaction hash={transaction} key={transaction} />
              ),
            )}
          </VStack>
        </Box>
      ) : (
        <Box py="4" px="6">
          <Text textAlign="center" fontSize="sm" color="gray.500">
            Your transactions will appear here...
          </Text>
        </Box>
      )}
    </Box>
  );
}
