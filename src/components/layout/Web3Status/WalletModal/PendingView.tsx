import {
  Alert,
  Box,
  Button,
  HStack,
  Icon,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import ErrorIcon from '@mui/icons-material/Error';
import { AbstractConnector } from '@web3-react/abstract-connector';
import React from 'react';

import { injected } from '~/connectors';
import { SUPPORTED_WALLETS } from '~/constants/wallet';

import Option from './Option';

export default function PendingView({
  connector,
  error = false,
  setPendingError,
  tryActivation,
}: {
  connector?: AbstractConnector;
  error?: boolean;
  setPendingError: (error: boolean) => void;
  tryActivation: (connector: AbstractConnector) => void;
}): JSX.Element {
  const isMetamask = window?.ethereum?.isMetaMask;

  return (
    <>
      <Box py="20">
        {error ? (
          <Alert status="error" rounded="md">
            <Icon as={ErrorIcon} mr="2" color="red.500"></Icon>
            <Text color="red.500">Error connecting</Text>
            <Spacer />
            <Button
              colorScheme="red"
              size="sm"
              variant="ghost"
              onClick={() => {
                setPendingError(false);
                connector && tryActivation(connector);
              }}
            >
              Try Again
            </Button>
          </Alert>
        ) : (
          <HStack justify="center" color="green.500">
            <Spinner />
            <Text>Initializing...</Text>
          </HStack>
        )}
      </Box>
      {Object.keys(SUPPORTED_WALLETS).map((key) => {
        const option = SUPPORTED_WALLETS[key];
        if (option.connector === connector) {
          if (option.connector === injected) {
            if (isMetamask && option.name !== 'MetaMask') {
              return null;
            }
            if (!isMetamask && option.name === 'MetaMask') {
              return null;
            }
          }
          return (
            <Option
              id={`connect-${key}`}
              key={key}
              clickable={false}
              color={option.color}
              header={option.name}
              subheader={option.description}
              icon={option.iconURL}
            />
          );
        }
        return null;
      })}
    </>
  );
}
