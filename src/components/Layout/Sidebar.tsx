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
import React, { useMemo, useState } from 'react';
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
  isFocused = false,
  isDisabled = false,
  href,
  onClick,
  backIcon,
  forwardIcon,
  subNav,

  ...boxProps
}: NavItemProps) {
  const router = useRouter();
  const isActive = href && router.pathname === href;

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

  const homeItems = useMemo<NavItemProps[]>(
    () => [
      { icon: MdOutlineHome, label: 'Home', href: '/' },
      {
        icon: CmkTerminalIcon,
        label: 'Risk Terminal',
        isFocused: router.pathname.startsWith('/terminal'),
        onClick: () => setShowTerminalItems(true),
        forwardIcon: true,
      },
      { icon: MdApi, label: 'Membership', href: '/api-access' },
      { icon: MdCode, label: 'Model Development', isDisabled: true },
      { icon: MdOutlineVerified, label: 'Model Validation', isDisabled: true },
    ],
    [router.pathname],
  );

  const terminalItems = useMemo<NavItemProps[]>(
    () => [
      {
        icon: MdOutlineHome,
        label: 'Home',
        onClick: () => setShowTerminalItems(false),
        backIcon: true,
      },
      { label: 'Model Usage', href: '/models/usage' },
      { label: 'Lenders', href: '/terminal/lenders' },
      {
        label: 'DEXs',
        isFocused: router.pathname.startsWith('/terminal/dex'),
        subNav: [
          {
            label: 'Uniswap V2',
            href: '/terminal/dex/uniswap-v2',
          },
          {
            label: 'Uniswap V3',
            href: '/terminal/dex/uniswap-v3',
          },
          {
            label: 'Curve',
            href: '/terminal/dex/curve',
          },
          {
            label: 'Sushiswap',
            href: '/terminal/dex/sushi',
          },
        ],
      },
    ],
    [router.pathname],
  );

  function getLinks(items: NavItemProps[]): string[] {
    const links: string[] = [];
    for (const item of items) {
      if (item.href) {
        links.push(item.href);
      }

      if (Array.isArray(item.subNav)) {
        links.push(...getLinks(item.subNav));
      }
    }

    return links;
  }

  const terminalLinks = getLinks(terminalItems);

  const [showTerminalItems, setShowTerminalItems] = useState(
    terminalLinks.includes(router.pathname),
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
        {homeItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
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
        {terminalItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </VStack>
    </Box>
  );
}
