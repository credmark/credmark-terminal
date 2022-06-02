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
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NextLink from 'next/link';
import React from 'react';

import { CmkTerminalIcon } from '~/components/icons';
import { FaqModal } from '~/components/pages/ApiAccess';
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
              bg={tier.isActive ? 'green.500' : undefined}
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
                <Icon
                  as={AttachMoneyOutlinedIcon}
                  fontSize="2xl"
                  color="purple.500"
                />
                <Text>
                  {tier.monthlyFeeUsd
                    ? `$${tier.monthlyFeeUsd} per month*`
                    : 'FREE'}
                </Text>
              </HStack>

              <HStack spacing="4">
                <Icon
                  as={tier.lockupPeriod ? LockIcon : LockOpenIcon}
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
                  as={CodeOutlinedIcon}
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
                  as={ApiOutlinedIcon}
                  fontSize="2xl"
                  color={tier.apiGatewayAccess ? 'purple.500' : undefined}
                />
                <Text>{tier.apiGatewayAccess || 'API Gateway Access'}</Text>
              </HStack>
              <HStack spacing="4" opacity={!tier.custom ? 0.4 : undefined}>
                <Icon
                  as={AutoAwesomeOutlinedIcon}
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
                    colorScheme={tier.isActive ? 'green' : 'purple'}
                    variant={tier.isActive ? 'solid' : 'outline'}
                    rightIcon={<Icon as={ArrowForwardOutlinedIcon} />}
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
          rightIcon={<Icon as={ArrowForwardOutlinedIcon} />}
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
