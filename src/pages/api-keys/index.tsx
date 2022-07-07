import {
  Alert,
  Box,
  Center,
  Container,
  Heading,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { PrimaryButton } from '~/components/base';
import { useAccessKeys } from '~/hooks/useAccessKeys';
import { useActiveWeb3React } from '~/hooks/web3';

export default function ApiKeysPage() {
  const { account } = useActiveWeb3React();
  const accessKeys = useAccessKeys(account);

  return (
    <Container maxW="container.lg" p="8">
      <Heading mb="8" color="purple.500">
        Your API keys{' '}
        {accessKeys.loading && accessKeys.accessKeys && <Spinner />}
      </Heading>
      <Box>
        <NextLink href="/api-keys/mint">
          <PrimaryButton>Mint new key</PrimaryButton>
        </NextLink>
      </Box>
      {!account && (
        <Alert status="warning">
          Connect your wallet to view your API keys
        </Alert>
      )}
      {accessKeys.loading && !accessKeys.accessKeys && (
        <Center p="4">
          <Spinner />
        </Center>
      )}
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4} mt="8">
        {(accessKeys.accessKeys ?? []).map((accessKey) => (
          <LinkBox
            key={accessKey.tokenId.toString()}
            boxShadow="md"
            rounded="base"
            bg="white"
            p="4"
          >
            <Heading as="h3" fontSize="xl" mt="1">
              <NextLink
                href={`/api-keys/${accessKey.tokenId.toString()}`}
                passHref
              >
                <LinkOverlay _hover={{ textDecoration: 'underline' }}>
                  Access Key NFT #{accessKey.tokenId.toString()}
                </LinkOverlay>
              </NextLink>
            </Heading>
            <Text mt="2" fontSize="sm">
              Expires on{' '}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: 'long',
              }).format(accessKey.expiryTime)}
            </Text>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Container>
  );
}
