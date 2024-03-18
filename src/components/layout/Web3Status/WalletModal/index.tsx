import {
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  ModalOverlay,
  Box,
  Icon,
} from '@chakra-ui/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import AccountDetails from '~/components/layout/Web3Status/AccountDetails';
import { Connector, SUPPORTED_WALLETS } from '~/constants/wallet';
import usePrevious from '~/hooks/usePrevious';
import { ApplicationModal } from '~/state/application/actions';
import { useModalOpen, useWalletModalToggle } from '~/state/application/hooks';

import PendingView from './PendingView';
import WalletConnector from './WalletConnector';

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
};

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[]; // hashes of pending
  confirmedTransactions: string[]; // hashes of confirmed
  ENSName?: string;
}): JSX.Element {
  // important that these are destructed from the account-specific web3-react context
  const { account, connector, isActive } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const [pendingWallet, setPendingWallet] = useState<Connector | undefined>();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
  const toggleWalletModal = useWalletModalToggle();

  const previousAccount = usePrevious(account);

  useEffect(() => {
    Object.values(SUPPORTED_WALLETS).forEach((wallet) =>
      wallet.connector.connectEagerly().catch(() => {
        console.debug(`Failed to connect eagerly to ${wallet.name}`);
      }),
    );
  }, []);

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  // close modal when a connection is successful
  const isActivePrevious = usePrevious(isActive);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (
      walletModalOpen &&
      ((isActive && !isActivePrevious) ||
        (connector && connector !== connectorPrevious))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    isActive,
    connector,
    walletModalOpen,
    isActivePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (connector: Connector) => {
    // log selected wallet
    setPendingWallet(connector); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    // if (
    //   connector instanceof WalletConnectConnector &&
    //   connector.walletConnectProvider?.wc?.uri
    // ) {
    //   connector.walletConnectProvider = undefined;
    // }

    // if (connector instanceof WalletConnect) {
    //   console.log('togg');
    //   toggleWalletModal();
    // }

    connector.activate().catch(() => {
      setPendingError(true);
    });
  };

  function getModalContent() {
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <>
          <ModalHeader>Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AccountDetails
              pendingTransactions={pendingTransactions}
              confirmedTransactions={confirmedTransactions}
              ENSName={ENSName}
              openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
            />
          </ModalBody>
        </>
      );
    }

    return (
      <>
        <ModalCloseButton />
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <ModalHeader>
            <Button
              size="sm"
              leftIcon={<Icon as={ArrowBackIcon} />}
              variant="outline"
              colorScheme="white"
              onClick={() => {
                setPendingError(false);
                setWalletView(WALLET_VIEWS.ACCOUNT);
              }}
            >
              Back
            </Button>
          </ModalHeader>
        ) : (
          <ModalHeader>Connect to a wallet</ModalHeader>
        )}

        <ModalBody>
          <Box color="green.500" mb="4" fontSize="sm">
            <Text>
              By connecting a wallet, you agree to Credmark&apos;s{' '}
              <Link
                href="https://github.com/credmark/legal/blob/master/terms-of-service.md"
                isExternal
                textDecoration="underline"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>{' '}
              and acknowledge that you have read and understand the{' '}
              <Link
                href="https://github.com/credmark/legal/blob/master/disclaimer.md"
                isExternal
                textDecoration="underline"
                aria-label="Credmark disclaimer"
              >
                Credmark disclaimer
              </Link>
              .
            </Text>
          </Box>

          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <Flex direction="column">
              {Object.entries(SUPPORTED_WALLETS).map(([key, wallet]) => (
                <WalletConnector
                  key={key}
                  wallet={wallet}
                  onClick={tryActivation}
                />
              ))}
            </Flex>
          )}
        </ModalBody>
      </>
    );
  }

  return (
    <Modal isOpen={walletModalOpen} onClose={toggleWalletModal} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.300" />
      <ModalContent rounded="base" bg="purple.800" color="white" shadow="2xl">
        {getModalContent()}
      </ModalContent>
    </Modal>
  );
}
