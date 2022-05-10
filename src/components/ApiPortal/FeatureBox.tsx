import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  VStack,
  Text,
  BoxProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { IconType } from 'react-icons';

interface FeatureBoxProps extends BoxProps {
  title: string;
  subtitle: string;
  features: Array<{ icon: IconType; text: string }>;
  actionButton:
    | {
        label: string;
        icon: IconType;
        isDisabled: true;
      }
    | {
        href: string;
        label: string;
        icon: IconType;
      };
}

export default function FeatureBox({
  title,
  subtitle,
  features,
  actionButton,
  ...boxProps
}: FeatureBoxProps) {
  return (
    <Box
      shadow="xl"
      rounded="sm"
      bg="white"
      alignSelf="center"
      px="6"
      py="8"
      {...boxProps}
    >
      <Text fontSize={'xl'} fontWeight={'bold'}>
        {title}
      </Text>
      <Text color="gray.700" fontWeight={300}>
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
        <Button
          colorScheme="pink"
          leftIcon={<Icon as={actionButton.icon} />}
          isDisabled
        >
          {actionButton.label}
        </Button>
      ) : (
        <NextLink href={actionButton.href} passHref>
          <Link _hover={{ textDecoration: 'none' }}>
            <Button
              colorScheme="pink"
              leftIcon={<Icon as={actionButton.icon} />}
            >
              {actionButton.label}
            </Button>
          </Link>
        </NextLink>
      )}
    </Box>
  );
}
