import {
  HStack,
  Icon,
  Link,
  VStack,
  Text,
  BoxProps,
  ButtonProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

import { PrimaryButton } from '~/components/base';
import Card from '~/components/base/Card';

interface FeatureCardProps extends BoxProps {
  title: string;
  subtitle: string;
  features: Array<{ icon: IconType | typeof Icon; text: string }>;
  actionButton:
    | {
        label: string;
        icon?: IconType | typeof Icon;
        isDisabled: true;
      }
    | {
        href: string;
        label: string;
        icon?: IconType | typeof Icon;
        isExternal?: boolean;
      };
}

export default function FeatureCard({
  title,
  subtitle,
  features,
  actionButton,
  ...boxProps
}: FeatureCardProps) {
  const ActionButton = (buttonProps: ButtonProps) => (
    <PrimaryButton
      leftIcon={actionButton.icon ? <Icon as={actionButton.icon} /> : undefined}
      {...buttonProps}
    >
      {actionButton.label}
    </PrimaryButton>
  );

  return (
    <Card alignSelf="center" {...boxProps}>
      <Text fontSize={'2xl'} fontWeight={'bold'}>
        {title}
      </Text>
      <Text color="gray.700" fontSize="lg" fontWeight={300}>
        {subtitle}
      </Text>
      <VStack my="8" align="stretch" spacing="3">
        {features.map((feat, index) => {
          return (
            <HStack key={index} spacing="3">
              <Icon as={feat.icon} boxSize="6" color="purple.500" />
              <Text fontSize="sm" lineHeight="1.1">
                {feat.text}
              </Text>
            </HStack>
          );
        })}
      </VStack>

      {'isDisabled' in actionButton ? (
        <ActionButton isDisabled />
      ) : actionButton.isExternal ? (
        <Link
          _hover={{ textDecoration: 'none' }}
          href={actionButton.href}
          isExternal
        >
          <ActionButton />
        </Link>
      ) : (
        <NextLink href={actionButton.href} passHref>
          <Link _hover={{ textDecoration: 'none' }}>
            <ActionButton />
          </Link>
        </NextLink>
      )}
    </Card>
  );
}
