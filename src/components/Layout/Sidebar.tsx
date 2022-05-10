import {
  Box,
  HStack,
  Icon,
  VStack,
  Text,
  Link,
  BoxProps,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  IoCaretBackSharp,
  IoCaretDownSharp,
  IoCaretForwardSharp,
} from 'react-icons/io5';
import {
  MdApi,
  MdCode,
  MdOutlineHome,
  MdOutlineVerified,
} from 'react-icons/md';

import { CmkTerminalIcon } from '~/components/Icons';

interface NavItemProps extends BoxProps {
  icon?: IconType | typeof Icon;
  label: string;
  isActive?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  href?: string;
  onClick?: () => void;

  backIcon?: boolean;
  forwardIcon?: boolean;

  subNav?: Array<NavItemProps>;
}

function NavItem({
  icon,
  label,
  isActive = false,
  isFocused = false,
  isDisabled = false,
  href,
  onClick,
  backIcon,
  forwardIcon,
  subNav,

  ...boxProps
}: NavItemProps) {
  const inner = (
    <HStack
      onClick={onClick}
      justify="flex-start"
      px="4"
      py="3"
      rounded="md"
      bg={isActive ? 'pink.500' : undefined}
      color={
        isActive
          ? 'white'
          : isFocused
          ? 'pink.500'
          : isDisabled
          ? 'gray.300'
          : 'purple.500'
      }
      cursor={isActive || (subNav && subNav.length) ? undefined : 'pointer'}
      borderColor="pink.500"
      borderWidth={isFocused ? '1px' : 0}
      transitionDuration="normal"
      transitionProperty="common"
      _hover={
        isActive || (subNav && subNav.length)
          ? {}
          : {
              bg: 'pink.50',
            }
      }
      {...boxProps}
    >
      {backIcon && <Icon as={IoCaretBackSharp} />}
      {icon && <Icon as={icon} boxSize="5" />}
      <Text flex="1">{label}</Text>
      {forwardIcon && <Icon as={IoCaretForwardSharp} />}
      {subNav && subNav.length > 0 && <Icon as={IoCaretDownSharp} />}
    </HStack>
  );

  if (subNav && subNav.length > 0) {
    return (
      <VStack alignItems="stretch">
        {inner}
        {subNav.map((child) => (
          <Box key={child.label} pl="4">
            <NavItem {...child} />
          </Box>
        ))}
      </VStack>
    );
  }

  if (href) {
    return (
      <NextLink href={href} passHref>
        <Link _hover={{ textDecoration: 'none' }}>{inner}</Link>
      </NextLink>
    );
  }

  return inner;
}

interface SidebarProps extends BoxProps {
  fixedWidth: number;
}

export default function Sidebar({ fixedWidth, ...boxProps }: SidebarProps) {
  const router = useRouter();
  const [showTerminalItems, setShowTerminalItems] = useState(
    router.pathname.startsWith('/terminal/'),
  );

  return (
    <Box
      w={fixedWidth}
      minW={fixedWidth}
      minH="100vh"
      h="100%"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      position="relative"
      overflow="hidden"
      {...boxProps}
    >
      <VStack
        align="stretch"
        spacing="2"
        position="absolute"
        top="0"
        left={showTerminalItems ? -fixedWidth : 0}
        w="100%"
        bottom="0"
        pt="6"
        px="4"
        transitionProperty="left"
        transitionDuration="normal"
      >
        <NavItem
          icon={MdOutlineHome}
          label="Home"
          href="/"
          isActive={router.pathname === '/'}
        />
        <NavItem
          icon={CmkTerminalIcon}
          label="Risk Terminal"
          isFocused={router.pathname.startsWith('/terminal')}
          onClick={() => setShowTerminalItems(true)}
          forwardIcon
        />
        <NavItem
          icon={MdApi}
          label="Membership"
          href="/api-access"
          isActive={router.pathname === '/api-access'}
        />
        <NavItem icon={MdCode} label="Model Development" isDisabled />
        <NavItem icon={MdOutlineVerified} label="Model Validation" isDisabled />
      </VStack>
      <VStack
        align="stretch"
        spacing="2"
        position="absolute"
        top="0"
        left={showTerminalItems ? 0 : fixedWidth}
        w="100%"
        bottom="0"
        pt="6"
        px="4"
        transitionProperty="left"
        transitionDuration="normal"
      >
        <NavItem
          icon={MdOutlineHome}
          label="Home"
          onClick={() => setShowTerminalItems(false)}
          backIcon
        />
        <NavItem
          label="Lenders"
          href="/terminal/lenders"
          isActive={router.pathname === '/terminal/lenders'}
        />
        <NavItem
          label="DEXs"
          isFocused={router.pathname.startsWith('/terminal/dex')}
          subNav={[
            {
              label: 'Uniswap V2',
              href: '/terminal/dex/uniswap-v2',
              isActive: router.pathname === '/terminal/dex/uniswap-v2',
            },
            {
              label: 'Uniswap V3',
              href: '/terminal/dex/uniswap-v3',
              isActive: router.pathname === '/terminal/dex/uniswap-v3',
            },
            {
              label: 'Curve',
              href: '/terminal/dex/curve',
              isActive: router.pathname === '/terminal/dex/curve',
            },
            {
              label: 'Sushiswap',
              href: '/terminal/dex/sushi',
              isActive: router.pathname === '/terminal/dex/sushi',
            },
          ]}
        />
      </VStack>
    </Box>
  );
}
