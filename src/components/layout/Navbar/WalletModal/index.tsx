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
import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { IoArrowBackSharp } from 'react-icons/io5';

import AccountDetails from '~/components/layout/Navbar/AccountDetails';
import { fortmatic, injected, portis } from '~/connectors';
import { OVERLAY_READY } from '~/connectors/Fortmatic';
import { SUPPORTED_WALLETS } from '~/constants/wallet';
import usePrevious from '~/hooks/usePrevious';
import { ApplicationModal } from '~/state/application/actions';
import { useModalOpen, useWalletModalToggle } from '~/state/application/hooks';

import Option from './Option';
import PendingView from './PendingView';

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
  const { active, account, connector, activate, error } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const [pendingWallet, setPendingWallet] = useState<
    AbstractConnector | undefined
  >();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);
  const toggleWalletModal = useWalletModalToggle();

  const previousAccount = usePrevious(account);

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
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  useEffect(() => {
    if (
      walletModalOpen &&
      ((active && !activePrevious) ||
        (connector && connector !== connectorPrevious && !error))
    ) {
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [
    setWalletView,
    active,
    error,
    connector,
    walletModalOpen,
    activePrevious,
    connectorPrevious,
  ]);

  const tryActivation = async (connector: AbstractConnector | undefined) => {
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return SUPPORTED_WALLETS[key].name;
      }
      return true;
    });
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

    connector &&
      activate(connector, undefined, true).catch((error) => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector); // a little janky...can't use setError because the connector isn't set
        } else {
          setPendingError(true);
        }
      });
  };

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal();
    });
  }, [toggleWalletModal]);

  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null;
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector &&
                  !option.href &&
                  tryActivation(option.connector);
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={option.iconURL}
            />
          );
        }
        return null;
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={'Install Metamask'}
                subheader={null}
                link={'https://metamask.io/'}
                icon="/img/wallet/metamask.svg"
              />
            );
          } else {
            return null; //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector
                ? setWalletView(WALLET_VIEWS.ACCOUNT)
                : !option.href && tryActivation(option.connector);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={option.iconURL}
          />
        )
      );
    });
  }

  function getModalContent() {
    if (error) {
      return (
        <>
          <ModalHeader>
            {error instanceof UnsupportedChainIdError
              ? 'Wrong Network'
              : 'Error connecting'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error instanceof UnsupportedChainIdError ? (
              <h5>Please connect to the appropriate Ethereum network.</h5>
            ) : (
              'Error connecting. Try refreshing the page.'
            )}
          </ModalBody>
        </>
      );
    }

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
              leftIcon={<Icon as={IoArrowBackSharp} />}
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
          <Box
            bg="purple.50"
            py="2"
            px="4"
            rounded="md"
            color="purple.500"
            mb="4"
            fontSize="sm"
          >
            <Text>
              By connecting a wallet, you agree to Credmark&apos;s{' '}
              <Link
                href="https://github.com/credmark/legal/blob/master/terms-of-service.md"
                isExternal
                textDecoration="underline"
              >
                Terms of Service
              </Link>{' '}
              and acknowledge that you have read and understand the{' '}
              <Link
                href="https://github.com/credmark/legal/blob/master/disclaimer.md"
                isExternal
                textDecoration="underline"
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
            <Flex direction="column">{getOptions()}</Flex>
          )}
        </ModalBody>
      </>
    );
  }

  return (
    <Modal isOpen={walletModalOpen} onClose={toggleWalletModal} isCentered>
      <ModalOverlay />
      <ModalContent rounded="base" bg="purple.500" color="white" shadow="2xl">
        {getModalContent()}
      </ModalContent>
    </Modal>
  );
}
