import {
  Box,
  Button,
  Container,
  HStack,
  Icon,
  Link,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  MdApi,
  MdArrowForward,
  MdAttachMoney,
  MdAutoAwesome,
  MdCode,
  MdLock,
  MdLockOpen,
} from 'react-icons/md';

import FaqModal from '~/components/ApiPortal/FaqModal';
import { CmkTerminalIcon } from '~/components/Icons';
import { TIERS } from '~/constants/tiers';
import { useHiddenSidebar } from '~/state/application/hooks';

export default function ApiAccessTiersPage() {
  useHiddenSidebar(true);

  const faq = useDisclosure();

  return (
    <Container maxW="container.xl" py="20" minH="90vh">
      <Box>
        <Text
          my="2"
          mb="8"
          fontSize={{ sm: '2xl', md: '4xl' }}
          textAlign="center"
          fontWeight={300}
          lineHeight={1.2}
        >
          Select a Membership to Unlock the
          <br /> Tools You Need
        </Text>
      </Box>

      <Stack
        direction={{ base: 'column', lg: 'row' }}
        spacing="8"
        justify="center"
        align="center"
      >
        {TIERS.map((tier) => (
          <Box
            minW={{ base: '400px', lg: '300px' }}
            key={tier.label}
            bg="white"
            shadow="md"
            rounded="base"
            overflow="hidden"
          >
            <Box
              textAlign="center"
              w="full"
              bg={tier.isActive ? 'pink.500' : undefined}
              color={tier.isActive ? 'white' : undefined}
              py="4"
              fontSize="xl"
              fontWeight="bold"
            >
              {tier.label}
            </Box>
            <Box textAlign="center" my="8" lineHeight={1.1}>
              <Text fontSize="5xl" fontWeight="300">
                {tier.rewardMultiplier}x
              </Text>
              <Text>CMK Staking Rewards</Text>
            </Box>

            <VStack my="8" px="6" align="stretch" spacing="4">
              <HStack spacing="4">
                <Icon as={MdAttachMoney} fontSize="2xl" color="purple.500" />
                <Text>
                  {tier.monthlyFeeUsd
                    ? `$${tier.monthlyFeeUsd} per month*`
                    : 'FREE'}
                </Text>
              </HStack>

              <HStack spacing="4">
                <Icon
                  as={tier.lockupPeriod ? MdLock : MdLockOpen}
                  fontSize="2xl"
                  color="purple.500"
                />
                <Text>{tier.lockupPeriod || 'No'} Lockup Period</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!tier.modelFramework ? 0.4 : undefined}
              >
                <Icon
                  as={MdCode}
                  fontSize="2xl"
                  color={tier.modelFramework ? 'purple.500' : undefined}
                />
                <Text>Model Framework</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!tier.terminalAccess ? 0.4 : undefined}
              >
                <CmkTerminalIcon
                  fontSize="2xl"
                  color={tier.terminalAccess ? 'purple.500' : undefined}
                />
                <Text>Credmark Terminal Access</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!tier.apiGatewayAccess ? 0.4 : undefined}
              >
                <Icon
                  as={MdApi}
                  fontSize="2xl"
                  color={tier.apiGatewayAccess ? 'purple.500' : undefined}
                />
                <Text>{tier.apiGatewayAccess || 'API Gateway Access'}</Text>
              </HStack>
              <HStack spacing="4" opacity={!tier.custom ? 0.4 : undefined}>
                <Icon
                  as={MdAutoAwesome}
                  fontSize="2xl"
                  color={tier.custom ? 'purple.500' : undefined}
                />
                <Text>Custom Models &amp; Reports</Text>
              </HStack>
            </VStack>

            <Box textAlign="center" my="8">
              <NextLink href={`/api-access/mint?tier=${tier.label}`} passHref>
                <Link _hover={{ textDecoration: 'none' }}>
                  <Button
                    size="lg"
                    colorScheme={tier.isActive ? 'pink' : 'purple'}
                    variant={tier.isActive ? 'solid' : 'outline'}
                    rightIcon={<Icon as={MdArrowForward} />}
                    minW="48"
                  >
                    Join
                  </Button>
                </Link>
              </NextLink>
            </Box>
          </Box>
        ))}
      </Stack>
      <Box textAlign="center" mt="16" maxW="container.sm" mx="auto">
        <Button
          size="lg"
          rightIcon={<Icon as={MdArrowForward} />}
          variant="link"
          color="gray.800"
          fontWeight={300}
          onClick={faq.onToggle}
        >
          Need Help? Check Out Our FAQ
        </Button>
        <Text color="gray.400" textAlign="center" fontSize="sm" mt="4">
          * Costs are denominated in USD, and access is stored as staked CMK.
          Changes in the price are subject to a DAO Governance Vote.
        </Text>
      </Box>
      <FaqModal {...faq} />
    </Container>
  );
}
